// Classifies a vehicle into Standard / Luxury / Performance / Supercar /
// Classic from its Make + Model + Year, using the rules in
// pricingConfig.vehicleTypes. Unlike earlier versions of this calculator,
// every vehicle gets a tier — Hangar & Harbor's automotive launch serves
// everyday cars alongside exotics, so there's no "unsupported" case to warn
// about anymore, just a pricing multiplier that reflects the work involved.
//
// Model keywords win over make-level defaults across ALL tiers (so a
// Porsche 911 GT3 classifies Supercar even though "Porsche" alone defaults
// to Luxury). Age-based Classic/Collector detection only applies when the
// make isn't already a dedicated supercar brand — an old Ferrari stays a
// Ferrari, pricing-wise.

import { pricingConfig } from '../config/pricingConfig'

// Checked in this explicit order rather than array order — some tiers'
// keyword lists can both match the same model text (e.g. "Corvette Z06"
// contains Performance's generic "corvette" AND Supercar's specific
// "z06"), and the more specific/elite tier should win regardless of which
// keyword happens to be a longer substring.
const MODEL_KEYWORD_PRIORITY = ['supercar', 'performance', 'luxury']

export function classifyVehicle(make: string, model: string, year?: string): string {
  const makeLower = make.trim().toLowerCase()
  const modelLower = model.trim().toLowerCase()

  for (const tierId of MODEL_KEYWORD_PRIORITY) {
    const type = pricingConfig.vehicleTypes.find((t) => t.id === tierId)
    if (type?.classification.modelKeywords.some((kw) => modelLower.includes(kw))) {
      return type.id
    }
  }

  const supercarTier = pricingConfig.vehicleTypes.find((t) => t.id === 'supercar')
  const isSupercarMake = supercarTier?.classification.makes.includes(makeLower) ?? false

  const parsedYear = year ? parseInt(year, 10) : NaN
  if (!isSupercarMake && Number.isFinite(parsedYear)) {
    const age = new Date().getFullYear() - parsedYear
    if (age >= pricingConfig.classicVehicleAgeYears) return 'classic'
  }

  // Priority order matters here: check the higher, more specific tiers
  // before falling back to the broad "Standard" default.
  for (const tierId of ['supercar', 'luxury']) {
    const type = pricingConfig.vehicleTypes.find((t) => t.id === tierId)
    if (type?.classification.makes.includes(makeLower)) return type.id
  }

  return 'standard'
}
