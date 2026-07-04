// Travel distance input and discount selector, side by side.

import { MapPin, Tag } from 'lucide-react'
import { GlassPanel } from '../ui/GlassPanel'
import { SectionHeading } from '../ui/SectionHeading'
import { NumberField } from '../ui/NumberField'
import { SelectField } from '../ui/SelectField'
import { pricingConfig } from '../../config/pricingConfig'
import type { DiscountKind, EstimateSelections } from '../../types'
import { formatCurrency } from '../../utils/format'

interface TravelAndDiscountFormProps {
  selections: EstimateSelections
  onChange: <K extends keyof EstimateSelections>(key: K, value: EstimateSelections[K]) => void
}

export function TravelAndDiscountForm({ selections, onChange }: TravelAndDiscountFormProps) {
  const { travel, discounts } = pricingConfig

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <GlassPanel className="p-6" delay={0.15}>
        <SectionHeading eyebrow="Step Six" title="Travel" icon={<MapPin className="h-5 w-5" />} />
        <NumberField
          label="Travel Distance (Miles)"
          value={selections.travelMiles}
          onChange={(v) => onChange('travelMiles', v)}
          suffix="mi"
          hint={`First ${travel.freeMiles} mi free, then ${formatCurrency(travel.pricePerMile)}/mi`}
        />
      </GlassPanel>

      <GlassPanel className="p-6" delay={0.2}>
        <SectionHeading eyebrow="Step Seven" title="Discount" icon={<Tag className="h-5 w-5" />} />
        <div className="space-y-4">
          <SelectField
            label="Discount Type"
            value={selections.discountId}
            onChange={(v) => onChange('discountId', v as DiscountKind | 'none')}
            options={[{ value: 'none', label: 'No Discount' }, ...discounts.map((d) => ({ value: d.id, label: d.label }))]}
          />
          {selections.discountId === 'custom' && (
            <NumberField
              label="Custom Discount"
              value={selections.customDiscountPercent}
              onChange={(v) => onChange('customDiscountPercent', v)}
              suffix="%"
              min={0}
              max={100}
            />
          )}
        </div>
      </GlassPanel>
    </div>
  )
}
