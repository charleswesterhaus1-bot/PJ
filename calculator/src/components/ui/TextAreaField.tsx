// Styled textarea for free-form notes.

import type { TextareaHTMLAttributes } from 'react'

interface TextAreaFieldProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  label: string
  value: string
  onChange: (value: string) => void
}

export function TextAreaField({ label, value, onChange, ...rest }: TextAreaFieldProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-400">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="hh-input hh-focus-ring w-full resize-none rounded-lg px-3.5 py-2.5 text-sm text-slate-100 outline-none placeholder:text-slate-500"
        {...rest}
      />
    </label>
  )
}
