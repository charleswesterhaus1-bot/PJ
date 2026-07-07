// Classifies a vehicle into Sports Car / Supercar / Performance Truck /
// Hypercar from its Make + Model, using the rules in pricingConfig.vehicleTypes.
// Every vehicle gets a class — there's no "unsupported" case — Sports Car is
// the default fallback for anything unrecognized, since it's also the
// baseline/cheapest tier. Staff can always override the dropdown.

import { pricingConfig } from '../config/pricingConfig'

// Checked in this explicit order rather than array order — a model string
// can contain more than one tier's keyword, and the rarer/more expensive
// tier should win regardless of which keyword happens to match.
const MODEL_KEYWORD_PRIORITY = ['hypercar', 'performance-truck', 'supercar']
const MAKE_PRIORITY = ['hypercar', 'supercar']

export function classifyVehicle(make: string, model: string): string {
  const makeLower = make.trim().toLowerCase()
  const modelLower = model.trim().toLowerCase()

  for (const tierId of MODEL_KEYWORD_PRIORITY) {
    const type = pricingConfig.vehicleTypes.find((t) => t.id === tierId)
    if (type?.classification.modelKeywords.some((kw) => modelLower.includes(kw))) {
      return type.id
    }
  }

  for (const tierId of MAKE_PRIORITY) {
    const type = pricingConfig.vehicleTypes.find((t) => t.id === tierId)
    if (type?.classification.makes.includes(makeLower)) return type.id
  }

  return 'sports-car'
}
