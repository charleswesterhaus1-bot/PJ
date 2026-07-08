// A single saved estimate summarized as a compact card in the history list.

import { Trash2, Clipboard, Image as ImageIcon } from 'lucide-react'
import { GlassPanel } from '../ui/GlassPanel'
import { formatCurrency, formatDateShort } from '../../utils/format'
import { buildEstimateText } from '../../utils/estimateText'
import { copyToClipboard } from '../../utils/clipboard'
import { useToast } from '../../hooks/useToast'
import type { EstimateStatus, SavedEstimate } from '../../types'
import { pricingConfig } from '../../config/pricingConfig'

interface EstimateCardProps {
  estimate: SavedEstimate
  onDelete: (id: string) => void
  onToggleStatus: (id: string, status: EstimateStatus) => void
}

export function EstimateCard({ estimate, onDelete, onToggleStatus }: EstimateCardProps) {
  const { showToast } = useToast()
  const { client, vehicle, result, selections, photos } = estimate
  const vehicleLine = [vehicle.year, vehicle.make, vehicle.model].filter(Boolean).join(' ')
  const vehicleType = pricingConfig.vehicleTypes.find((t) => t.id === selections.vehicleTypeId)?.label
  const serviceLabel = pricingConfig.services.find((s) => s.id === selections.serviceId)?.label
  const status: EstimateStatus = estimate.status ?? 'pending'

  async function handleCopy() {
    const text = buildEstimateText(estimate.estimateNumber, estimate.createdAt, client, vehicle, selections, result)
    const ok = await copyToClipboard(text)
    showToast(ok ? 'Estimate copied to clipboard' : 'Could not copy estimate', ok ? 'success' : 'error')
  }

  return (
    <GlassPanel interactive className="flex items-center justify-between gap-4 p-5">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-serif text-lg font-semibold text-[#E8CF83]">{estimate.estimateNumber}</p>
          <span className="text-xs text-slate-500">{formatDateShort(estimate.createdAt)}</span>
          {photos.length > 0 && (
            <span className="flex items-center gap-1 text-xs text-slate-500">
              <ImageIcon className="h-3 w-3" />
              {photos.length}
            </span>
          )}
        </div>
        <p className="truncate text-sm font-medium text-slate-100">{client.name || 'Unnamed client'}</p>
        <p className="truncate text-xs text-slate-400">
          {vehicleLine || 'No vehicle specified'}
          {vehicleType ? ` · ${vehicleType}` : ''}
        </p>
        {serviceLabel && <p className="truncate text-xs text-slate-500">{serviceLabel}</p>}
      </div>
      <div className="flex shrink-0 flex-col items-end gap-2">
        <div className="flex items-center gap-3">
          <p className="font-serif text-xl font-bold text-slate-50">{formatCurrency(result.total)}</p>
          <button
            onClick={handleCopy}
            className="hh-focus-ring rounded-full p-2 text-slate-400 transition hover:bg-white/5 hover:text-[#E8CF83]"
            aria-label="Copy estimate"
          >
            <Clipboard className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(estimate.id)}
            className="hh-focus-ring rounded-full p-2 text-slate-400 transition hover:bg-rose-500/10 hover:text-rose-400"
            aria-label="Delete estimate"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
        <button
          onClick={() => onToggleStatus(estimate.id, status === 'completed' ? 'pending' : 'completed')}
          className={`hh-focus-ring rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider transition ${
            status === 'completed'
              ? 'bg-emerald-400/10 text-emerald-300 hover:bg-emerald-400/20'
              : 'bg-amber-400/10 text-amber-300 hover:bg-amber-400/20'
          }`}
        >
          {status === 'completed' ? 'Completed' : 'Pending'}
        </button>
      </div>
    </GlassPanel>
  )
}
