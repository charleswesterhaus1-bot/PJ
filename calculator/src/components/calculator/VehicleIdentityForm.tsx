// Step 2 — vehicle identity. Make/Model drive automatic classification
// into Hypercar / Supercar / Exotic / High-End Sports Car; the result is
// shown as a badge with a manual override always available underneath.

import { Gauge, TriangleAlert } from 'lucide-react'
import { GlassPanel } from '../ui/GlassPanel'
import { SectionHeading } from '../ui/SectionHeading'
import { TextField } from '../ui/TextField'
import { SelectField } from '../ui/SelectField'
import { Badge } from '../ui/Badge'
import { pricingConfig } from '../../config/pricingConfig'
import type { ClassificationResult } from '../../utils/classifyVehicle'
import type { VehicleInfo } from '../../types'

interface VehicleIdentityFormProps {
  vehicle: VehicleInfo
  onChange: <K extends keyof VehicleInfo>(key: K, value: VehicleInfo[K]) => void
  classification: ClassificationResult
  vehicleTypeId: string
  onVehicleTypeChange: (id: string) => void
}

export function VehicleIdentityForm({ vehicle, onChange, classification, vehicleTypeId, onVehicleTypeChange }: VehicleIdentityFormProps) {
  const isUnsupported = classification?.vehicleTypeId === 'unsupported'
  const isAutoDetected = classification && !isUnsupported
  const currentType = pricingConfig.vehicleTypes.find((t) => t.id === vehicleTypeId)

  return (
    <GlassPanel className="p-6" delay={0.05}>
      <SectionHeading eyebrow="Step Two" title="Vehicle Information" icon={<Gauge className="h-5 w-5" />} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <TextField label="Year" value={vehicle.year} onChange={(v) => onChange('year', v)} placeholder="2024" />
        <TextField label="Make" value={vehicle.make} onChange={(v) => onChange('make', v)} placeholder="Ferrari" />
        <TextField label="Model" value={vehicle.model} onChange={(v) => onChange('model', v)} placeholder="296 GTB" />
        <TextField label="Color" value={vehicle.color} onChange={(v) => onChange('color', v)} placeholder="Rosso Corsa" />
        <TextField label="Mileage (optional)" value={vehicle.mileage} onChange={(v) => onChange('mileage', v)} placeholder="4,200" />
        <TextField label="VIN (optional)" value={vehicle.vin} onChange={(v) => onChange('vin', v)} placeholder="ZFF..." />
        <TextField label="License Plate (optional)" value={vehicle.licensePlate} onChange={(v) => onChange('licensePlate', v)} placeholder="8EXO-TIC" />
      </div>

      <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.02] p-4">
        {isUnsupported && (
          <div className="mb-3 flex items-start gap-2 rounded-lg border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-xs text-amber-200">
            <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>
              This nameplate falls outside our current specialization (hypercars, supercars, exotics, and high-end sports
              cars). Confirm with the client, or select a classification manually to proceed anyway.
            </span>
          </div>
        )}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Classification</span>
          {isAutoDetected && <Badge tone="gold">Auto-detected</Badge>}
          {!classification && <Badge tone="neutral">Manual selection required</Badge>}
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
    </GlassPanel>
  )
}
