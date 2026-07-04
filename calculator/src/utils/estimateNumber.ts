// Generates human-friendly, sequential estimate numbers, e.g. HH-2026-0042.

import { getNextEstimateSequence, peekNextEstimateSequence } from './storage'

function format(sequence: number, year: number): string {
  return `HH-${year}-${String(sequence).padStart(4, '0')}`
}

export function generateEstimateNumber(): string {
  const year = new Date().getFullYear()
  const sequence = getNextEstimateSequence()
  return format(sequence, year)
}

export function previewNextEstimateNumber(): string {
  const year = new Date().getFullYear()
  const sequence = peekNextEstimateSequence()
  return format(sequence, year)
}
