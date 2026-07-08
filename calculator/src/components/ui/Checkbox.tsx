// Custom checkbox styled as a gold-accented luxury toggle chip, used for the
// Premium Enhancements. Shows the price and a short "what's included" caption.

import { Check } from 'lucide-react'
import { motion } from 'framer-motion'

interface CheckboxProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  formattedPrice: string
  includes?: string[]
}

export function Checkbox({ label, checked, onChange, formattedPrice, includes }: CheckboxProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.008 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.15 }}
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`hh-focus-ring group flex w-full items-start justify-between gap-3 rounded-xl border px-4 py-3 text-left transition-all duration-200 ${
        checked
          ? 'border-[#C9A227]/60 bg-[#C9A227]/10 shadow-[0_0_0_1px_rgba(201,162,39,0.25)]'
          : 'border-white/10 bg-white/[0.02] hover:border-[#C9A227]/30 hover:bg-white/[0.04]'
      }`}
    >
      <span className="flex items-start gap-3">
        <span
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
            checked ? 'border-[#C9A227] bg-[#C9A227]' : 'border-slate-500 bg-transparent group-hover:border-[#C9A227]/60'
          }`}
        >
          {checked && <Check className="h-3.5 w-3.5 text-[#0B1B3A]" strokeWidth={3} />}
        </span>
        <span>
          <span className={`text-sm font-medium ${checked ? 'text-slate-50' : 'text-slate-300'}`}>{label}</span>
          {includes && includes.length > 0 && (
            <span className="mt-0.5 block max-w-[26rem] text-xs text-slate-500">{includes.join(' · ')}</span>
          )}
        </span>
      </span>
      <span className={`shrink-0 text-xs font-semibold tabular-nums ${checked ? 'text-[#E8CF83]' : 'text-slate-500'}`}>
        {formattedPrice}
      </span>
    </motion.button>
  )
}
