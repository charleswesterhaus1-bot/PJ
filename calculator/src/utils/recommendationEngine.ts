// Turns inspection findings into recommendations: which primary service
// fits best, which add-ons address specific findings (with a plain-language
// reason for each), which overall condition tier the job falls into, and
// which findings should be called out on the client-facing estimate.
//
// This is intentionally written as explicit rules rather than a generic
// data table — the logic is hierarchical (e.g. "both paint AND interior
// need work" overrides either alone) in ways a flat rule list can't express
// cleanly. Thresholds are named constants below so they stay easy to tune.

import { inspectionConfig } from '../config/inspectionConfig'
import { SEVERITY_LABELS } from '../types'
import type { InspectionCategoryState, InspectionState, RecommendationResult, SeverityLevel } from '../types'

const CONDITION_TIER_BY_SEVERITY = ['excellent', 'light-dirt', 'moderate-dirt', 'heavy-contamination']

function severityOf(state: InspectionCategoryState, id: string): SeverityLevel {
  return (state[id] ?? 0) as SeverityLevel
}

function maxSeverity(state: InspectionCategoryState): SeverityLevel {
  const values = Object.values(state)
  return (values.length ? Math.max(...values) : 0) as SeverityLevel
}

export function computeRecommendations(inspection: InspectionState): RecommendationResult {
  const { paint, wheels, interior, engineBay } = inspection

  const cautions: string[] = []
  const addOnReasons: Record<string, string> = {}
  const suggestedAddOnIds = new Set<string>()

  // ── Paint-driven add-ons ────────────────────────────────────────────
  if (
    severityOf(paint, 'water-spots') >= 1 ||
    severityOf(paint, 'bug-damage') >= 1 ||
    severityOf(paint, 'tar') >= 1 ||
    severityOf(paint, 'tree-sap') >= 1 ||
    severityOf(paint, 'oxidation') >= 1
  ) {
    suggestedAddOnIds.add('clay-bar')
    addOnReasons['clay-bar'] = 'Bonded contaminants need to be lifted with a clay decontamination pass before any polishing.'
  }

  // ── Wheel-driven add-ons & cautions ────────────────────────────────
  if (severityOf(wheels, 'brake-dust') >= 2 || severityOf(wheels, 'wheel-barrels') >= 2) {
    suggestedAddOnIds.add('iron-removal')
    addOnReasons['iron-removal'] = 'Heavy iron fallout on the wheels and barrels needs a dedicated chemical treatment.'
  }
  if (severityOf(wheels, 'wheel-damage') >= 1) {
    cautions.push('Existing wheel damage noted — outside the scope of detailing services; flag to the client before work begins.')
  }

  // ── Interior-driven add-ons ─────────────────────────────────────────
  if (severityOf(interior, 'leather') >= 2) {
    suggestedAddOnIds.add('leather-conditioning')
    addOnReasons['leather-conditioning'] = 'Leather is showing dryness/wear — conditioning now prevents cracking.'
  }
  if (severityOf(interior, 'alcantara') >= 1) {
    suggestedAddOnIds.add('interior-protectant')
    addOnReasons['interior-protectant'] = 'Alcantara needs a protectant-safe treatment rather than a leather conditioner.'
  }
  if (severityOf(interior, 'pet-hair') >= 1) {
    suggestedAddOnIds.add('pet-hair-removal')
    addOnReasons['pet-hair-removal'] = 'Pet hair embedded in carpet and upholstery needs dedicated extraction.'
  }
  if (severityOf(interior, 'smoke') >= 1) {
    suggestedAddOnIds.add('odor-treatment')
    addOnReasons['odor-treatment'] = 'Smoke odor needs an odor treatment, not just a wipe-down.'
  }
  if (severityOf(interior, 'sand') >= 2 || severityOf(interior, 'heavy-dirt') >= 2 || severityOf(interior, 'stains') >= 2) {
    suggestedAddOnIds.add('steam-cleaning')
    addOnReasons['steam-cleaning'] = 'Ground-in dirt and stains need steam extraction to fully lift.'
  }
  if (severityOf(interior, 'glass') >= 1) {
    suggestedAddOnIds.add('glass-sealant')
    addOnReasons['glass-sealant'] = 'Interior glass film buildup — a sealant keeps it clear longer between visits.'
  }

  // ── Engine bay ───────────────────────────────────────────────────────
  if (severityOf(engineBay, 'engine-grime') >= 1) {
    suggestedAddOnIds.add('engine-bay')
    addOnReasons['engine-bay'] = 'Visible engine bay grime — a quick degrease and dress keeps it presentation-ready.'
  }

  // ── Primary service suggestion ──────────────────────────────────────
  const paintMax = maxSeverity(paint)
  const interiorMax = maxSeverity(interior)
  const paintNeedsWork = paintMax >= 2
  const interiorNeedsWork = interiorMax >= 2

  let suggestedServiceId = 'maintenance-wash'
  let serviceReason = 'No significant paint or interior concerns found — a maintenance wash keeps the vehicle presentation-ready.'

  if (severityOf(paint, 'oxidation') >= 3 || severityOf(paint, 'swirls') >= 3) {
    suggestedServiceId = 'paint-correction'
    serviceReason = "Heavy swirling or oxidation found — a one-step polish won't fully resolve this; multi-stage correction is recommended."
  } else if (paintNeedsWork && interiorNeedsWork) {
    suggestedServiceId = 'signature-full-detail'
    serviceReason = 'Both paint and interior show meaningful wear — the signature full detail addresses both in one visit.'
  } else if (severityOf(paint, 'swirls') >= 2 || severityOf(paint, 'water-spots') >= 2 || severityOf(paint, 'oxidation') >= 2) {
    suggestedServiceId = 'paint-enhancement'
    serviceReason = 'Moderate swirling or water spotting found — a one-step enhancement will restore gloss and clarity.'
  } else if (paintNeedsWork) {
    suggestedServiceId = 'exterior-detail'
    serviceReason = 'Exterior shows meaningful contamination — a full exterior detail is recommended over a maintenance wash.'
  } else if (interiorNeedsWork) {
    suggestedServiceId = 'interior-detail'
    serviceReason = 'Interior shows meaningful wear — a full interior detail is recommended over a maintenance wash.'
  }

  // ── Aggregate condition tier from the worst finding overall ────────
  const overallMax = Math.max(paintMax, maxSeverity(wheels), interiorMax) as SeverityLevel
  const suggestedConditionId = CONDITION_TIER_BY_SEVERITY[overallMax]

  // ── Findings, for the client-facing "why" explanation ──────────────
  const findings: string[] = []
  const pushFindings = (state: InspectionCategoryState, defs: { id: string; label: string }[]) => {
    for (const item of defs) {
      const level = severityOf(state, item.id)
      if (level >= 1) findings.push(`${item.label} — ${SEVERITY_LABELS[level]}`)
    }
  }
  pushFindings(paint, inspectionConfig.paint)
  pushFindings(wheels, inspectionConfig.wheels)
  pushFindings(interior, inspectionConfig.interior)
  pushFindings(engineBay, inspectionConfig.engineBay)

  return {
    suggestedServiceId,
    suggestedConditionId,
    suggestedAddOnIds: Array.from(suggestedAddOnIds),
    addOnReasons,
    serviceReason,
    cautions,
    findings,
  }
}
