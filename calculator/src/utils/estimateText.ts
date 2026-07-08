// Builds a clean, plain-text version of an estimate for the "Copy Estimate"
// button — suitable for pasting into an email, text message, or CRM note.
// Client-facing only: no labor hours or cost/margin figures.

import type { EstimateResult, EstimateSelections, VehicleInfo } from '../types'
import { pricingConfig } from '../config/pricingConfig'
import { formatCurrency, formatDate, formatSignedCurrency } from './format'
import { buildTechnicianNotes } from './vehicleHandlingNotes'

function findLabel(id: string, items: { id: string; label: string }[]): string {
  return items.find((i) => i.id === id)?.label ?? id
}

export function buildEstimateText(
  estimateNumber: string,
  createdAt: string,
  client: { name: string; notes: string },
  vehicle: VehicleInfo,
  selections: EstimateSelections,
  result: EstimateResult,
): string {
  const vehicleLine = [vehicle.year, vehicle.make, vehicle.model].filter(Boolean).join(' ')
  const service = pricingConfig.services.find((s) => s.id === selections.serviceId)
  const showExterior = service?.relevantConditions.includes('exterior') ?? true
  const showInterior = service?.relevantConditions.includes('interior') ?? true

  const lines: string[] = []
  lines.push(`${pricingConfig.company.name} — Estimate ${estimateNumber}`)
  lines.push(formatDate(createdAt))
  lines.push('')
  if (client.name) lines.push(`Client: ${client.name}`)
  if (vehicleLine) lines.push(`Vehicle: ${vehicleLine}${vehicle.color ? ` (${vehicle.color})` : ''}`)
  if (vehicle.licensePlate) lines.push(`Plate: ${vehicle.licensePlate}`)
  lines.push(`Vehicle Class: ${findLabel(selections.vehicleTypeId, pricingConfig.vehicleTypes)}`)
  lines.push(`Exterior Condition: ${findLabel(selections.exteriorConditionId, pricingConfig.exteriorConditions)}`)
  lines.push(`Interior Condition: ${findLabel(selections.interiorConditionId, pricingConfig.interiorConditions)}`)
  const technicianNotes = buildTechnicianNotes(vehicle, selections)
  if (technicianNotes.length > 0) {
    lines.push('')
    lines.push('— Technician Notes —')
    technicianNotes.forEach((note) => lines.push(`  • ${note}`))
  }
  lines.push('')
  lines.push('— Pricing —')
  lines.push(`Base Service (${result.baseService.label}): ${formatCurrency(result.baseService.amount)}`)
  if (showExterior) lines.push(`Exterior Condition — ${result.exteriorCondition.label}: ${formatSignedCurrency(result.exteriorCondition.amount)}`)
  if (showInterior) lines.push(`Interior Condition — ${result.interiorCondition.label}: ${formatSignedCurrency(result.interiorCondition.amount)}`)
  if (result.addOnLineItems.length) {
    lines.push('Premium Enhancements:')
    result.addOnLineItems.forEach((item) => {
      lines.push(`  • ${item.label}: ${formatCurrency(item.amount)}`)
    })
  }
  lines.push(`Travel Fee (${result.travelMilesBilled} billable mi): ${formatCurrency(result.travelFee)}`)
  lines.push(`Subtotal: ${formatCurrency(result.subtotal)}`)
  if (result.discountAmount > 0) {
    lines.push(`Discount — ${result.discountLabel}: -${formatCurrency(result.discountAmount)}`)
  }
  lines.push(`ESTIMATED TOTAL: ${formatCurrency(result.total)}`)
  if (client.notes) {
    lines.push('')
    lines.push(`Notes: ${client.notes}`)
  }
  return lines.join('\n')
}
