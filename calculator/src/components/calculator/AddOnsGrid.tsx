// Grid of add-on toggle chips, split into a "Recommended Add-Ons" section
// (driven by the inspection, each with a plain-language reason) and an
// "Optional Add-Ons" section for everything else. Accepting a recommended
// add-on is still a deliberate click, since it directly changes the price.

import { Sparkles, TriangleAlert } from 'lucide-react'
import { motion } from 'framer-motion'
import { GlassPanel } from '../ui/GlassPanel'
import { SectionHeading } from '../ui/SectionHeading'
import { Checkbox } from '../ui/Checkbox'
import { pricingConfig } from '../../config/pricingConfig'
import { formatCurrency } from '../../utils/format'
import type { AddOnOption, RecommendationResult } from '../../types'

interface AddOnsGridProps {
  selectedIds: string[]
  onToggle: (id: string) => void
  recommendations: RecommendationResult
}

export function AddOnsGrid({ selectedIds, onToggle, recommendations }: AddOnsGridProps) {
  const recommended = pricingConfig.addOns.filter((a) => recommendations.suggestedAddOnIds.includes(a.id))
  const optional = pricingConfig.addOns.filter((a) => !recommendations.suggestedAddOnIds.includes(a.id))

  return (
    <GlassPanel className="p-6" delay={0.14}>
      <SectionHeading eyebrow="Step Five" title="Add-Ons" icon={<Sparkles className="h-5 w-5" />} />

      {recommendations.cautions.length > 0 && (
        <div className="mb-4 space-y-1.5">
          {recommendations.cautions.map((caution) => (
            <div key={caution} className="flex items-start gap-2 rounded-lg border border-amber-400/25 bg-amber-400/8 px-3.5 py-2 text-xs text-amber-200">
              <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>{caution}</span>
            </div>
          ))}
        </div>
      )}

      {recommended.length > 0 && (
        <div className="mb-5">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C9A227]/80">Recommended Add-Ons</p>
          <AddOnList addOns={recommended} selectedIds={selectedIds} onToggle={onToggle} recommendations={recommendations} />
        </div>
      )}

      <div>
        {recommended.length > 0 && <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Optional Add-Ons</p>}
        <AddOnList addOns={optional} selectedIds={selectedIds} onToggle={onToggle} recommendations={recommendations} />
      </div>
    </GlassPanel>
  )
}

function AddOnList({
  addOns,
  selectedIds,
  onToggle,
  recommendations,
}: {
  addOns: AddOnOption[]
  selectedIds: string[]
  onToggle: (id: string) => void
  recommendations: RecommendationResult
}) {
  return (
    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
      {addOns.map((addOn, index) => (
        <motion.div
          key={addOn.id}
          layout
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.02, ease: [0.16, 1, 0.3, 1] }}
        >
          <Checkbox
            label={addOn.label}
            price={addOn.price}
            formattedPrice={formatCurrency(addOn.price)}
            checked={selectedIds.includes(addOn.id)}
            onChange={() => onToggle(addOn.id)}
            recommended={recommendations.suggestedAddOnIds.includes(addOn.id)}
            reason={recommendations.addOnReasons[addOn.id]}
          />
        </motion.div>
      ))}
    </div>
  )
}
