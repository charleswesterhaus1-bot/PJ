// Turns inspection findings into recommendations: which primary service
// fits best, which of the two Premium Upgrades apply (with a plain-language
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

  // Gloss/swirl concerns specifically call for Paint Enhancement Detail —
  // separate from general dirt/contamination, which just needs a wash or
  // exterior detail.
  const correctionSeverity = maxOf(paint, ['swirls', 'oxidation'])
  // General exterior contamination — paint grime plus wheel/tire grime,
  // since Signature Exterior Detail covers both.
  const paintContaminationSeverity = maxOf(paint, ['water-spots', 'bug-damage', 'tar', 'tree-sap', 'road-film'])
  const wheelDirtSeverity = maxOf(wheels, ['brake-dust', 'wheel-barrels', 'tire-blooming'])
  const exteriorSeverity = Math.max(paintContaminationSeverity, wheelDirtSeverity) as SeverityLevel
  const interiorSeverity = maxOf(interior)
  const engineSeverity = maxOf(engineBay)

  if (severityOf(wheels, 'wheel-damage') >= 1) {
    cautions.push('Existing wheel damage noted — outside the scope of detailing services; flag to the client before work begins.')
  }

  // ── Premium Upgrades ────────────────────────────────────────────────
  if (engineSeverity >= 2) {
    suggestedAddOnIds.add('engine-bay')
    addOnReasons['engine-bay'] = 'Visible engine bay grime — a clean and dress keeps it presentation-ready.'
  }
  if (severityOf(interior, 'leather') >= 1) {
    suggestedAddOnIds.add('leather-conditioning')
    addOnReasons['leather-conditioning'] = 'Leather is showing dryness or wear — conditioning now protects it and prevents cracking.'
  }

  // ── Primary service suggestion ──────────────────────────────────────
  const exteriorNeedsWork = exteriorSeverity >= 2
  const interiorNeedsWork = interiorSeverity >= 2

  let suggestedServiceId = 'maintenance-wash'
  let serviceReason = 'Excellent condition — a Signature Maintenance Wash keeps the vehicle presentation-ready.'

  if (correctionSeverity >= 1) {
    suggestedServiceId = 'paint-enhancement'
    serviceReason = 'Swirls or a gloss improvement were noted — Paint Enhancement Detail restores clarity and depth.'
  } else if (exteriorNeedsWork && interiorNeedsWork) {
    suggestedServiceId = 'full-detail'
    serviceReason = 'Both exterior and interior need deeper attention — the Signature Full Detail addresses both in one visit.'
  } else if (interiorNeedsWork) {
    suggestedServiceId = 'interior-detail'
    serviceReason = 'Interior needs deeper attention — the Signature Interior Detail is recommended over a maintenance wash.'
  } else if (exteriorNeedsWork) {
    suggestedServiceId = 'exterior-detail'
    serviceReason = 'Exterior needs deeper attention — the Signature Exterior Detail is recommended over a maintenance wash.'
  }

  // ── Aggregate condition tier from the worst finding overall ────────
  const overallMax = Math.max(correctionSeverity, exteriorSeverity, interiorSeverity, engineSeverity) as SeverityLevel
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
