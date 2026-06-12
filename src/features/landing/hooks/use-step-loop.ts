import { useEffect, useState } from 'react'
import { useReducedMotion } from 'motion/react'

const DEFAULT_DELAY = 850

/**
 * Cycles a step counter from 0 to maxStep on a timer, wrapping back to 0.
 * Accepts a uniform delay or a per-step array of delays in milliseconds.
 * Stays frozen at step 0 when the user prefers reduced motion.
 */
export function useStepLoop(maxStep: number, delays: number | readonly number[]): number {
  const reduceMotion = useReducedMotion()
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (reduceMotion) return
    const delay = typeof delays === 'number' ? delays : (delays[step] ?? DEFAULT_DELAY)
    const id = setTimeout(() => setStep(s => (s >= maxStep ? 0 : s + 1)), delay)
    return () => clearTimeout(id)
  }, [step, maxStep, delays, reduceMotion])

  return step
}
