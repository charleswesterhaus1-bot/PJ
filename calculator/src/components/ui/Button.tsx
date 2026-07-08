// Primary/secondary/ghost button variants sharing the brand's gold-on-navy
// language, with a subtle press animation.

import type { ReactNode } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'

type Variant = 'primary' | 'secondary' | 'ghost'

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: Variant
  icon?: ReactNode
  children: ReactNode
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    'bg-gradient-to-b from-[#E8CF83] via-[#C9A227] to-[#A3801C] text-[#0B1B3A] shadow-[0_8px_24px_-8px_rgba(201,162,39,0.6)] hover:brightness-110',
  secondary:
    'border border-[#C9A227]/40 bg-white/5 text-[#E8CF83] hover:border-[#C9A227]/70 hover:bg-white/10',
  ghost: 'text-slate-300 hover:text-white hover:bg-white/5',
}

export function Button({ variant = 'primary', icon, children, className = '', ...rest }: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.97, y: 0 }}
      whileHover={{ scale: 1.015, y: -1 }}
      transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
      className={`hh-focus-ring inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold tracking-wide transition-colors duration-200 disabled:pointer-events-none disabled:opacity-40 ${VARIANT_CLASSES[variant]} ${className}`}
      {...rest}
    >
      {icon}
      {children}
    </motion.button>
  )
}
