// Step 3 — Primary Service. A single dropdown across the four services we
// offer, plus the exact "includes" checklist and equipment used for
// whichever one is selected.

import { Gauge } from 'lucide-react'
import { GlassPanel } from '../ui/GlassPanel'
import { SectionHeading } from '../ui/SectionHeading'
import { SelectField } from '../ui/SelectField'
import { pricingConfig } from '../../config/pricingConfig'
import type { EstimateSelections } from '../../types'

interface ServiceConditionFormProps {
  selections: EstimateSelections
  onChange: <K extends keyof EstimateSelections>(key: K, value: EstimateSelections[K]) => void
}

export function ServiceConditionForm({ selections, onChange }: ServiceConditionFormProps) {
  const service = pricingConfig.services.find((s) => s.id === selections.serviceId)

  return (
    <GlassPanel className="p-6" delay={0.11}>
      <SectionHeading eyebrow="Step Three" title="Primary Service" icon={<Gauge className="h-5 w-5" />} />

      <div className="max-w-sm">
        <SelectField
          label="Service"
          value={selections.serviceId}
          onChange={(v) => onChange('serviceId', v)}
          options={pricingConfig.services.map((s) => ({ value: s.id, label: s.label }))}
        />
      </div>

      {service && (
        <div className="mt-4 rounded-lg border border-white/10 bg-white/[0.02] p-4">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">{service.label} Includes</p>
          <ul className="grid grid-cols-1 gap-x-6 gap-y-1 sm:grid-cols-2">
            {service.includes.map((item) => (
              <li key={item} className="flex items-start gap-1.5 text-xs text-slate-400">
                <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-[#C9A227]/70" />
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {service.equipmentUsed.map((eq) => (
              <span key={eq} className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[10px] text-slate-500">
                {eq}
              </span>
            ))}
          </div>
        </div>
      )}
    </GlassPanel>
  )
}
