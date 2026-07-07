// Premium Upgrades grid. Only upgrades valid for the currently selected
// service are shown — one already bundled into the selected package (e.g.
// Iron Removal / Clay Mitt on Paint Enhancement) is hidden rather than
// shown disabled, since it's redundant, not a choice. Leather Conditioning
// is additionally hidden unless the vehicle's interior material includes
// leather.

import { Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { GlassPanel } from '../ui/GlassPanel'
import { SectionHeading } from '../ui/SectionHeading'
import { Checkbox } from '../ui/Checkbox'
import { pricingConfig } from '../../config/pricingConfig'
import { formatCurrency } from '../../utils/format'
import type { InteriorMaterial } from '../../types'

const LEATHER_INTERIOR_MATERIALS: InteriorMaterial[] = ['leather', 'leather-alcantara']

interface AddOnsGridProps {
  serviceId: string
  interiorMaterial: InteriorMaterial
  selectedIds: string[]
  onToggle: (id: string) => void
}

export function AddOnsGrid({ serviceId, interiorMaterial, selectedIds, onToggle }: AddOnsGridProps) {
  const hasLeatherInterior = LEATHER_INTERIOR_MATERIALS.includes(interiorMaterial)
  const available = pricingConfig.addOns.filter(
    (a) => a.availableForServiceIds.includes(serviceId) && (!a.requiresLeatherInterior || hasLeatherInterior),
  )

  return (
    <GlassPanel className="p-6" delay={0.14}>
      <SectionHeading eyebrow="Step Five" title="Premium Upgrades" icon={<Sparkles className="h-5 w-5" />} />

      {available.length === 0 ? (
        <p className="text-sm text-slate-500">Every upgrade for this service is already included.</p>
      ) : (
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {available.map((addOn, index) => (
            <motion.div
              key={addOn.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.02, ease: [0.16, 1, 0.3, 1] }}
            >
              <Checkbox
                label={addOn.label}
                formattedPrice={formatCurrency(addOn.price)}
                includes={addOn.includes}
                checked={selectedIds.includes(addOn.id)}
                onChange={() => onToggle(addOn.id)}
              />
            </motion.div>
          ))}
        </div>
      )}
    </GlassPanel>
  )
}
