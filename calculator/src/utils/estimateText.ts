// Builds a clean, plain-text version of an estimate for the "Copy Estimate"
// button — suitable for pasting into an email, text message, or CRM note.

import type { ClientInfo, EstimateResult, EstimateSelections } from '../types'
import { pricingConfig } from '../config/pricingConfig'
import { formatCurrency, formatDate, formatHours } from './format'

function findLabel(id: string, items: { id: string; label: string }[]): string {
  return items.find((i) => i.id === id)?.label ?? id
}

export function buildEstimateText(
  estimateNumber: string,
  createdAt: string,
  client: ClientInfo,
  selections: EstimateSelections,
  result: EstimateResult,
): string {
  const vehicleLine = [client.vehicleYear, client.vehicleMake, client.vehicleModel].filter(Boolean).join(' ')

  const lines: string[] = []
  lines.push(`${pricingConfig.company.name} — Estimate ${estimateNumber}`)
  lines.push(formatDate(createdAt))
  lines.push('')
  if (client.clientName) lines.push(`Client: ${client.clientName}`)
  if (vehicleLine) lines.push(`Vehicle: ${vehicleLine}${client.vehicleColor ? ` (${client.vehicleColor})` : ''}`)
  if (client.licensePlate) lines.push(`Plate: ${client.licensePlate}`)
  lines.push(`Type: ${findLabel(selections.vehicleTypeId, pricingConfig.vehicleTypes)}`)
  lines.push(`Size: ${findLabel(selections.vehicleSizeId, pricingConfig.vehicleSizes)}`)
  lines.push(`Condition: ${findLabel(selections.conditionId, pricingConfig.conditions)}`)
  lines.push('')
  lines.push('— Pricing —')
  lines.push(`Base Service (${result.baseService.label}): ${formatCurrency(result.baseService.amount)}`)
  lines.push(`Vehicle Type Adjustment: ${formatCurrency(result.vehicleTypeAdjustment.amount)}`)
  lines.push(`Vehicle Size Adjustment: ${formatCurrency(result.vehicleSizeAdjustment.amount)}`)
  lines.push(`Condition Adjustment: ${formatCurrency(result.conditionAdjustment.amount)}`)
  if (result.addOnLineItems.length) {
    lines.push('Add-ons:')
    result.addOnLineItems.forEach((item) => lines.push(`  • ${item.label}: ${formatCurrency(item.amount)}`))
  }
  lines.push(`Travel Fee (${result.travelMilesBilled} billable mi): ${formatCurrency(result.travelFee)}`)
  lines.push(`Subtotal: ${formatCurrency(result.subtotal)}`)
  if (result.discountAmount > 0) {
    lines.push(`Discount — ${result.discountLabel}: -${formatCurrency(result.discountAmount)}`)
  }
  lines.push(`ESTIMATED TOTAL: ${formatCurrency(result.total)}`)
  lines.push('')
  lines.push('— Job Details —')
  lines.push(`Estimated Labor: ${formatHours(result.laborHours)}`)
  lines.push(`Suggested Team: ${result.teamSizeLabel}`)
  lines.push(`Estimated Appointment Length: ${formatHours(result.appointmentLengthHours)}`)
  if (client.notes) {
    lines.push('')
    lines.push(`Notes: ${client.notes}`)
  }
  return lines.join('\n')
}
