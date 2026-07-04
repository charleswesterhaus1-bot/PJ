// Four-state severity control (None / Light / Moderate / Heavy) for a
// single inspection item. Deliberately click-based rather than a slider —
// faster to scan and tap through a long checklist, and works identically
// with mouse, touch, or keyboard.

import { SEVERITY_LABELS, type SeverityLevel } from '../../types'

const LEVELS: SeverityLevel[] = [0, 1, 2, 3]

const LEVEL_COLOR: Record<SeverityLevel, string> = {
  0: 'data-[active=true]:bg-white/[0.06] data-[active=true]:text-slate-500 data-[active=true]:border-white/10',
  1: 'data-[active=true]:bg-amber-400/20 data-[active=true]:text-amber-200 data-[active=true]:border-amber-400/50',
  2: 'data-[active=true]:bg-orange-400/20 data-[active=true]:text-orange-200 data-[active=true]:border-orange-400/50',
  3: 'data-[active=true]:bg-rose-500/20 data-[active=true]:text-rose-200 data-[active=true]:border-rose-500/50',
}

interface SeverityPickerProps {
  label: string
  value: SeverityLevel
  onChange: (value: SeverityLevel) => void
}

export function SeverityPicker({ label, value, onChange }: SeverityPickerProps) {
  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <span className={`text-sm ${value >= 1 ? 'text-slate-100' : 'text-slate-400'}`}>{label}</span>
      <div className="flex shrink-0 gap-1 rounded-full border border-white/10 bg-black/20 p-1">
        {LEVELS.map((level) => (
          <button
            key={level}
            type="button"
            data-active={value === level}
            onClick={() => onChange(level)}
            className={`hh-focus-ring rounded-full border border-transparent px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500 transition-colors hover:text-slate-300 ${LEVEL_COLOR[level]}`}
          >
            {SEVERITY_LABELS[level]}
          </button>
        ))}
      </div>
    </div>
  )
}
