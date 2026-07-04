// Step 1 — client identity, with a search-as-you-type lookup against the
// saved client database so returning clients don't get retyped every visit.

import { useState } from 'react'
import { UserRound, Search, History as HistoryIcon, Car } from 'lucide-react'
import { GlassPanel } from '../ui/GlassPanel'
import { SectionHeading } from '../ui/SectionHeading'
import { TextField } from '../ui/TextField'
import { TextAreaField } from '../ui/TextAreaField'
import { Badge } from '../ui/Badge'
import { formatCurrency } from '../../utils/format'
import { formatDateShort } from '../../utils/format'
import type { ClientDraft, ClientRecord, SavedEstimate, VehicleInfo } from '../../types'

interface ClientInfoFormProps {
  client: ClientDraft
  estimateNumber: string
  date: string
  onChange: <K extends keyof ClientDraft>(key: K, value: ClientDraft[K]) => void
  searchQuery: string
  onSearchQueryChange: (query: string) => void
  searchResults: ClientRecord[]
  onSelectClient: (record: ClientRecord) => void
  clientHistory: SavedEstimate[]
  onSelectVehicleFromHistory: (vehicle: VehicleInfo) => void
}

export function ClientInfoForm({
  client,
  estimateNumber,
  date,
  onChange,
  searchQuery,
  onSearchQueryChange,
  searchResults,
  onSelectClient,
  clientHistory,
  onSelectVehicleFromHistory,
}: ClientInfoFormProps) {
  const [searchFocused, setSearchFocused] = useState(false)

  const previousVehicles = Array.from(
    new Map(
      clientHistory.map((e) => [
        `${e.vehicle.year}-${e.vehicle.make}-${e.vehicle.model}`.toLowerCase(),
        e.vehicle,
      ]),
    ).values(),
  )

  return (
    <GlassPanel className="p-6">
      <div className="mb-5 flex items-start justify-between">
        <SectionHeading eyebrow="Step One" title="Client Information" icon={<UserRound className="h-5 w-5" />} />
        <div className="text-right">
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500">Estimate No.</p>
          <p className="font-serif text-lg font-semibold text-[#E8CF83]">{estimateNumber}</p>
          <p className="text-xs text-slate-500">{date}</p>
        </div>
      </div>

      <div className="relative mb-4">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        <input
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => window.setTimeout(() => setSearchFocused(false), 150)}
          placeholder="Search saved clients by name, phone, or email…"
          className="hh-input hh-focus-ring w-full rounded-lg py-2.5 pl-10 pr-3.5 text-sm text-slate-100 outline-none placeholder:text-slate-500"
        />
        {searchFocused && searchResults.length > 0 && (
          <div className="absolute z-20 mt-1.5 w-full overflow-hidden rounded-lg border border-[#C9A227]/25 bg-[#0B1B3A] shadow-2xl">
            {searchResults.slice(0, 6).map((record) => (
              <button
                key={record.id}
                type="button"
                onMouseDown={() => onSelectClient(record)}
                className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm text-slate-200 transition hover:bg-white/5"
              >
                <span className="font-medium">{record.name}</span>
                <span className="text-xs text-slate-500">{record.phone || record.email}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {client.id && (
        <div className="mb-5 flex flex-wrap items-center gap-2 rounded-lg border border-[#C9A227]/20 bg-[#C9A227]/5 px-3.5 py-2.5">
          <Badge tone="gold" icon={<HistoryIcon className="h-3 w-3" />}>
            {clientHistory.length} Previous Estimate{clientHistory.length === 1 ? '' : 's'}
          </Badge>
          {clientHistory[0] && (
            <span className="text-xs text-slate-400">
              Last: {clientHistory[0].estimateNumber} · {formatCurrency(clientHistory[0].result.total)} ·{' '}
              {formatDateShort(clientHistory[0].createdAt)}
            </span>
          )}
          {previousVehicles.length > 0 && (
            <div className="flex w-full flex-wrap gap-1.5 pt-1">
              {previousVehicles.map((v) => (
                <button
                  key={`${v.year}-${v.make}-${v.model}`}
                  type="button"
                  onClick={() => onSelectVehicleFromHistory(v)}
                  className="hh-focus-ring inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-slate-300 transition hover:border-[#C9A227]/40 hover:text-[#E8CF83]"
                >
                  <Car className="h-3 w-3" />
                  {[v.year, v.make, v.model].filter(Boolean).join(' ')}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextField label="Client Name" value={client.name} onChange={(v) => onChange('name', v)} placeholder="Jonathan Reyes" />
        <TextField label="Phone" value={client.phone} onChange={(v) => onChange('phone', v)} placeholder="(555) 010-2938" />
        <TextField label="Email" value={client.email} onChange={(v) => onChange('email', v)} placeholder="jonathan@email.com" />
        <TextField label="Address" value={client.address} onChange={(v) => onChange('address', v)} placeholder="Garage / delivery address" />
      </div>

      <div className="mt-4">
        <TextAreaField label="Notes" value={client.notes} onChange={(v) => onChange('notes', v)} placeholder="Access notes, special requests, preferences." />
      </div>
    </GlassPanel>
  )
}
