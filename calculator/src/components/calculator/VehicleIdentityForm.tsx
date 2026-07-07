// Step 2 — vehicle identity. Make/Model drive automatic classification into
// Sports Car / Supercar / Performance Truck / Hypercar; the result is
// shown as a badge with a manual override always available underneath.
// Also captures special surfaces/finishes (PPF, ceramic coating, matte
// paint, wraps, soft top, carbon fiber) that change handling, not price.

import { Gauge } from 'lucide-react'
import { GlassPanel } from '../ui/GlassPanel'
import { SectionHeading } from '../ui/SectionHeading'
import { TextField } from '../ui/TextField'
import { SelectField } from '../ui/SelectField'
import { Badge } from '../ui/Badge'
import { pricingConfig } from '../../config/pricingConfig'
import type { PpfCoverage, TriState, VehicleInfo } from '../../types'

interface VehicleIdentityFormProps {
  vehicle: VehicleInfo
  onChange: <K extends keyof VehicleInfo>(key: K, value: VehicleInfo[K]) => void
  classification: string
  vehicleTypeId: string
  onVehicleTypeChange: (id: string) => void
}

const PPF_OPTIONS: { value: PpfCoverage; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'partial', label: 'Partial' },
  { value: 'full', label: 'Full' },
  { value: 'unknown', label: 'Unknown' },
]

const TRI_STATE_OPTIONS: { value: TriState; label: string }[] = [
  { value: 'unknown', label: 'Unknown' },
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
]

const BOOLEAN_FLAGS: { key: 'mattePaint' | 'vinylWrap' | 'convertibleTop' | 'carbonFiberExterior'; label: string }[] = [
  { key: 'mattePaint', label: 'Matte Paint' },
  { key: 'vinylWrap', label: 'Vinyl Wrap' },
  { key: 'convertibleTop', label: 'Convertible Soft Top' },
  { key: 'carbonFiberExterior', label: 'Carbon Fiber Exterior' },
]

export function VehicleIdentityForm({ vehicle, onChange, classification, vehicleTypeId, onVehicleTypeChange }: VehicleIdentityFormProps) {
  const hasInput = vehicle.make.trim() !== '' || vehicle.model.trim() !== ''
  const isAutoDetected = hasInput && vehicleTypeId === classification
  const currentType = pricingConfig.vehicleTypes.find((t) => t.id === vehicleTypeId)

  return (
    <GlassPanel className="p-6" delay={0.05}>
      <SectionHeading eyebrow="Step Two" title="Vehicle Information" icon={<Gauge className="h-5 w-5" />} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <TextField label="Year" value={vehicle.year} onChange={(v) => onChange('year', v)} placeholder="2024" />
        <TextField label="Make" value={vehicle.make} onChange={(v) => onChange('make', v)} placeholder="Porsche" />
        <TextField label="Model" value={vehicle.model} onChange={(v) => onChange('model', v)} placeholder="911 Carrera" />
        <TextField label="Color" value={vehicle.color} onChange={(v) => onChange('color', v)} placeholder="GT Silver" />
        <TextField label="Mileage (optional)" value={vehicle.mileage} onChange={(v) => onChange('mileage', v)} placeholder="4,200" />
        <TextField label="VIN (optional)" value={vehicle.vin} onChange={(v) => onChange('vin', v)} placeholder="WP0..." />
        <TextField label="License Plate (optional)" value={vehicle.licensePlate} onChange={(v) => onChange('licensePlate', v)} placeholder="ABC-1234" />
      </div>

      <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.02] p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Vehicle Class</span>
          {isAutoDetected && <Badge tone="gold">Auto-detected</Badge>}
        </div>
        <div className="mt-2 max-w-xs">
          <SelectField
            label=""
            value={vehicleTypeId}
            onChange={onVehicleTypeChange}
            options={pricingConfig.vehicleTypes.map((t) => ({ value: t.id, label: t.label }))}
          />
        </div>
        {currentType?.description && <p className="mt-2 text-xs text-slate-500">{currentType.description}</p>}
      </div>

      <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.02] p-4">
        <span className="mb-3 block text-xs font-medium uppercase tracking-wider text-slate-500">
          Special Surfaces &amp; Finishes
        </span>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <SelectField
            label="Paint Protection Film (PPF)"
            value={vehicle.ppf}
            onChange={(v) => onChange('ppf', v as PpfCoverage)}
            options={PPF_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
          />
          <SelectField
            label="Ceramic Coating Present"
            value={vehicle.ceramicCoating}
            onChange={(v) => onChange('ceramicCoating', v as TriState)}
            options={TRI_STATE_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
          />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {BOOLEAN_FLAGS.map((flag) => {
            const active = vehicle[flag.key]
            return (
              <button
                key={flag.key}
                type="button"
                onClick={() => onChange(flag.key, !active)}
                className={`hh-focus-ring rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  active
                    ? 'border-[#C9A227]/60 bg-[#C9A227]/10 text-[#E8CF83]'
                    : 'border-white/10 bg-white/[0.02] text-slate-400 hover:border-[#C9A227]/30 hover:text-slate-200'
                }`}
              >
                {flag.label}
              </button>
            )
          })}
        </div>
        <p className="mt-2 text-xs text-slate-500">
          These don&apos;t change price yet, but drive handling notes shown on the estimate.
        </p>
      </div>
    </GlassPanel>
  )
}
