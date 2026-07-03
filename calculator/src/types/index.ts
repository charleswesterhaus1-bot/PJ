// Shared type definitions for the Hangar & Harbor Estimate Console.
// Keeping these centralized means the config file, calculation engine, and
// UI components all agree on the same shapes.

/** A named multiplier or flat modifier used throughout the pricing engine. */
export interface RateOption {
  id: string
  label: string
  /** Multiplier applied to the running subtotal, e.g. 1.15 = +15% */
  multiplier: number
  /** Optional short description shown as a tooltip/help text in the UI */
  description?: string
}

/** A primary detailing service/package — the base line of an estimate. */
export interface ServiceOption {
  id: string
  label: string
  description?: string
  basePrice: number
  baseLaborHours: number
}

/** An optional add-on with its own flat price and labor contribution. */
export interface AddOnOption {
  id: string
  label: string
  description?: string
  price: number
  laborHours: number
}

export type DiscountKind = 'military' | 'repeatClient' | 'referral' | 'portfolioVehicle' | 'custom'

export interface DiscountOption {
  id: DiscountKind
  label: string
  /** Percentage as a decimal, e.g. 0.10 = 10%. Ignored for 'custom'. */
  percentage: number
  description?: string
}

export interface TeamSizeThreshold {
  /** If total labor hours are <= this value, this team size is suggested. */
  maxLaborHours: number
  teamSize: number
  label: string
}

export interface TravelConfig {
  freeMiles: number
  pricePerMile: number
}

export interface LaborConfig {
  /** Reference shop labor rate, used for internal cost visibility only. */
  ratePerHour: number
  teamSizeThresholds: TeamSizeThreshold[]
  /** Round the estimated appointment length to the nearest fraction of an hour. */
  appointmentRoundingHours: number
}

/** Placeholder domain for future expansion (yachts, aircraft, etc). */
export interface FutureDomainConfig {
  enabled: boolean
  label: string
  services: ServiceOption[]
  addOns: AddOnOption[]
}

export interface PricingConfig {
  company: {
    name: string
    tagline: string
  }
  vehicleTypes: RateOption[]
  vehicleSizes: RateOption[]
  conditions: RateOption[]
  services: ServiceOption[]
  addOns: AddOnOption[]
  travel: TravelConfig
  discounts: DiscountOption[]
  labor: LaborConfig
  future: {
    yachts: FutureDomainConfig
    aircraft: FutureDomainConfig
  }
}

/** Selected state driven entirely by the UI — mirrors the calculator form. */
export interface EstimateSelections {
  serviceId: string
  vehicleTypeId: string
  vehicleSizeId: string
  conditionId: string
  addOnIds: string[]
  travelMiles: number
  discountId: DiscountKind | 'none'
  customDiscountPercent: number
}

export interface ClientInfo {
  clientName: string
  vehicleYear: string
  vehicleMake: string
  vehicleModel: string
  vehicleColor: string
  licensePlate: string
  notes: string
}

export interface EstimateLineItem {
  label: string
  amount: number
}

export interface EstimateResult {
  baseService: EstimateLineItem
  vehicleTypeAdjustment: EstimateLineItem
  vehicleSizeAdjustment: EstimateLineItem
  conditionAdjustment: EstimateLineItem
  addOnLineItems: EstimateLineItem[]
  addOnsTotal: number
  travelFee: number
  travelMilesBilled: number
  subtotal: number
  discountLabel: string
  discountAmount: number
  total: number
  laborHours: number
  teamSize: number
  teamSizeLabel: string
  appointmentLengthHours: number
  referenceLaborCost: number
}

/** A fully saved estimate, persisted to localStorage. */
export interface SavedEstimate {
  id: string
  estimateNumber: string
  createdAt: string
  client: ClientInfo
  selections: EstimateSelections
  result: EstimateResult
}
