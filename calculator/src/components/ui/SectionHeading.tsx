// Small-caps gold eyebrow + serif title, used to open each form section.

interface SectionHeadingProps {
  eyebrow: string
  title: string
  icon?: React.ReactNode
}

export function SectionHeading({ eyebrow, title, icon }: SectionHeadingProps) {
  return (
    <div className="mb-5 flex items-center gap-3">
      {icon && <span className="text-[#C9A227]">{icon}</span>}
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C9A227]/80">{eyebrow}</p>
        <h2 className="font-serif text-2xl font-semibold tracking-wide text-slate-50">{title}</h2>
      </div>
    </div>
  )
}
