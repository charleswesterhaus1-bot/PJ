// Small pill label — used for "Recommended", vehicle classification tier,
// and similar inline tags throughout the calculator.

import type { ReactNode } from 'react'

type Tone = 'gold' | 'neutral' | 'amber' | 'rose'

const TONE_CLASSES: Record<Tone, string> = {
  gold: 'border-[#C9A227]/50 bg-[#C9A227]/10 text-[#E8CF83]',
  neutral: 'border-white/15 bg-white/5 text-slate-300',
  amber: 'border-amber-400/40 bg-amber-400/10 text-amber-300',
  rose: 'border-rose-400/40 bg-rose-400/10 text-rose-300',
}

export function Badge({ children, tone = 'neutral', icon }: { children: ReactNode; tone?: Tone; icon?: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${TONE_CLASSES[tone]}`}
    >
      {icon}
      {children}
    </span>
  )
}
