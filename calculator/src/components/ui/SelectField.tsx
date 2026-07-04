// Styled <select> with a floating label and consistent brand chrome.

import { ChevronDown } from 'lucide-react'
import type { SelectHTMLAttributes } from 'react'

interface Option {
  value: string
  label: string
}

interface SelectFieldProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label: string
  options: Option[]
  value: string
  onChange: (value: string) => void
  hint?: string
}

export function SelectField({ label, options, value, onChange, hint, ...rest }: SelectFieldProps) {
  return (
    <label className="block">
      {label && <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-400">{label}</span>}
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="hh-input hh-focus-ring w-full appearance-none rounded-lg px-3.5 py-2.5 pr-9 text-sm text-slate-100 outline-none"
          {...rest}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-[#0B1B3A] text-slate-100">
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#C9A227]/70" />
      </div>
      {hint && <span className="mt-1 block text-xs text-slate-500">{hint}</span>}
    </label>
  )
}
