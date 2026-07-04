// Base glassmorphism card used everywhere in the calculator. Every panel
// gets a faint top highlight (the "backlit glass" edge); pass `interactive`
// for cards that respond to hover (history/client rows) rather than static
// form containers.

import type { ReactNode } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'

interface GlassPanelProps extends HTMLMotionProps<'div'> {
  children: ReactNode
  delay?: number
  interactive?: boolean
}

export function GlassPanel({ children, className = '', delay = 0, interactive = false, ...rest }: GlassPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={interactive ? { y: -2 } : undefined}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className={`hh-glass rounded-2xl ${interactive ? 'hh-glass-interactive cursor-default' : ''} ${className}`}
      {...rest}
    >
      {children}
    </motion.div>
  )
}
