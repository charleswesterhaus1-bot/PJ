// Pure calculation engine — takes the current form selections plus the
// pricing config and derives every line item shown in the live output.
// No React, no side effects: easy to unit test and easy to reason about.

import { pricingConfig } from '../config/pricingConfig'
import type { EstimateResult, EstimateSelections } from '../types'

function findById<T extends { id: string }>(items: T[], id: string): T | undefined {
  return items.find((item) => item.id === id)
}

function roundToStep(value: number, step: number): number {
  if (step <= 0) return value
  return Math.round(value / step) * step
}

export function calculateEstimate(selections: EstimateSelections): EstimateResult {
  const { vehicleTypes, vehicleSizes, conditions, services, addOns, travel, discounts, labor } = pricingConfig

  const service = findById(services, selections.serviceId) ?? services[0]
  const vehicleType = findById(vehicleTypes, selections.vehicleTypeId) ?? vehicleTypes[0]
  const vehicleSize = findById(vehicleSizes, selections.vehicleSizeId) ?? vehicleSizes[0]
  const condition = findById(conditions, selections.conditionId) ?? conditions[0]

  // Base service, then each adjustment is shown as the incremental dollar
  // amount it contributes, even though under the hood it's a multiplier
  // stacked on the running price — this keeps the breakdown itemized and
  // readable for whoever is quoting the client.
  const basePrice = service.basePrice
  const afterVehicleType = basePrice * vehicleType.multiplier
  const afterSize = afterVehicleType * vehicleSize.multiplier
  const afterCondition = afterSize * condition.multiplier

  const vehicleTypeAdjustmentAmount = afterVehicleType - basePrice
  const vehicleSizeAdjustmentAmount = afterSize - afterVehicleType
  const conditionAdjustmentAmount = afterCondition - afterSize

  const adjustedBase = afterCondition

  // Add-ons
  const selectedAddOns = selections.addOnIds
    .map((id) => findById(addOns, id))
    .filter((a): a is NonNullable<typeof a> => Boolean(a))

  const addOnLineItems = selectedAddOns.map((addOn) => ({ label: addOn.label, amount: addOn.price }))
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

  const referenceLaborCost = laborHours * labor.ratePerHour

  return {
    baseService: { label: service.label, amount: basePrice },
    vehicleTypeAdjustment: { label: vehicleType.label, amount: vehicleTypeAdjustmentAmount },
    vehicleSizeAdjustment: { label: vehicleSize.label, amount: vehicleSizeAdjustmentAmount },
    conditionAdjustment: { label: condition.label, amount: conditionAdjustmentAmount },
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
    referenceLaborCost,
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
