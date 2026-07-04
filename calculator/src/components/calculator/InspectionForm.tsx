// Step 3 — the inspection walkthrough. Every finding here feeds the
// recommendation engine: service suggestions, add-on suggestions, the
// condition tier, and the "why" findings printed on the estimate.

import { Sparkles, CircleDot, Sofa, Cog } from 'lucide-react'
import { GlassPanel } from '../ui/GlassPanel'
import { SectionHeading } from '../ui/SectionHeading'
import { SeverityPicker } from '../ui/SeverityPicker'
import { inspectionConfig } from '../../config/inspectionConfig'
import type { InspectionCategory, InspectionState, SeverityLevel } from '../../types'

interface InspectionFormProps {
  inspection: InspectionState
  onChangeSeverity: (category: InspectionCategory, itemId: string, level: SeverityLevel) => void
}

export function InspectionForm({ inspection, onChangeSeverity }: InspectionFormProps) {
  return (
    <GlassPanel className="p-6" delay={0.08}>
      <SectionHeading eyebrow="Step Three" title="Vehicle Inspection" icon={<Sparkles className="h-5 w-5" />} />
      <p className="mb-5 -mt-2 text-sm text-slate-400">
        Rate what you find. Findings here automatically drive the recommended service, add-ons, and condition tier.
      </p>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <InspectionCategoryCard
          title="Paint Condition"
          icon={<CircleDot className="h-4 w-4" />}
          items={inspectionConfig.paint}
          state={inspection.paint}
          onChange={(id, level) => onChangeSeverity('paint', id, level)}
        />
        <InspectionCategoryCard
          title="Wheel Condition"
          icon={<CircleDot className="h-4 w-4" />}
          items={inspectionConfig.wheels}
          state={inspection.wheels}
          onChange={(id, level) => onChangeSeverity('wheels', id, level)}
        />
        <InspectionCategoryCard
          title="Interior Condition"
          icon={<Sofa className="h-4 w-4" />}
          items={inspectionConfig.interior}
          state={inspection.interior}
          onChange={(id, level) => onChangeSeverity('interior', id, level)}
        />
        <InspectionCategoryCard
          title="Engine Bay"
          icon={<Cog className="h-4 w-4" />}
          items={inspectionConfig.engineBay}
          state={inspection.engineBay}
          onChange={(id, level) => onChangeSeverity('engineBay', id, level)}
        />
      </div>
    </GlassPanel>
  )
}

function InspectionCategoryCard({
  title,
  icon,
  items,
  state,
  onChange,
}: {
  title: string
  icon: React.ReactNode
  items: { id: string; label: string }[]
  state: Record<string, SeverityLevel>
  onChange: (id: string, level: SeverityLevel) => void
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
      <div className="mb-1 flex items-center gap-2 text-[#C9A227]">
        {icon}
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">{title}</h3>
      </div>
      <div className="divide-y divide-white/5">
        {items.map((item) => (
          <SeverityPicker
            key={item.id}
            label={item.label}
            value={(state[item.id] ?? 0) as SeverityLevel}
            onChange={(level) => onChange(item.id, level)}
          />
        ))}
      </div>
    </div>
  )
}
