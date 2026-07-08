// Step 4 — Condition & Findings. Exterior and Interior Condition each carry
// their own flat surcharge (one bucket covering all forms of contamination
// on that side of the vehicle, applied once, never stacked per finding).
// Paint, Wheels, and Engine Bay are technician-reference categories only —
// no price impact — kept deliberately simple (a single tier each) to help
// decide which primary service fits and which Exterior/Interior Condition
// tier to pick, without overwhelming the estimator with itemized findings.

import { Sparkles } from 'lucide-react'
import { GlassPanel } from '../ui/GlassPanel'
import { SectionHeading } from '../ui/SectionHeading'
import { SelectField } from '../ui/SelectField'
import { pricingConfig } from '../../config/pricingConfig'
import type { ConditionTierId, EstimateSelections } from '../../types'

interface InspectionFormProps {
  selections: EstimateSelections
  onChange: <K extends keyof EstimateSelections>(key: K, value: EstimateSelections[K]) => void
}

export function InspectionForm({ selections, onChange }: InspectionFormProps) {
  return (
    <GlassPanel className="p-6" delay={0.08}>
      <SectionHeading eyebrow="Step Four" title="Condition & Findings" icon={<Sparkles className="h-5 w-5" />} />
      <p className="mb-5 -mt-2 text-sm text-slate-400">
        Exterior and Interior Condition each adjust price, applied once per side. Paint, Wheels, and Engine Bay are
        technician reference only — they help pick the right service and condition tier, never add their own charge.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <SelectField
          label="Exterior Condition"
          value={selections.exteriorConditionId}
          onChange={(v) => onChange('exteriorConditionId', v as ConditionTierId)}
          options={pricingConfig.exteriorConditions.map((c) => ({ value: c.id, label: c.label }))}
          hint="Bugs, brake dust, road film, tar, tree sap, fallout, and general contamination"
        />
        <SelectField
          label="Interior Condition"
          value={selections.interiorConditionId}
          onChange={(v) => onChange('interiorConditionId', v as ConditionTierId)}
          options={pricingConfig.interiorConditions.map((c) => ({ value: c.id, label: c.label }))}
          hint="Interior contamination — cleaning surcharge"
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SelectField
          label="Paint"
          value={selections.paintConditionId}
          onChange={(v) => onChange('paintConditionId', v as ConditionTierId)}
          options={pricingConfig.paintConditions.map((c) => ({ value: c.id, label: c.label }))}
          hint="Swirls / clarity — helps recommend Signature Paint Enhancement"
        />
        <SelectField
          label="Wheels"
          value={selections.wheelConditionId}
          onChange={(v) => onChange('wheelConditionId', v as ConditionTierId)}
          options={pricingConfig.wheelConditions.map((c) => ({ value: c.id, label: c.label }))}
          hint="Reference only — no price impact"
        />
        <SelectField
          label="Engine Bay"
          value={selections.engineBayConditionId}
          onChange={(v) => onChange('engineBayConditionId', v as ConditionTierId)}
          options={pricingConfig.engineBayConditions.map((c) => ({ value: c.id, label: c.label }))}
          hint="Reference only — no price impact"
        />
      </div>
    </GlassPanel>
  )
}
