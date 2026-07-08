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

export type VehicleClassId = 'sports-car' | 'supercar' | 'luxury-suv-truck' | 'hypercar'

/** Which Condition & Findings fields actually apply to a given service —
 * drives both which dropdowns are shown in Step Four and which of the
 * priced surcharges (exterior/interior) are ever applied. */
export type ConditionCategory = 'exterior' | 'interior' | 'paint' | 'wheels' | 'engine'

/** A named group of includes bullets, e.g. "Interior" / "Exterior" / "Paint
 * Enhancement" — shown as a sub-header above its items. An empty `group`
 * renders as a single flat list with no sub-header. */
export interface ServiceIncludesGroup {
  group: string
  items: string[]
}

/** A primary detailing service/package — the base line of an estimate.
 * Priced explicitly per vehicle class rather than a single base × multiplier,
 * since real-world class pricing isn't a clean ratio across every package. */
export interface ServiceOption {
  id: string
  label: string
  /** What's included, grouped for readability (see ServiceIncludesGroup) —
   * kept literal/plain so it reads as a clear checklist rather than
   * marketing copy. */
  includes: ServiceIncludesGroup[]
  /** Optional one-line caption shown under the includes list, e.g. flagging
   * a service as the top tier offered. */
  tagline?: string
  basePriceByClass: Record<VehicleClassId, number>
  baseLaborHours: number
  /** Estimated product/material cost at the "Sports Car" baseline class — internal only. */
  materialCost: number
  /** Equipment/products actually used, from our current inventory. */
  equipmentUsed: string[]
  /** Which Condition & Findings categories this service actually touches —
   * everything else is hidden from Step Four and never priced in. */
  relevantConditions: ConditionCategory[]
}

/** An optional upgrade with its own flat price and labor contribution.
 * Only offered on the primary services listed in `availableForServiceIds` —
 * hidden entirely when the selected service already includes it.
 * `requiresLeatherInterior` additionally hides it unless the vehicle's
 * interior material actually includes leather (see Leather Conditioning).
 * `allowManualSurcharge` marks a "starting at" price the technician can add
 * to on the spot for severity (currently just Pet Hair Removal) — the base
 * `price` is always charged, and any surcharge entered on top is pure
 * additional revenue with no extra modeled labor/material cost. */
export interface AddOnOption {
  id: string
  label: string
  includes: string[]
  price: number
  laborHours: number
  materialCost: number
  equipmentUsed: string[]
  availableForServiceIds: string[]
  requiresLeatherInterior?: boolean
  allowManualSurcharge?: boolean
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

/** Exterior and Interior Condition each carry a flat surcharge — one bucket
 * covering all forms of contamination on that side of the vehicle rather
 * than itemized charges. */
export interface PricedConditionTier {
  id: ConditionTierId
  label: string
  surcharge: number
  note: string
}

/** Paint condition is a technician note only — it never changes price, it
 * just travels with the estimate for the tech's benefit. */
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
  exteriorConditions: PricedConditionTier[]
  interiorConditions: PricedConditionTier[]
  /** Paint, Wheels, and Engine Bay are technician-reference categories only
   * — none of them carry their own surcharge. They exist to help decide
   * which primary service fits and to help settle on the right Exterior/
   * Interior Condition tier, without ever stacking into separate charges. */
  paintConditions: NoteOnlyConditionTier[]
  wheelConditions: NoteOnlyConditionTier[]
  engineBayConditions: NoteOnlyConditionTier[]
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
export type InteriorMaterial = 'leather' | 'leather-alcantara' | 'alcantara' | 'other'

export interface VehicleInfo {
  year: string
  make: string
  model: string
  color: string
  mileage: string
  vin: string
  licensePlate: string
  /** Drives whether the Leather Conditioning upgrade is offered at all —
   * not just a note, an actual availability gate. */
  interiorMaterial: InteriorMaterial
  /** Special surfaces/finishes that change handling but not price — see
   * utils/vehicleHandlingNotes.ts for the technician notes these generate. */
  ppf: PpfCoverage
  ceramicCoating: TriState
  mattePaint: boolean
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
  wheelConditionId: ConditionTierId
  engineBayConditionId: ConditionTierId
  addOnIds: string[]
  /** Manual per-severity surcharge on top of an add-on's base price, keyed
   * by add-on id — only meaningful for add-ons with `allowManualSurcharge`. */
  addOnSurcharges: Record<string, number>
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
  exteriorCondition: EstimateLineItem
  interiorCondition: EstimateLineItem
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

export type EstimateStatus = 'pending' | 'completed'

/** A fully saved estimate, persisted to localStorage. Optional so existing
 * records saved before this field existed still load without a migration. */
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
  status?: EstimateStatus
}
