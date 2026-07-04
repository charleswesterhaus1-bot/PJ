// A single saved estimate summarized as a compact card in the history list.

import { Trash2, Clipboard, Image as ImageIcon } from 'lucide-react'
import { GlassPanel } from '../ui/GlassPanel'
import { formatCurrency, formatDateShort } from '../../utils/format'
import { buildEstimateText } from '../../utils/estimateText'
import { copyToClipboard } from '../../utils/clipboard'
import { useToast } from '../../hooks/useToast'
import type { SavedEstimate } from '../../types'
import { pricingConfig } from '../../config/pricingConfig'

interface EstimateCardProps {
  estimate: SavedEstimate
  onDelete: (id: string) => void
}

export function EstimateCard({ estimate, onDelete }: EstimateCardProps) {
  const { showToast } = useToast()
  const { client, vehicle, result, selections, photos } = estimate
  const vehicleLine = [vehicle.year, vehicle.make, vehicle.model].filter(Boolean).join(' ')
  const vehicleType = pricingConfig.vehicleTypes.find((t) => t.id === selections.vehicleTypeId)?.label

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
      </div>
      <div className="flex shrink-0 items-center gap-4">
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
    </GlassPanel>
  )
}
