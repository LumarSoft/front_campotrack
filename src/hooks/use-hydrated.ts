'use client'

import { useSyncExternalStore } from 'react'

const noopSubscribe = (): (() => void) => () => {}

/**
 * Returns false during SSR / first paint and true once mounted on the client.
 * Lets client guards wait for hydration without a setState-in-effect.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  )
}
