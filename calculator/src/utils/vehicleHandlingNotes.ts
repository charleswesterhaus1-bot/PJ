// Technician notes — special surfaces/finishes (PPF, ceramic coating, matte
// paint, soft tops, exposed carbon fiber) plus Paint Condition findings.
// Exterior/Interior Condition each already show their own note inline as
// the caption under their priced line on the estimate, so they're not
// repeated here — only Paint Condition, which has no pricing line of its
// own, needs a home in this panel.

import { pricingConfig } from '../config/pricingConfig'
import type { EstimateSelections, VehicleInfo } from '../types'

export function buildVehicleHandlingNotes(vehicle: VehicleInfo): string[] {
  const notes: string[] = []

  // "Unknown" is the default, untouched state for a brand-new estimate —
  // deliberately silent so every fresh job doesn't open with a warning
  // nobody has had a chance to actually check yet. Only a confirmed
  // presence (or confirmed partial/full PPF) surfaces a handling note.
  if (vehicle.ppf === 'full' || vehicle.ppf === 'partial') {
    notes.push('Paint protection film present — use PPF-safe products only; avoid aggressive clay or compounding directly on wrapped panels.')
  }

  if (vehicle.ceramicCoating === 'yes') {
    notes.push('Ceramic coating present — use coating-safe wash soap and avoid harsh chemicals directly on coated panels.')
  }

  if (vehicle.mattePaint) {
    notes.push('Matte paint — no wax, gloss sealant, or high-speed buffing; matte-safe wash and protection products only.')
  }

  if (vehicle.convertibleTop) {
    notes.push('Convertible soft top — use soft-top-safe cleaner; avoid direct high-pressure spray on seams.')
  }

  if (vehicle.carbonFiberExterior) {
    notes.push('Exposed carbon fiber exterior pieces — avoid abrasive pads directly on clear-coated carbon; inspect for existing clear coat damage first.')
  }

  return notes
}

/** Paint Condition findings, added alongside the vehicle handling notes
 * above — together these make up the full "Technician Notes" panel. Only
 * applies when Paint Enhancement Detail is selected. */
export function buildConditionNotes(selections: EstimateSelections): string[] {
  if (selections.serviceId !== 'paint-enhancement') return []
  const paintTier = pricingConfig.paintConditions.find((c) => c.id === selections.paintConditionId)
  return paintTier && paintTier.note ? [paintTier.note] : []
}

export function buildTechnicianNotes(vehicle: VehicleInfo, selections: EstimateSelections): string[] {
  return [...buildVehicleHandlingNotes(vehicle), ...buildConditionNotes(selections)]
}
