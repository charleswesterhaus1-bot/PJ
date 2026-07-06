// Classifies a vehicle into Sports Car / Supercar / Luxury SUV / Performance
// Truck from its Make + Model, using the rules in pricingConfig.vehicleTypes.
// Every vehicle gets a class — there's no "unsupported" case — Sports Car is
// the default fallback for anything unrecognized, since it's also the
// baseline/cheapest tier. Staff can always override the dropdown.

import { pricingConfig } from '../config/pricingConfig'

// Checked in this explicit order rather than array order — a model can
// contain more than one tier's keyword (e.g. a "Mercedes-AMG G63" model
// string), and the more specific/higher tier should win regardless of
// which keyword happens to be a longer or shorter substring.
const MODEL_KEYWORD_PRIORITY = ['supercar', 'performance-truck', 'luxury-suv']

export function classifyVehicle(make: string, model: string): string {
  const makeLower = make.trim().toLowerCase()
  const modelLower = model.trim().toLowerCase()

  for (const tierId of MODEL_KEYWORD_PRIORITY) {
    const type = pricingConfig.vehicleTypes.find((t) => t.id === tierId)
    if (type?.classification.modelKeywords.some((kw) => modelLower.includes(kw))) {
      return type.id
    }
  }

  const supercarTier = pricingConfig.vehicleTypes.find((t) => t.id === 'supercar')
  if (supercarTier?.classification.makes.includes(makeLower)) return supercarTier.id

  return 'sports-car'
}
