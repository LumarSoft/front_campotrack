'use client'

import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

interface RevealProps {
  children: ReactNode
  /** Delay in seconds for staggering siblings */
  delay?: number
  /** Vertical travel distance in px */
  y?: number
  className?: string
  as?: 'div' | 'li' | 'span' | 'section'
}

/**
 * Fade + translate-y on scroll into view. Subtle, single shot.
 * Honors prefers-reduced-motion by skipping the transform entirely.
 */
export function Reveal({ children, delay = 0, y = 24, className, as = 'div' }: RevealProps): React.JSX.Element {
  const reduceMotion = useReducedMotion()
  const MotionTag = motion[as]

  return (
    <MotionTag
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </MotionTag>
  )
}
