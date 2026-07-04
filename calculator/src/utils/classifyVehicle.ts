// Auto-classifies a vehicle into Hypercar / Supercar / Exotic / High-End
// Sports Car from its Make + Model, using the classification rules in
// pricingConfig.vehicleTypes. Falls back to `null` (manual selection
// required) rather than guessing when we don't recognize the vehicle —
// better to ask than to misprice a job.
//
// Model keywords win over make-level defaults across ALL tiers, so a
// Porsche 918 Spyder classifies as a Hypercar even though "Porsche" alone
// isn't in any tier's blanket make list.

import { pricingConfig } from '../config/pricingConfig'

// Nameplates outside our current specialization (daily drivers, luxury
// SUVs/sedans, trucks). Matching one shows a warning banner rather than
// silently blocking — staff can still override and proceed.
const UNSUPPORTED_KEYWORDS = [
  'urus',
  'purosangue',
  'cullinan',
  'bentayga',
  'levante',
  'ghibli',
  'quattroporte',
  'dbx',
  'cayenne',
  'macan',
  'panamera',
  'g-wagon',
  'gwagen',
  'g550',
  'escalade',
  'range rover',
  'tahoe',
  'suburban',
  'explorer',
  'f-150',
  'silverado',
  'camry',
  'accord',
  'civic',
  'corolla',
  'sentra',
  'altima',
  'model 3',
  'model y',
  'model x',
  'model s',
  'wrangler',
  '4runner',
]

export type ClassificationResult = { vehicleTypeId: string } | { vehicleTypeId: 'unsupported' } | null

export function classifyVehicle(make: string, model: string): ClassificationResult {
  const makeLower = make.trim().toLowerCase()
  const modelLower = model.trim().toLowerCase()
  if (!makeLower && !modelLower) return null

  for (const type of pricingConfig.vehicleTypes) {
    if (type.classification.modelKeywords.some((kw) => modelLower.includes(kw))) {
      return { vehicleTypeId: type.id }
    }
  }

  if (UNSUPPORTED_KEYWORDS.some((kw) => modelLower.includes(kw) || makeLower.includes(kw))) {
    return { vehicleTypeId: 'unsupported' }
  }

  for (const type of pricingConfig.vehicleTypes) {
    if (type.classification.makes.includes(makeLower)) {
      return { vehicleTypeId: type.id }
    }
  }

  return null
}
