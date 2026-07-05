// Pure calculation engine — takes the current form selections plus the
// pricing config and derives every line item shown in the estimate, both
// client-facing (pricing, "why" explanations) and internal-only
// (labor/chemical/travel cost, gross profit, margin). No React, no side
// effects.

import { pricingConfig } from '../config/pricingConfig'
import type { EstimateResult, EstimateSelections, VehicleSizeId } from '../types'

function findById<T extends { id: string }>(items: T[], id: string): T | undefined {
  return items.find((item) => item.id === id)
}

function roundToStep(value: number, step: number): number {
  if (step <= 0) return value
  return Math.round(value / step) * step
}

/**
 * @param inspectionFindings Plain-language findings (e.g. "Water Spots — Moderate")
 *   from the inspection, folded into the condition line's justification.
 * @param addOnReasons Recommendation-engine reasons keyed by add-on id, shown
 *   as a "why" caption under any add-on that was suggested by the inspection.
 */
export function calculateEstimate(
  selections: EstimateSelections,
  inspectionFindings: string[] = [],
  addOnReasons: Record<string, string> = {},
): EstimateResult {
  const { vehicleTypes, vehicleSizes, conditions, services, addOns, travel, discounts, labor } = pricingConfig

  const service = findById(services, selections.serviceId) ?? services[0]
  const vehicleType = findById(vehicleTypes, selections.vehicleTypeId) ?? vehicleTypes[0]
  const vehicleSize = findById(vehicleSizes, selections.vehicleSizeId) ?? vehicleSizes[0]
  const condition = findById(conditions, selections.conditionId) ?? conditions[0]

  // Pricing is looked up per size directly (not a flat base × multiplier —
  // real size pricing isn't a clean ratio across every package). "Medium"
  // is the anchor shown as the Base Service line; the chosen size's dollar
  // difference from that anchor is the Size & Access line.
  const sizeId = vehicleSize.id as VehicleSizeId
  const basePrice = service.basePriceBySize.medium
  const afterSize = service.basePriceBySize[sizeId] ?? basePrice
  const afterVehicleType = afterSize * vehicleType.multiplier
  const afterCondition = afterVehicleType * condition.multiplier

  const sizeAccessAmount = afterSize - basePrice
  const vehicleComplexityAmount = afterVehicleType - afterSize
  const conditionFindingsAmount = afterCondition - afterVehicleType

  const adjustedBase = afterCondition

  // Add-ons
  const selectedAddOns = selections.addOnIds
    .map((id) => findById(addOns, id))
    .filter((a): a is NonNullable<typeof a> => Boolean(a))

  const addOnLineItems = selectedAddOns.map((addOn) => ({
    label: addOn.label,
    amount: addOn.price,
    reason: addOnReasons[addOn.id],
  }))
  const addOnsTotal = selectedAddOns.reduce((sum, addOn) => sum + addOn.price, 0)

  // Travel
  const billableMiles = Math.max(0, selections.travelMiles - travel.freeMiles)
  const travelFee = billableMiles * travel.pricePerMile

  const subtotal = adjustedBase + addOnsTotal + travelFee

  // Discount
  let discountPercentage = 0
  let discountLabel = 'None'
  if (selections.discountId !== 'none') {
    if (selections.discountId === 'custom') {
      discountPercentage = Math.max(0, selections.customDiscountPercent) / 100
      discountLabel = `Custom (${selections.customDiscountPercent}%)`
    } else {
      const discount = findById(discounts, selections.discountId)
      if (discount) {
        discountPercentage = discount.percentage
        discountLabel = `${discount.label} (${(discount.percentage * 100).toFixed(0)}%)`
      }
    }
  }
  const discountAmount = subtotal * discountPercentage
  const total = subtotal - discountAmount

  // Labor hours: base service hours scaled by size + condition, plus each
  // selected add-on's own labor contribution.
  const baseLaborScaled = service.baseLaborHours * vehicleSize.multiplier * condition.multiplier
  const addOnLaborHours = selectedAddOns.reduce((sum, addOn) => sum + addOn.laborHours, 0)
  const laborHours = baseLaborScaled + addOnLaborHours

  const threshold =
    labor.teamSizeThresholds.find((t) => laborHours <= t.maxLaborHours) ??
    labor.teamSizeThresholds[labor.teamSizeThresholds.length - 1]
  const teamSize = threshold.teamSize
  const teamSizeLabel = threshold.label

  const rawAppointmentLength = laborHours / teamSize
  const appointmentLengthHours = Math.max(
    labor.appointmentRoundingHours,
    roundToStep(rawAppointmentLength, labor.appointmentRoundingHours),
  )

  // Internal profitability — never shown on a client-facing estimate.
  const laborCost = laborHours * labor.ratePerHour
  const scaledServiceChemicalCost = service.chemicalCost * vehicleSize.multiplier * condition.multiplier
  const addOnChemicalCost = selectedAddOns.reduce((sum, addOn) => sum + addOn.chemicalCost, 0)
  const chemicalCost = scaledServiceChemicalCost + addOnChemicalCost
  // Fuel/vehicle-wear cost accrues for the whole trip, not just the miles
  // billed to the client beyond the free radius.
  const travelCost = selections.travelMiles * labor.travelCostPerMile
  const grossProfit = total - laborCost - chemicalCost - travelCost
  const marginPercent = total > 0 ? grossProfit / total : 0
  const revenuePerLaborHour = laborHours > 0 ? total / laborHours : 0
  const belowMarginWarning = marginPercent < labor.marginWarningThreshold

  return {
    baseService: { label: service.label, amount: basePrice },
    vehicleComplexity: {
      label: vehicleType.label,
      amount: vehicleComplexityAmount,
      factors: vehicleType.factors,
    },
    sizeAccess: {
      label: vehicleSize.label,
      amount: sizeAccessAmount,
      factors: vehicleSize.factors,
    },
    conditionFindings: {
      label: condition.label,
      amount: conditionFindingsAmount,
      factors: [...(condition.factors ?? []), ...inspectionFindings],
    },
    addOnLineItems,
    addOnsTotal,
    travelFee,
    travelMilesBilled: billableMiles,
    subtotal,
    discountLabel,
    discountAmount,
    total,
    laborHours,
    teamSize,
    teamSizeLabel,
    appointmentLengthHours,
    laborCost,
    chemicalCost,
    travelCost,
    grossProfit,
    marginPercent,
    revenuePerLaborHour,
    belowMarginWarning,
  }
}

export function defaultSelections(): EstimateSelections {
  return {
    serviceId: pricingConfig.services[0].id,
    vehicleTypeId: pricingConfig.vehicleTypes[0].id,
    vehicleSizeId: pricingConfig.vehicleSizes[1]?.id ?? pricingConfig.vehicleSizes[0].id,
    conditionId: pricingConfig.conditions[0].id,
    addOnIds: [],
    travelMiles: 0,
    discountId: 'none',
    customDiscountPercent: 0,
  }
}
