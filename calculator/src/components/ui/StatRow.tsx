// A single labeled row inside the live estimate summary (label + amount).

interface StatRowProps {
  label: string
  value: string
  muted?: boolean
  emphasis?: boolean
  negative?: boolean
}

export function StatRow({ label, value, muted, emphasis, negative }: StatRowProps) {
  return (
    <div className="flex items-baseline justify-between py-1.5">
      <span className={`text-sm ${muted ? 'text-slate-500' : 'text-slate-300'}`}>{label}</span>
      <span
        className={`text-sm font-semibold tabular-nums ${
          negative ? 'text-emerald-400' : emphasis ? 'text-[#E8CF83]' : 'text-slate-100'
        }`}
      >
        {value}
      </span>
    </div>
  )
}
