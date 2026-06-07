'use client'

import { useSyncExternalStore } from 'react'

function subscribe(callback: () => void): () => void {
  window.addEventListener('online', callback)
  window.addEventListener('offline', callback)
  return () => {
    window.removeEventListener('online', callback)
    window.removeEventListener('offline', callback)
  }
}

/**
 * Tracks browser connectivity via the platform online/offline events. Used by
 * the topbar indicator (info.md §4); the offline-sync queue arrives later.
 */
export function useOnlineStatus(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => navigator.onLine,
    () => true,
  )
}
