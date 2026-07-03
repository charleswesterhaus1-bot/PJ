// Core pricing drivers: primary service, vehicle type, size, and condition.
// All option lists are pulled from the pricing config — nothing hardcoded.

import { Gauge } from 'lucide-react'
import { GlassPanel } from '../ui/GlassPanel'
import { SectionHeading } from '../ui/SectionHeading'
import { SelectField } from '../ui/SelectField'
import { pricingConfig } from '../../config/pricingConfig'
import type { EstimateSelections } from '../../types'

interface VehicleDetailsFormProps {
  selections: EstimateSelections
  onChange: <K extends keyof EstimateSelections>(key: K, value: EstimateSelections[K]) => void
}

export function VehicleDetailsForm({ selections, onChange }: VehicleDetailsFormProps) {
  const service = pricingConfig.services.find((s) => s.id === selections.serviceId)

  return (
    <GlassPanel className="p-6" delay={0.05}>
      <SectionHeading eyebrow="Step Two" title="Vehicle & Service" icon={<Gauge className="h-5 w-5" />} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <SelectField
            label="Primary Service"
            value={selections.serviceId}
            onChange={(v) => onChange('serviceId', v)}
            options={pricingConfig.services.map((s) => ({ value: s.id, label: s.label }))}
            hint={service?.description}
          />
        </div>
        <SelectField
          label="Vehicle Type"
          value={selections.vehicleTypeId}
          onChange={(v) => onChange('vehicleTypeId', v)}
          options={pricingConfig.vehicleTypes.map((v) => ({ value: v.id, label: v.label }))}
        />
        <SelectField
          label="Vehicle Size"
          value={selections.vehicleSizeId}
          onChange={(v) => onChange('vehicleSizeId', v)}
          options={pricingConfig.vehicleSizes.map((v) => ({ value: v.id, label: v.label }))}
        />
        <div className="sm:col-span-2">
          <SelectField
            label="Vehicle Condition"
            value={selections.conditionId}
            onChange={(v) => onChange('conditionId', v)}
            options={pricingConfig.conditions.map((c) => ({ value: c.id, label: c.label }))}
            hint="Automatically applies a pricing multiplier — adjustable in settings"
          />
        </div>
      </div>
    </GlassPanel>
  )
}
