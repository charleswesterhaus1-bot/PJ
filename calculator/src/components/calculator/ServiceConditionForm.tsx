// Step 4 — primary service, vehicle size, and condition tier. The service
// and condition are pre-filled from the inspection findings (Step Three)
// but always stay a simple dropdown change away from being overridden.

import { Wand2, Gauge } from 'lucide-react'
import { GlassPanel } from '../ui/GlassPanel'
import { SectionHeading } from '../ui/SectionHeading'
import { SelectField } from '../ui/SelectField'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { pricingConfig } from '../../config/pricingConfig'
import type { EstimateSelections, RecommendationResult } from '../../types'

interface ServiceConditionFormProps {
  selections: EstimateSelections
  onChange: <K extends keyof EstimateSelections>(key: K, value: EstimateSelections[K]) => void
  recommendations: RecommendationResult
}

export function ServiceConditionForm({ selections, onChange, recommendations }: ServiceConditionFormProps) {
  const service = pricingConfig.services.find((s) => s.id === selections.serviceId)
  const serviceMatchesRecommendation = selections.serviceId === recommendations.suggestedServiceId
  const conditionMatchesRecommendation = selections.conditionId === recommendations.suggestedConditionId

  return (
    <GlassPanel className="p-6" delay={0.11}>
      <SectionHeading eyebrow="Step Four" title="Service &amp; Condition" icon={<Gauge className="h-5 w-5" />} />

      {!serviceMatchesRecommendation && (
        <div className="mb-4 flex items-start justify-between gap-3 rounded-lg border border-[#C9A227]/30 bg-[#C9A227]/8 px-4 py-3">
          <div className="flex items-start gap-2">
            <Wand2 className="mt-0.5 h-4 w-4 shrink-0 text-[#E8CF83]" />
            <div>
              <p className="text-sm font-medium text-slate-100">
                Recommended: {pricingConfig.services.find((s) => s.id === recommendations.suggestedServiceId)?.label}
              </p>
              <p className="mt-0.5 text-xs text-slate-400">{recommendations.serviceReason}</p>
            </div>
          </div>
          <Button variant="secondary" className="shrink-0 px-3 py-1.5 text-xs" onClick={() => onChange('serviceId', recommendations.suggestedServiceId)}>
            Apply
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Primary Service</span>
            {serviceMatchesRecommendation && <Badge tone="gold">Recommended</Badge>}
          </div>
          <SelectField
            label=""
            value={selections.serviceId}
            onChange={(v) => onChange('serviceId', v)}
            options={pricingConfig.services.map((s) => ({ value: s.id, label: s.label }))}
          />
          {service?.description && <p className="mt-1.5 text-xs text-slate-500">{service.description}</p>}
          {service && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {service.equipmentUsed.map((eq) => (
                <span key={eq} className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[10px] text-slate-500">
                  {eq}
                </span>
              ))}
            </div>
          )}
        </div>

        <SelectField
          label="Vehicle Size"
          value={selections.vehicleSizeId}
          onChange={(v) => onChange('vehicleSizeId', v)}
          options={pricingConfig.vehicleSizes.map((v) => ({ value: v.id, label: v.label }))}
        />
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Vehicle Condition</span>
            {conditionMatchesRecommendation && <Badge tone="gold">From Inspection</Badge>}
          </div>
          <SelectField
            label=""
            value={selections.conditionId}
            onChange={(v) => onChange('conditionId', v)}
            options={pricingConfig.conditions.map((c) => ({ value: c.id, label: c.label }))}
          />
        </div>
      </div>
    </GlassPanel>
  )
}
