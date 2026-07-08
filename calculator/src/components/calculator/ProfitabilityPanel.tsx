// Staff-only view of job economics. This component is never placed inside
// the print/PDF-captured node; it physically lives outside it, not just
// visually hidden, so it can never leak onto a client-facing estimate.

import { Lock, Wrench, DollarSign, TrendingUp, TriangleAlert, Gauge, Car } from 'lucide-react'
import { GlassPanel } from '../ui/GlassPanel'
import { AnimatedNumber } from '../ui/AnimatedNumber'
import { formatCurrency, formatHours } from '../../utils/format'
import { pricingConfig } from '../../config/pricingConfig'
import type { EstimateResult } from '../../types'

function marginTone(margin: number): string {
  if (margin >= 0.45) return 'text-emerald-400'
  if (margin >= 0.3) return 'text-[#E8CF83]'
  return 'text-rose-400'
}

export function ProfitabilityPanel({ result }: { result: EstimateResult }) {
  return (
    <GlassPanel className="p-5" delay={0.15}>
      <div className="mb-4 flex items-center gap-2 text-slate-400">
        <Lock className="h-3.5 w-3.5" />
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em]">Business Summary — Never Printed</p>
      </div>

      <div className="flex items-center justify-between border-b border-white/5 pb-4 text-sm text-slate-300">
        <span className="flex items-center gap-2">
          <Wrench className="h-3.5 w-3.5 text-[#C9A227]" />
          Estimated Labor Hours
        </span>
        <span className="font-semibold tabular-nums text-slate-100">{formatHours(result.laborHours)}</span>
      </div>

      {/* Costs */}
      <div className="space-y-2 pt-4">
        <Row label="Labor Cost" value={formatCurrency(result.laborCost)} />
        <Row label="Material Cost" value={formatCurrency(result.materialCost)} />
        <Row label="Travel Cost" value={formatCurrency(result.travelCost)} />
      </div>

      {/* Results */}
      <div className="mt-4 space-y-2 border-t border-white/5 pt-4">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm text-slate-300">
            <DollarSign className="h-3.5 w-3.5" />
            Gross Profit
          </span>
          <AnimatedNumber value={result.grossProfit} format={formatCurrency} className="text-sm font-bold tabular-nums text-[#E8CF83]" />
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm text-slate-300">
            <TrendingUp className="h-3.5 w-3.5" />
            Gross Margin
          </span>
          <span className={`text-sm font-bold tabular-nums ${marginTone(result.marginPercent)}`}>
            {(result.marginPercent * 100).toFixed(1)}%
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm text-slate-300">
            <Gauge className="h-3.5 w-3.5" />
            Revenue / Labor Hour
          </span>
          <span className="text-sm font-semibold tabular-nums text-slate-100">{formatCurrency(result.revenuePerLaborHour)}</span>
        </div>
      </div>

      {result.belowMarginWarning && (
        <div className="mt-4 flex items-start gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3.5 py-2.5 text-xs text-rose-200">
          <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>
            Margin Warning — gross margin is below {(pricingConfig.labor.marginWarningThreshold * 100).toFixed(0)}%. Consider
            reducing the discount or reviewing pricing before confirming this job.
          </span>
        </div>
      )}

      <p className="mt-4 flex items-start gap-1.5 text-[10px] text-slate-600">
        <Car className="mt-0.5 h-3 w-3 shrink-0" />
        Travel cost is an internal estimate and is separate from the client-facing travel fee.
      </p>
    </GlassPanel>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-slate-300">{label}</span>
      <span className="text-sm font-semibold tabular-nums text-slate-100">{value}</span>
    </div>
  )
}
