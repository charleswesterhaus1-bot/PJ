// Thin localStorage persistence layer for saved estimates and the running
// estimate-number counter. Everything is namespaced under a single prefix
// so it never collides with anything else on the domain.

import type { SavedEstimate } from '../types'

const ESTIMATES_KEY = 'hh-estimates-v1'
const COUNTER_KEY = 'hh-estimate-counter-v1'

export function loadEstimates(): SavedEstimate[] {
  try {
    const raw = localStorage.getItem(ESTIMATES_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveEstimates(estimates: SavedEstimate[]): void {
  localStorage.setItem(ESTIMATES_KEY, JSON.stringify(estimates))
}

export function addEstimate(estimate: SavedEstimate): SavedEstimate[] {
  const current = loadEstimates()
  const updated = [estimate, ...current]
  saveEstimates(updated)
  return updated
}

export function deleteEstimate(id: string): SavedEstimate[] {
  const updated = loadEstimates().filter((e) => e.id !== id)
  saveEstimates(updated)
  return updated
}

export function getNextEstimateSequence(): number {
  const raw = localStorage.getItem(COUNTER_KEY)
  const current = raw ? parseInt(raw, 10) : 0
  const next = Number.isFinite(current) ? current + 1 : 1
  localStorage.setItem(COUNTER_KEY, String(next))
  return next
}

export function peekNextEstimateSequence(): number {
  const raw = localStorage.getItem(COUNTER_KEY)
  const current = raw ? parseInt(raw, 10) : 0
  return (Number.isFinite(current) ? current : 0) + 1
}
