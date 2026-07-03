// Grid of add-on toggle chips, each showing its editable price.

import { Sparkles } from 'lucide-react'
import { GlassPanel } from '../ui/GlassPanel'
import { SectionHeading } from '../ui/SectionHeading'
import { Checkbox } from '../ui/Checkbox'
import { pricingConfig } from '../../config/pricingConfig'
import { formatCurrency } from '../../utils/format'

interface AddOnsGridProps {
  selectedIds: string[]
  onToggle: (id: string) => void
}

export function AddOnsGrid({ selectedIds, onToggle }: AddOnsGridProps) {
  return (
    <GlassPanel className="p-6" delay={0.1}>
      <SectionHeading eyebrow="Step Three" title="Add-Ons" icon={<Sparkles className="h-5 w-5" />} />
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {pricingConfig.addOns.map((addOn) => (
          <Checkbox
            key={addOn.id}
            label={addOn.label}
            price={addOn.price}
            formattedPrice={formatCurrency(addOn.price)}
            checked={selectedIds.includes(addOn.id)}
            onChange={() => onToggle(addOn.id)}
          />
        ))}
      </div>
    </GlassPanel>
  )
}
