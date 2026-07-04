// Shared type definitions for the Hangar & Harbor Estimate Console.
// Keeping these centralized means config, engines, and UI components all
// agree on the same shapes.

/** 0 = not present, 1 = light, 2 = moderate, 3 = heavy. */
export type SeverityLevel = 0 | 1 | 2 | 3

export const SEVERITY_LABELS: Record<SeverityLevel, string> = {
  0: 'None',
  1: 'Light',
  2: 'Moderate',
  3: 'Heavy',
}

/** A named multiplier used throughout the pricing engine, with the
 * plain-language reasons a client would accept as justification. */
export interface RateOption {
  id: string
  label: string
  /** Multiplier applied to the running subtotal, e.g. 1.15 = +15% */
  multiplier: number
  description?: string
  /** Bullet-point reasons shown on the estimate to justify the adjustment. */
  factors?: string[]
}

export interface VehicleClassificationRule {
  /** Lowercase make names that default to this tier. */
  makes: string[]
  /** Lowercase substrings checked against the model field; matches win over `makes`. */
  modelKeywords: string[]
}

/** A primary detailing service/package — the base line of an estimate. */
export interface ServiceOption {
  id: string
  label: string
  description?: string
  basePrice: number
  baseLaborHours: number
  /** Estimated product/consumable cost at the "medium" vehicle size — internal only. */
  chemicalCost: number
  /** Equipment/products actually used, from our current inventory. */
  equipmentUsed: string[]
}

/** An optional add-on with its own flat price and labor contribution. */
export interface AddOnOption {
  id: string
  label: string
  description?: string
  price: number
  laborHours: number
  chemicalCost: number
  equipmentUsed: string[]
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
  /** Shop labor rate used to derive internal cost/margin figures. */
  ratePerHour: number
  teamSizeThresholds: TeamSizeThreshold[]
  /** Round the estimated appointment length to the nearest fraction of an hour. */
  appointmentRoundingHours: number
}

/** A single piece of equipment/product in our current inventory — purely
 * informational, but this is the list that justifies which services we can
 * responsibly offer today. */
export interface EquipmentItem {
  category: string
  items: string[]
}

/** Placeholder domain for future expansion (yachts, aircraft, etc). */
export interface FutureDomainConfig {
  enabled: boolean
  label: string
  services: ServiceOption[]
  addOns: AddOnOption[]
}

/** Feature modules planned but not built — flags only, so the nav/data
 * layer can light them up later without restructuring anything. */
export interface FeatureFlags {
  yachts: boolean
  aircraft: boolean
  ceramicCoatings: boolean
  maintenanceMemberships: boolean
  fleetAccounts: boolean
  crm: boolean
  scheduling: boolean
  invoicing: boolean
  payments: boolean
  employeeAccounts: boolean
  analytics: boolean
}

export interface PricingConfig {
  company: {
    name: string
    tagline: string
  }
  equipment: EquipmentItem[]
  vehicleTypes: (RateOption & { classification: VehicleClassificationRule })[]
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
  features: FeatureFlags
}

// ─────────────────────────────────────────────────────────────────────────
// Inspection
// ─────────────────────────────────────────────────────────────────────────

export type InspectionCategory = 'paint' | 'wheels' | 'interior' | 'engineBay'

export interface InspectionItemDef {
  id: string
  label: string
}

export interface InspectionConfig {
  paint: InspectionItemDef[]
  wheels: InspectionItemDef[]
  interior: InspectionItemDef[]
  engineBay: InspectionItemDef[]
}

/** Severity keyed by inspection item id, one map per category. */
export type InspectionCategoryState = Record<string, SeverityLevel>

export interface InspectionState {
  paint: InspectionCategoryState
  wheels: InspectionCategoryState
  interior: InspectionCategoryState
  engineBay: InspectionCategoryState
}

export interface RecommendationResult {
  suggestedServiceId: string
  suggestedConditionId: string
  suggestedAddOnIds: string[]
  /** Why each recommended add-on was suggested, keyed by add-on id. */
  addOnReasons: Record<string, string>
  serviceReason: string
  /** Findings we can't address with detailing (existing damage, etc). */
  cautions: string[]
  /** Plain-language findings pulled straight from the inspection, used to
   * justify the condition line on the estimate. */
  findings: string[]
}

// ─────────────────────────────────────────────────────────────────────────
// Clients & vehicles
// ─────────────────────────────────────────────────────────────────────────

export interface ClientRecord {
  id: string
  name: string
  phone: string
  email: string
  address: string
  notes: string
  createdAt: string
  updatedAt: string
}

/** The in-progress client fields on the calculator form, before they've
 * been saved (and assigned an id) to the client database. */
export type ClientDraft = Omit<ClientRecord, 'id' | 'createdAt' | 'updatedAt'> & { id: string | null }

export interface VehicleInfo {
  year: string
  make: string
  model: string
  color: string
  mileage: string
  vin: string
  licensePlate: string
}

// ─────────────────────────────────────────────────────────────────────────
// Photos
// ─────────────────────────────────────────────────────────────────────────

export type PhotoCategory = 'before' | 'after' | 'damage'

export interface EstimatePhoto {
  id: string
  category: PhotoCategory
  dataUrl: string
  createdAt: string
}

// ─────────────────────────────────────────────────────────────────────────
// Estimate selections + results
// ─────────────────────────────────────────────────────────────────────────

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

export interface EstimateLineItem {
  label: string
  amount: number
  factors?: string[]
}

export interface EstimateResult {
  baseService: EstimateLineItem
  vehicleComplexity: EstimateLineItem
  sizeAccess: EstimateLineItem
  conditionFindings: EstimateLineItem
  addOnLineItems: (EstimateLineItem & { reason?: string })[]
  addOnsTotal: number
  travelFee: number
  travelMilesBilled: number
  subtotal: number
  discountLabel: string
  discountAmount: number
  total: number

  // Internal-only — never rendered on the client-facing estimate.
  laborHours: number
  teamSize: number
  teamSizeLabel: string
  appointmentLengthHours: number
  laborCost: number
  chemicalCost: number
  grossProfit: number
  marginPercent: number
}

/** A fully saved estimate, persisted to localStorage. */
export interface SavedEstimate {
  id: string
  estimateNumber: string
  createdAt: string
  clientId: string | null
  client: ClientRecord
  vehicle: VehicleInfo
  inspection: InspectionState
  selections: EstimateSelections
  result: EstimateResult
  photos: EstimatePhoto[]
}
