// Top bar: brand mark, internal-tool label, and page nav. Nav items are
// data-driven — adding a future module (Yachts, Scheduling, CRM, …) once
// its feature flag flips on on is just another entry in NAV_ITEMS plus a
// case in App.tsx's page switch, not a structural change here.

import { Calculator, History } from 'lucide-react'
import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { pricingConfig } from '../../config/pricingConfig'

export type Page = 'calculator' | 'history'

const NAV_ITEMS: { id: Page; label: string; icon: ReactNode }[] = [
  { id: 'calculator', label: 'Calculator', icon: <Calculator className="h-4 w-4" /> },
  { id: 'history', label: 'Estimates', icon: <History className="h-4 w-4" /> },
]

interface HeaderProps {
  page: Page
  onNavigate: (page: Page) => void
}

export function Header({ page, onNavigate }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-[#060F1E]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-3 px-4 py-3 sm:justify-between sm:px-6 sm:py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#C9A227]/50 bg-gradient-to-br from-[#112349] to-[#060F1E] sm:h-10 sm:w-10">
            <span className="font-serif text-sm font-semibold text-[#E8CF83] sm:text-base">H&amp;H</span>
          </div>
          <div className="whitespace-nowrap leading-tight">
            <p className="font-serif text-base font-semibold tracking-wide text-slate-50 sm:text-lg">{pricingConfig.company.name}</p>
            <p className="hidden text-[10px] font-medium uppercase tracking-[0.25em] text-slate-500 sm:block">Internal Estimate Console</p>
          </div>
        </div>

        <nav className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1">
          {NAV_ITEMS.map((item) => (
            <NavButton key={item.id} active={page === item.id} onClick={() => onNavigate(item.id)} icon={item.icon}>
              {item.label}
            </NavButton>
          ))}
        </nav>
      </div>
    </header>
  )
}

function NavButton({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean
  onClick: () => void
  icon: ReactNode
  children: ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`hh-focus-ring relative flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
        active ? 'text-[#0B1B3A]' : 'text-slate-300 hover:text-white'
      }`}
    >
      {active && (
        <motion.span
          layoutId="nav-pill"
          className="absolute inset-0 rounded-full bg-gradient-to-b from-[#E8CF83] to-[#C9A227]"
          transition={{ type: 'spring', stiffness: 400, damping: 32 }}
        />
      )}
      <span className="relative z-10 flex items-center gap-1.5">
        {icon}
        {children}
      </span>
    </button>
  )
}
