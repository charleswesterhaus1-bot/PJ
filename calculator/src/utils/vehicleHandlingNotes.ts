// Special surfaces/finishes (PPF, ceramic coating, matte paint, wraps,
// soft tops, exposed carbon fiber) don't change price, but they do change
// which products and techniques are safe to use. This turns those vehicle
// attributes into plain-language notes shown on the estimate so nobody on
// the job forgets and reaches for the wrong bottle.

import type { VehicleInfo } from '../types'

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
    notes.push('Ceramic coating present — use coating-safe wash soap; avoid stacking additional paint sealant unless requested.')
  }

  if (vehicle.mattePaint) {
    notes.push('Matte paint — no wax, gloss sealant, or high-speed buffing; matte-safe wash and protection products only.')
  }

  if (vehicle.vinylWrap) {
    notes.push('Vinyl wrap present — avoid high pressure directly at panel edges/seams; use wrap-safe chemicals.')
  }

  if (vehicle.convertibleTop) {
    notes.push('Convertible soft top — use soft-top-safe cleaner; avoid direct high-pressure spray on seams.')
  }

  if (vehicle.carbonFiberExterior) {
    notes.push('Exposed carbon fiber exterior pieces — avoid abrasive pads directly on clear-coated carbon; inspect for existing clear coat damage first.')
  }

  return notes
}
