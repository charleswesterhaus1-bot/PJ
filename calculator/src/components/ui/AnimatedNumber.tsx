// Smoothly tweens a numeric value whenever it changes, so the total price
// glides rather than jumps as the form is edited — a small but persuasive
// bit of "premium software" polish.

import { useEffect, useRef, useState } from 'react'
import { animate } from 'framer-motion'

interface AnimatedNumberProps {
  value: number
  format: (value: number) => string
  className?: string
}

export function AnimatedNumber({ value, format, className }: AnimatedNumberProps) {
  const [display, setDisplay] = useState(value)
  const previous = useRef(value)

  useEffect(() => {
    const controls = animate(previous.current, value, {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setDisplay(latest),
    })
    previous.current = value
    return () => controls.stop()
  }, [value])

  return <span className={className}>{format(display)}</span>
}
