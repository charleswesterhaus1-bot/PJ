// Pure calculation engine — takes the current form selections plus the
// pricing config and derives every line item shown in the estimate, both
// client-facing (pricing) and internal-only (labor/material/travel cost,
// gross profit, margin). No React, no side effects.

import { pricingConfig } from '../config/pricingConfig'
import type { EstimateResult, EstimateSelections, VehicleClassId } from '../types'

function findById<T extends { id: string }>(items: T[], id: string): T | undefined {
  return items.find((item) => item.id === id)
}

const BASELINE_CLASS: VehicleClassId = 'sports-car'

export function calculateEstimate(selections: EstimateSelections): EstimateResult {
  const { vehicleTypes, exteriorConditions, interiorConditions, services, addOns, travel, discounts, labor } = pricingConfig

  const service = findById(services, selections.serviceId) ?? services[0]
  const vehicleClass = findById(vehicleTypes, selections.vehicleTypeId) ?? vehicleTypes[0]
  const exteriorCondition = findById(exteriorConditions, selections.exteriorConditionId) ?? exteriorConditions[0]
  const interiorCondition = findById(interiorConditions, selections.interiorConditionId) ?? interiorConditions[0]

  // Pricing is looked up per vehicle class directly (not a flat base ×
  // multiplier — real class pricing isn't a clean ratio across every
  // package). "Sports Car" is the anchor shown as the Base Service line;
  // the chosen class's dollar difference from that anchor is the "Exotic
  // Vehicle Handling & Protection" line.
  const classId = vehicleClass.id as VehicleClassId
  const basePrice = service.basePriceByClass[BASELINE_CLASS]
  const afterClass = service.basePriceByClass[classId] ?? basePrice
  const vehicleComplexityAmount = afterClass - basePrice

  // Exterior and Interior Condition are each a flat surcharge — the same
  // dollar amount regardless of vehicle class or selected service.
  const exteriorSurcharge = exteriorCondition.surcharge
  const interiorSurcharge = interiorCondition.surcharge

  // Add-ons — only ones actually valid for the selected service are ever
  // passed in via selections.addOnIds (the UI hides/prunes the rest), but
  // filter again here so a stale selection can never silently price in.
  const selectedAddOns = selections.addOnIds
    .map((id) => findById(addOns, id))
    .filter((a): a is NonNullable<typeof a> => Boolean(a) && Boolean(a?.availableForServiceIds.includes(selections.serviceId)))

  // A handful of add-ons (currently just Pet Hair Removal) are a "starting
  // at" price the technician can add to on the spot for severity — that
  // surcharge is pure additional revenue with no extra modeled labor/
  // material cost, same as the Exterior/Interior Condition surcharges.
  const addOnAmount = (addOn: (typeof selectedAddOns)[number]) =>
    addOn.price + (addOn.allowManualSurcharge ? Math.max(0, selections.addOnSurcharges[addOn.id] ?? 0) : 0)

  const addOnLineItems = selectedAddOns.map((addOn) => ({ label: addOn.label, amount: addOnAmount(addOn) }))
  const addOnsTotal = selectedAddOns.reduce((sum, addOn) => sum + addOnAmount(addOn), 0)

  // Travel
  const billableMiles = Math.max(0, selections.travelMiles - travel.freeMiles)
  const travelFee = billableMiles * travel.pricePerMile

  const subtotal = afterClass + exteriorSurcharge + interiorSurcharge + addOnsTotal + travelFee

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

  // Labor hours: base service hours scaled by vehicle class, plus each
  // selected add-on's own flat labor contribution.
  const baseLaborScaled = service.baseLaborHours * vehicleClass.multiplier
  const addOnLaborHours = selectedAddOns.reduce((sum, addOn) => sum + addOn.laborHours, 0)
  const laborHours = baseLaborScaled + addOnLaborHours

  // Internal profitability — never shown on a client-facing estimate.
  const laborCost = laborHours * labor.ratePerHour
  const scaledServiceMaterialCost = service.materialCost * vehicleClass.multiplier
  const addOnMaterialCost = selectedAddOns.reduce((sum, addOn) => sum + addOn.materialCost, 0)
  const materialCost = scaledServiceMaterialCost + addOnMaterialCost
  // Fuel/vehicle-wear cost accrues for the whole trip, not just the miles
  // billed to the client beyond the free radius.
  const travelCost = selections.travelMiles * labor.travelCostPerMile
  const grossProfit = total - laborCost - materialCost - travelCost
  const marginPercent = total > 0 ? grossProfit / total : 0
  const revenuePerLaborHour = laborHours > 0 ? total / laborHours : 0
  const belowMarginWarning = marginPercent < labor.marginWarningThreshold

  return {
    baseService: { label: service.label, amount: basePrice },
    vehicleComplexity: { label: vehicleClass.label, amount: vehicleComplexityAmount, factors: vehicleClass.factors },
    exteriorCondition: { label: exteriorCondition.label, amount: exteriorSurcharge, factors: [exteriorCondition.note] },
    interiorCondition: { label: interiorCondition.label, amount: interiorSurcharge, factors: [interiorCondition.note] },
    addOnLineItems,
    addOnsTotal,
    travelFee,
    travelMilesBilled: billableMiles,
    subtotal,
    discountLabel,
    discountAmount,
    total,
    laborHours,
    laborCost,
    materialCost,
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
    exteriorConditionId: 'excellent',
    interiorConditionId: 'excellent',
    paintConditionId: 'excellent',
    wheelConditionId: 'excellent',
    engineBayConditionId: 'excellent',
    addOnIds: [],
    addOnSurcharges: {},
    travelMiles: 0,
    discountId: 'none',
    customDiscountPercent: 0,
  }
}
