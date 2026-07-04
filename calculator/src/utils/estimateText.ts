// Builds a clean, plain-text version of an estimate for the "Copy Estimate"
// button — suitable for pasting into an email, text message, or CRM note.
// Client-facing only: no labor hours, team size, or cost/margin figures.

import type { EstimateResult, EstimateSelections, VehicleInfo } from '../types'
import { pricingConfig } from '../config/pricingConfig'
import { formatCurrency, formatDate, formatSignedCurrency } from './format'

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

  const lines: string[] = []
  lines.push(`${pricingConfig.company.name} — Estimate ${estimateNumber}`)
  lines.push(formatDate(createdAt))
  lines.push('')
  if (client.name) lines.push(`Client: ${client.name}`)
  if (vehicleLine) lines.push(`Vehicle: ${vehicleLine}${vehicle.color ? ` (${vehicle.color})` : ''}`)
  if (vehicle.licensePlate) lines.push(`Plate: ${vehicle.licensePlate}`)
  lines.push(`Classification: ${findLabel(selections.vehicleTypeId, pricingConfig.vehicleTypes)}`)
  lines.push(`Size: ${findLabel(selections.vehicleSizeId, pricingConfig.vehicleSizes)}`)
  lines.push(`Condition: ${findLabel(selections.conditionId, pricingConfig.conditions)}`)
  lines.push('')
  lines.push('— Pricing —')
  lines.push(`Base Service (${result.baseService.label}): ${formatCurrency(result.baseService.amount)}`)
  lines.push(`Vehicle Complexity — ${result.vehicleComplexity.label}: ${formatSignedCurrency(result.vehicleComplexity.amount)}`)
  if (result.vehicleComplexity.factors?.length) lines.push(`  ${result.vehicleComplexity.factors.join(' · ')}`)
  if (result.sizeAccess.amount !== 0 || (result.sizeAccess.factors?.length ?? 0) > 0) {
    lines.push(`Size & Access — ${result.sizeAccess.label}: ${formatSignedCurrency(result.sizeAccess.amount)}`)
    if (result.sizeAccess.factors?.length) lines.push(`  ${result.sizeAccess.factors.join(' · ')}`)
  }
  lines.push(`Condition & Findings — ${result.conditionFindings.label}: ${formatSignedCurrency(result.conditionFindings.amount)}`)
  if (result.conditionFindings.factors?.length) lines.push(`  ${result.conditionFindings.factors.join(' · ')}`)
  if (result.addOnLineItems.length) {
    lines.push('Add-ons:')
    result.addOnLineItems.forEach((item) => {
      lines.push(`  • ${item.label}: ${formatCurrency(item.amount)}`)
      if (item.reason) lines.push(`    ${item.reason}`)
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
