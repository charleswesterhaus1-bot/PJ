// Builds the client-facing estimate as a native jsPDF document — drawn
// from the same data as the on-screen summary, not a screenshot of it.
//
// We deliberately do NOT rasterize the DOM (e.g. via html2canvas): modern
// Tailwind utilities compile color-mix()/oklch() colors that abandoned
// canvas-rasterization libraries can't parse, and a screenshot of a dark
// glassmorphism panel makes for a bad, ink-heavy printout anyway. Drawing
// the PDF natively gives a crisp, brand-styled, light document at a
// fraction of the file size — and it can never accidentally include the
// staff-only profitability panel, since that data is never passed in.

import jsPDF from 'jspdf'
import { pricingConfig } from '../config/pricingConfig'
import { formatCurrency, formatDate, formatSignedCurrency } from './format'
import type { ClientDraft, EstimateResult, EstimateSelections, VehicleInfo } from '../types'

const NAVY: [number, number, number] = [11, 27, 58]
const GOLD: [number, number, number] = [201, 162, 39]
const INK: [number, number, number] = [30, 33, 43]
const MUTED: [number, number, number] = [110, 116, 130]

const PAGE_WIDTH = 612
const PAGE_HEIGHT = 792
const MARGIN = 48
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2

function findLabel(id: string, items: { id: string; label: string }[]): string {
  return items.find((i) => i.id === id)?.label ?? id
}

interface ExportParams {
  estimateNumber: string
  createdAt: string
  client: ClientDraft
  vehicle: VehicleInfo
  selections: EstimateSelections
  result: EstimateResult
}

export async function exportEstimateToPdf(params: ExportParams, filename: string): Promise<void> {
  const { estimateNumber, createdAt, client, vehicle, selections, result } = params
  const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'letter' })
  let y = 0

  function drawHeader() {
    doc.setFillColor(...NAVY)
    doc.rect(0, 0, PAGE_WIDTH, 96, 'F')
    doc.setTextColor(...GOLD)
    doc.setFont('times', 'bold')
    doc.setFontSize(20)
    doc.text(pricingConfig.company.name.toUpperCase(), MARGIN, 42)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8.5)
    doc.setTextColor(200, 205, 215)
    doc.text('EXOTIC & HIGH-PERFORMANCE VEHICLE DETAILING', MARGIN, 58)

    doc.setTextColor(...GOLD)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text(`Estimate ${estimateNumber}`, PAGE_WIDTH - MARGIN, 42, { align: 'right' })
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(200, 205, 215)
    doc.text(formatDate(createdAt), PAGE_WIDTH - MARGIN, 56, { align: 'right' })

    y = 96 + 36
  }

  function ensureSpace(needed: number) {
    if (y + needed > PAGE_HEIGHT - 64) {
      doc.addPage()
      y = MARGIN
    }
  }

  function sectionLabel(text: string) {
    ensureSpace(20)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8.5)
    doc.setTextColor(...GOLD)
    doc.text(text.toUpperCase(), MARGIN, y)
    y += 14
  }

  function bodyLine(text: string, opts: { bold?: boolean; size?: number; color?: [number, number, number]; gap?: number } = {}) {
    ensureSpace(opts.size ?? 11)
    doc.setFont('helvetica', opts.bold ? 'bold' : 'normal')
    doc.setFontSize(opts.size ?? 11)
    doc.setTextColor(...(opts.color ?? INK))
    doc.text(text, MARGIN, y)
    y += opts.gap ?? 15
  }

  function priceRow(label: string, amount: string, opts: { muted?: boolean; bold?: boolean } = {}) {
    ensureSpace(15)
    doc.setFont('helvetica', opts.bold ? 'bold' : 'normal')
    doc.setFontSize(10.5)
    doc.setTextColor(...(opts.muted ? MUTED : INK))
    doc.text(label, MARGIN, y)
    doc.text(amount, PAGE_WIDTH - MARGIN, y, { align: 'right' })
    y += 15
  }

  function wrappedNote(text: string) {
    const lines = doc.splitTextToSize(text, CONTENT_WIDTH)
    ensureSpace(lines.length * 11)
    doc.setFont('helvetica', 'italic')
    doc.setFontSize(8.5)
    doc.setTextColor(...MUTED)
    doc.text(lines, MARGIN, y)
    y += lines.length * 11 + 4
  }

  function divider() {
    ensureSpace(10)
    doc.setDrawColor(220, 222, 228)
    doc.setLineWidth(0.5)
    doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y)
    y += 14
  }

  drawHeader()

  // Client + vehicle block
  const vehicleLine = [vehicle.year, vehicle.make, vehicle.model].filter(Boolean).join(' ')
  const vehicleTypeLabel = findLabel(selections.vehicleTypeId, pricingConfig.vehicleTypes)
  if (client.name) bodyLine(client.name, { bold: true, size: 13, gap: 17 })
  if (vehicleLine) {
    bodyLine(
      `${vehicleLine}${vehicle.color ? ` · ${vehicle.color}` : ''}${vehicleTypeLabel ? ` · ${vehicleTypeLabel}` : ''}`,
      { color: MUTED, size: 10, gap: 22 },
    )
  } else {
    y += 8
  }

  divider()

  // Total, prominent
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(...MUTED)
  doc.text('ESTIMATED TOTAL', MARGIN, y)
  y += 22
  doc.setFont('times', 'bold')
  doc.setFontSize(30)
  doc.setTextColor(...GOLD)
  doc.text(formatCurrency(result.total), MARGIN, y)
  y += 26

  divider()

  // Itemized breakdown
  sectionLabel('Pricing')
  priceRow(`Base Service — ${result.baseService.label}`, formatCurrency(result.baseService.amount))

  priceRow(`Vehicle Complexity — ${result.vehicleComplexity.label}`, formatSignedCurrency(result.vehicleComplexity.amount), { muted: true })
  if (result.vehicleComplexity.factors?.length) wrappedNote(result.vehicleComplexity.factors.join(' · '))

  if (result.sizeAccess.amount !== 0 || (result.sizeAccess.factors?.length ?? 0) > 0) {
    priceRow(`Size & Access — ${result.sizeAccess.label}`, formatSignedCurrency(result.sizeAccess.amount), { muted: true })
    if (result.sizeAccess.factors?.length) wrappedNote(result.sizeAccess.factors.join(' · '))
  }

  priceRow(`Condition & Findings — ${result.conditionFindings.label}`, formatSignedCurrency(result.conditionFindings.amount), { muted: true })
  if (result.conditionFindings.factors?.length) wrappedNote(result.conditionFindings.factors.join(' · '))

  if (result.addOnLineItems.length > 0) {
    y += 4
    for (const item of result.addOnLineItems) {
      priceRow(item.label, formatCurrency(item.amount), { muted: true })
      if (item.reason) wrappedNote(item.reason)
    }
  }

  y += 4
  priceRow(`Travel Fee (${result.travelMilesBilled} billable mi)`, formatCurrency(result.travelFee), { muted: true })

  y += 6
  divider()
  priceRow('Subtotal', formatCurrency(result.subtotal), { bold: true })
  if (result.discountAmount > 0) {
    priceRow(`Discount — ${result.discountLabel}`, `-${formatCurrency(result.discountAmount)}`)
  }

  if (client.notes) {
    y += 10
    divider()
    sectionLabel('Notes')
    wrappedNote(client.notes)
  }

  // Footer on every page
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(...MUTED)
    doc.text(`${pricingConfig.company.name} · Estimate ${estimateNumber}`, PAGE_WIDTH / 2, PAGE_HEIGHT - 30, { align: 'center' })
  }

  doc.save(filename)
}
