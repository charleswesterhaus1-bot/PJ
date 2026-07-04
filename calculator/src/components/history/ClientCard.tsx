// A saved client record in the Clients tab, with a quick jump back into
// the calculator to start a new estimate for them.

import { Trash2, ArrowRight, Mail, Phone } from 'lucide-react'
import { GlassPanel } from '../ui/GlassPanel'
import { Badge } from '../ui/Badge'
import { formatDateShort } from '../../utils/format'
import type { ClientRecord, SavedEstimate } from '../../types'

interface ClientCardProps {
  client: ClientRecord
  estimateCount: number
  lastEstimate?: SavedEstimate
  onDelete: (id: string) => void
  onStartEstimate: (client: ClientRecord) => void
}

export function ClientCard({ client, estimateCount, lastEstimate, onDelete, onStartEstimate }: ClientCardProps) {
  return (
    <GlassPanel interactive className="flex items-center justify-between gap-4 p-5">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-semibold text-slate-100">{client.name}</p>
          <Badge tone="neutral">
            {estimateCount} estimate{estimateCount === 1 ? '' : 's'}
          </Badge>
        </div>
        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-slate-400">
          {client.phone && (
            <span className="flex items-center gap-1">
              <Phone className="h-3 w-3" />
              {client.phone}
            </span>
          )}
          {client.email && (
            <span className="flex items-center gap-1">
              <Mail className="h-3 w-3" />
              {client.email}
            </span>
          )}
        </div>
        {lastEstimate && (
          <p className="mt-1 text-xs text-slate-500">
            Last: {lastEstimate.estimateNumber} · {formatDateShort(lastEstimate.createdAt)}
          </p>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <button
          onClick={() => onStartEstimate(client)}
          className="hh-focus-ring flex items-center gap-1.5 rounded-full border border-[#C9A227]/40 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-[#E8CF83] transition hover:border-[#C9A227]/70 hover:bg-white/10"
        >
          New Estimate
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => onDelete(client.id)}
          className="hh-focus-ring rounded-full p-2 text-slate-400 transition hover:bg-rose-500/10 hover:text-rose-400"
          aria-label="Delete client"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </GlassPanel>
  )
}
