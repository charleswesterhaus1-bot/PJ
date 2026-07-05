// Turns inspection findings into recommendations: which primary service
// fits best, which add-ons address specific findings (with a plain-language
// reason for each), which overall condition tier the job falls into, and
// which findings should be called out on the client-facing estimate.
//
// Written as explicit rules rather than a generic data table — the logic
// is hierarchical (e.g. "both exterior AND interior need work" overrides
// either alone) in ways a flat rule list can't express cleanly. Thresholds
// are named constants below so they stay easy to tune.

import { inspectionConfig } from '../config/inspectionConfig'
import { SEVERITY_LABELS } from '../types'
import type { InspectionCategoryState, InspectionState, RecommendationResult, SeverityLevel } from '../types'

const CONDITION_TIER_BY_SEVERITY = ['excellent', 'light-dirt', 'moderate-dirt', 'heavy-contamination']

function severityOf(state: InspectionCategoryState, id: string): SeverityLevel {
  return (state[id] ?? 0) as SeverityLevel
}

function maxOf(state: InspectionCategoryState, ids?: string[]): SeverityLevel {
  const values = ids ? ids.map((id) => severityOf(state, id)) : Object.values(state)
  return (values.length ? Math.max(...values) : 0) as SeverityLevel
}

export function computeRecommendations(inspection: InspectionState): RecommendationResult {
  const { paint, wheels, interior, engineBay } = inspection

  const cautions: string[] = []
  const addOnReasons: Record<string, string> = {}
  const suggestedAddOnIds = new Set<string>()

  // Paint splits into two concerns: defects that need machine correction
  // (swirls/oxidation) vs. bonded surface contaminants (everything else),
  // since they drive different services and add-ons.
  const correctionSeverity = maxOf(paint, ['swirls', 'oxidation'])
  const contaminationSeverity = maxOf(paint, ['water-spots', 'bug-damage', 'tar', 'tree-sap', 'road-film'])
  const interiorSeverity = maxOf(interior)
  const wheelIronSeverity = maxOf(wheels, ['brake-dust', 'wheel-barrels'])
  const wheelMax = maxOf(wheels)
  const engineSeverity = maxOf(engineBay)

  // ── Exterior decontamination: bundle for heavy, individual for moderate ──
  if (contaminationSeverity >= 3 || wheelIronSeverity >= 3) {
    suggestedAddOnIds.add('ext-decon-package')
    addOnReasons['ext-decon-package'] =
      'Heavy exterior contamination and/or iron fallout found — the decontamination package (iron removal + clay) fully resets the paint before any protection is applied.'
  } else {
    if (contaminationSeverity >= 2) {
      suggestedAddOnIds.add('clay-decon')
      addOnReasons['clay-decon'] = 'Bonded contaminants (water spots, bug, tar, sap, or road film) need a clay decontamination pass.'
    }
    if (wheelIronSeverity >= 2) {
      suggestedAddOnIds.add('iron-removal')
      addOnReasons['iron-removal'] = 'Noticeable brake dust/iron fallout on the wheels needs a dedicated iron-removal treatment.'
    }
  }

  if (wheelMax >= 1 && severityOf(wheels, 'wheel-damage') >= 1) {
    cautions.push('Existing wheel damage noted — outside the scope of detailing services; flag to the client before work begins.')
  }

  // ── Engine bay ───────────────────────────────────────────────────────
  if (engineSeverity >= 2) {
    suggestedAddOnIds.add('engine-bay')
    addOnReasons['engine-bay'] = 'Visible engine bay grime — a degrease and dress keeps it presentation-ready.'
  }

  // ── Interior ─────────────────────────────────────────────────────────
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
  if (severityOf(interior, 'glass') >= 1) {
    suggestedAddOnIds.add('glass-sealant')
    addOnReasons['glass-sealant'] = 'Interior glass film buildup — a sealant keeps it clear longer between visits.'
  }

  // ── Primary service suggestion ──────────────────────────────────────
  let suggestedServiceId = 'maintenance-wash'
  let serviceReason = 'No significant paint or interior concerns found — a Premium Maintenance Wash keeps the vehicle presentation-ready.'

  if (correctionSeverity >= 3) {
    suggestedServiceId = 'paint-enhancement'
    serviceReason = "Heavy swirling or oxidation found — a machine polish (Paint Enhancement Detail) is recommended to restore gloss and clarity."
  } else if (contaminationSeverity >= 2 && interiorSeverity >= 2) {
    suggestedServiceId = 'full-detail'
    serviceReason = 'Both exterior and interior show meaningful wear — the Signature Full Detail addresses both in one visit.'
  } else if (interiorSeverity >= 2) {
    suggestedServiceId = 'interior-detail'
    serviceReason = 'Interior shows meaningful wear — the Signature Interior Detail is recommended over a maintenance wash.'
  } else if (contaminationSeverity >= 2) {
    suggestedServiceId = 'exterior-detail'
    serviceReason = 'Exterior shows meaningful contamination — the Signature Exterior Detail is recommended over a maintenance wash.'
  }

  // ── Aggregate condition tier from the worst finding overall ────────
  const overallMax = Math.max(correctionSeverity, contaminationSeverity, interiorSeverity, wheelMax, engineSeverity) as SeverityLevel
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
