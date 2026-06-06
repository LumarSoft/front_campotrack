import { useEffect, useState } from 'react'

/**
 * Drives the offline → sync animation: advances a step counter on a timer,
 * looping back to the start once every event has synced.
 */
export function useSyncAnimation(totalSteps: number, stepDelays: number[]): number {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const delay = stepDelays[step] ?? 850
    const id = setTimeout(() => setStep(s => (s >= totalSteps ? 0 : s + 1)), delay)
    return () => clearTimeout(id)
  }, [step, totalSteps, stepDelays])

  return step
}
