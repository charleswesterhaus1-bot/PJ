// Client + vehicle identity fields — not used in pricing math, purely for
// the record and the printed/exported estimate.

import { UserRound } from 'lucide-react'
import { GlassPanel } from '../ui/GlassPanel'
import { SectionHeading } from '../ui/SectionHeading'
import { TextField } from '../ui/TextField'
import { TextAreaField } from '../ui/TextAreaField'
import type { ClientInfo } from '../../types'

interface ClientInfoFormProps {
  client: ClientInfo
  estimateNumber: string
  date: string
  onChange: <K extends keyof ClientInfo>(key: K, value: ClientInfo[K]) => void
}

export function ClientInfoForm({ client, estimateNumber, date, onChange }: ClientInfoFormProps) {
  return (
    <GlassPanel className="p-6">
      <div className="mb-5 flex items-start justify-between">
        <SectionHeading eyebrow="Step One" title="Client & Vehicle" icon={<UserRound className="h-5 w-5" />} />
        <div className="text-right">
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500">Estimate No.</p>
          <p className="font-serif text-lg font-semibold text-[#E8CF83]">{estimateNumber}</p>
          <p className="text-xs text-slate-500">{date}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextField label="Client Name" value={client.clientName} onChange={(v) => onChange('clientName', v)} placeholder="Jonathan Reyes" />
        <TextField label="License Plate (optional)" value={client.licensePlate} onChange={(v) => onChange('licensePlate', v)} placeholder="8EXO-TIC" />
        <TextField label="Year" value={client.vehicleYear} onChange={(v) => onChange('vehicleYear', v)} placeholder="2024" />
        <TextField label="Make" value={client.vehicleMake} onChange={(v) => onChange('vehicleMake', v)} placeholder="Ferrari" />
        <TextField label="Model" value={client.vehicleModel} onChange={(v) => onChange('vehicleModel', v)} placeholder="296 GTB" />
        <TextField label="Color" value={client.vehicleColor} onChange={(v) => onChange('vehicleColor', v)} placeholder="Rosso Corsa" />
      </div>

      <div className="mt-4">
        <TextAreaField label="Notes" value={client.notes} onChange={(v) => onChange('notes', v)} placeholder="Access notes, special requests, prior damage, etc." />
      </div>
    </GlassPanel>
  )
}
