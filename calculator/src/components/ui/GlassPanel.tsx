// Base glassmorphism card used everywhere in the calculator.

import type { ReactNode } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'

interface GlassPanelProps extends HTMLMotionProps<'div'> {
  children: ReactNode
  delay?: number
}

export function GlassPanel({ children, className = '', delay = 0, ...rest }: GlassPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className={`hh-glass rounded-2xl ${className}`}
      {...rest}
    >
      {children}
    </motion.div>
  )
}
