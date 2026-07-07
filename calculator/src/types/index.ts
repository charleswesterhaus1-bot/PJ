// Shared type definitions for the Hangar & Harbor Estimate Console.
// Keeping these centralized means config, calculation, and UI components all
// agree on the same shapes.

/** A named multiplier used throughout the pricing engine, with the
 * plain-language reasons a client would accept as justification. */
export interface RateOption {
  id: string
  label: string
  /** Multiplier applied to labor hours and material cost only — never to
   * price, which is looked up directly per class/service. */
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

export type VehicleClassId = 'sports-car' | 'supercar' | 'performance-truck' | 'hypercar'

/** A primary detailing service/package — the base line of an estimate.
 * Priced explicitly per vehicle class rather than a single base × multiplier,
 * since real-world class pricing isn't a clean ratio across every package. */
export interface ServiceOption {
  id: string
  label: string
  /** What's included, shown as a bullet list — kept literal/plain so it reads
   * as a clear checklist rather than marketing copy. */
  includes: string[]
  basePriceByClass: Record<VehicleClassId, number>
  baseLaborHours: number
  /** Estimated product/material cost at the "Sports Car" baseline class — internal only. */
  materialCost: number
  /** Equipment/products actually used, from our current inventory. */
  equipmentUsed: string[]
}

/** An optional upgrade with its own flat price and labor contribution.
 * Only offered on the primary services listed in `availableForServiceIds` —
 * hidden entirely when the selected service already includes it. */
export interface AddOnOption {
  id: string
  label: string
  includes: string[]
  price: number
  laborHours: number
  materialCost: number
  equipmentUsed: string[]
  availableForServiceIds: string[]
}

export type DiscountKind = 'military' | 'repeatClient' | 'referral' | 'portfolioVehicle' | 'custom'

export interface DiscountOption {
  id: DiscountKind
  label: string
  /** Percentage as a decimal, e.g. 0.10 = 10%. Ignored for 'custom'. */
  percentage: number
  description?: string
}

export interface TravelConfig {
  freeMiles: number
  pricePerMile: number
}

export interface LaborConfig {
  /** Shop labor rate used to derive internal cost/margin figures. */
  ratePerHour: number
  /** Internal fuel/vehicle-wear cost per mile driven — separate from the
   * client-facing travel fee, which only bills miles beyond the free radius. */
  travelCostPerMile: number
  /** Below this gross margin, the staff-only panel shows a warning. */
  marginWarningThreshold: number
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

// ─────────────────────────────────────────────────────────────────────────
// Condition & Findings — simplified inspection
// ─────────────────────────────────────────────────────────────────────────

export type ConditionTierId = 'excellent' | 'light' | 'moderate' | 'heavy'

/** Exterior Condition is the only condition tier that changes price — a flat
 * surcharge covering bugs, brake dust, road film, tar, tree sap, fallout, and
 * general contamination as a single bucket rather than itemized charges. */
export interface ExteriorConditionTier {
  id: ConditionTierId
  label: string
  surcharge: number
  note: string
}

/** Interior and Paint condition are technician notes only — they never
 * change price, they just travel with the estimate for the tech's benefit. */
export interface NoteOnlyConditionTier {
  id: ConditionTierId
  label: string
  note: string
}

export interface PricingConfig {
  company: {
    name: string
    tagline: string
  }
  equipment: EquipmentItem[]
  /** Vehicle Class doubles as both the classification shown to staff and the
   * pricing dimension services are keyed on (`ServiceOption.basePriceByClass`).
   * `multiplier` here scales labor hours and material cost only — price comes
   * directly from each service's per-class table. */
  vehicleTypes: (RateOption & { classification: VehicleClassificationRule })[]
  exteriorConditions: ExteriorConditionTier[]
  interiorConditions: NoteOnlyConditionTier[]
  paintConditions: NoteOnlyConditionTier[]
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

export type TriState = 'unknown' | 'yes' | 'no'
export type PpfCoverage = 'none' | 'partial' | 'full' | 'unknown'

export interface VehicleInfo {
  year: string
  make: string
  model: string
  color: string
  mileage: string
  vin: string
  licensePlate: string
  /** Special surfaces/finishes that change handling but not price — see
   * utils/vehicleHandlingNotes.ts for the technician notes these generate. */
  ppf: PpfCoverage
  ceramicCoating: TriState
  mattePaint: boolean
  vinylWrap: boolean
  convertibleTop: boolean
  carbonFiberExterior: boolean
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
  exteriorConditionId: ConditionTierId
  interiorConditionId: ConditionTierId
  paintConditionId: ConditionTierId
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
  exteriorCondition: EstimateLineItem
  addOnLineItems: EstimateLineItem[]
  addOnsTotal: number
  travelFee: number
  travelMilesBilled: number
  subtotal: number
  discountLabel: string
  discountAmount: number
  total: number

  // Internal-only — never rendered on the client-facing estimate.
  laborHours: number
  laborCost: number
  materialCost: number
  travelCost: number
  grossProfit: number
  marginPercent: number
  revenuePerLaborHour: number
  belowMarginWarning: boolean
}

/** A fully saved estimate, persisted to localStorage. */
export interface SavedEstimate {
  id: string
  estimateNumber: string
  createdAt: string
  clientId: string | null
  client: ClientRecord
  vehicle: VehicleInfo
  selections: EstimateSelections
  result: EstimateResult
  photos: EstimatePhoto[]
}
