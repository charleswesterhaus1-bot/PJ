// Step 4 — Condition & Findings. Simplified to three plain dropdowns:
// Exterior and Interior Condition each carry their own flat surcharge (one
// bucket covering all forms of contamination on that side of the vehicle);
// Paint Condition is a technician note only and appears solely when Paint
// Enhancement Detail is the selected service.

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
  const showPaintCondition = selections.serviceId === 'paint-enhancement'

  return (
    <GlassPanel className="p-6" delay={0.08}>
      <SectionHeading eyebrow="Step Four" title="Condition & Findings" icon={<Sparkles className="h-5 w-5" />} />
      <p className="mb-5 -mt-2 text-sm text-slate-400">
        Exterior and Interior Condition each adjust price. Paint Condition is a technician note only.
      </p>

      <div className={`grid grid-cols-1 gap-4 ${showPaintCondition ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}>
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
        {showPaintCondition && (
          <SelectField
            label="Paint Condition"
            value={selections.paintConditionId}
            onChange={(v) => onChange('paintConditionId', v as ConditionTierId)}
            options={pricingConfig.paintConditions.map((c) => ({ value: c.id, label: c.label }))}
            hint="Notes only — no price impact"
          />
        )}
      </div>
    </GlassPanel>
  )
}
