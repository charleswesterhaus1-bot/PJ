// Staff-only view of job economics — labor/crew planning plus cost and
// margin. This component is never placed inside the print/PDF-captured
// node; it physically lives outside it, not just visually hidden, so it
// can never leak onto a client-facing estimate.

import { Lock, Wrench, Users, Clock3, DollarSign, TrendingUp } from 'lucide-react'
import { GlassPanel } from '../ui/GlassPanel'
import { formatCurrency, formatHours } from '../../utils/format'
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
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em]">Staff Only — Never Printed</p>
      </div>

      <div className="grid grid-cols-3 gap-2 border-b border-white/5 pb-4 text-center">
        <Stat icon={<Wrench className="h-4 w-4" />} value={formatHours(result.laborHours)} label="Labor" />
        <Stat icon={<Users className="h-4 w-4" />} value={result.teamSizeLabel} label="Team" />
        <Stat icon={<Clock3 className="h-4 w-4" />} value={formatHours(result.appointmentLengthHours)} label="Appointment" />
      </div>

      <div className="space-y-1.5 pt-4">
        <Row label="Labor Cost" value={formatCurrency(result.laborCost)} />
        <Row label="Chemical Cost" value={formatCurrency(result.chemicalCost)} />
        <Row label="Gross Profit" value={formatCurrency(result.grossProfit)} emphasis />
        <div className="flex items-center justify-between pt-1.5">
          <span className="flex items-center gap-1.5 text-sm text-slate-300">
            <TrendingUp className="h-3.5 w-3.5" />
            Margin
          </span>
          <span className={`text-sm font-bold tabular-nums ${marginTone(result.marginPercent)}`}>
            {(result.marginPercent * 100).toFixed(1)}%
          </span>
        </div>
      </div>
    </GlassPanel>
  )
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div>
      <div className="mx-auto mb-1 flex justify-center text-[#C9A227]">{icon}</div>
      <p className="text-sm font-semibold text-slate-100">{value}</p>
      <p className="text-[10px] uppercase tracking-wider text-slate-500">{label}</p>
    </div>
  )
}

function Row({ label, value, emphasis }: { label: string; value: string; emphasis?: boolean }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="flex items-center gap-1.5 text-sm text-slate-300">
        {label === 'Gross Profit' && <DollarSign className="h-3.5 w-3.5" />}
        {label}
      </span>
      <span className={`text-sm tabular-nums ${emphasis ? 'font-bold text-[#E8CF83]' : 'font-semibold text-slate-100'}`}>{value}</span>
    </div>
  )
}
