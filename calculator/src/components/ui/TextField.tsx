// Styled text input with label, used across the client info form.

import type { InputHTMLAttributes } from 'react'

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: string
  value: string
  onChange: (value: string) => void
}

export function TextField({ label, value, onChange, ...rest }: TextFieldProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-400">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="hh-input hh-focus-ring w-full rounded-lg px-3.5 py-2.5 text-sm text-slate-100 outline-none placeholder:text-slate-500"
        {...rest}
      />
    </label>
  )
}
