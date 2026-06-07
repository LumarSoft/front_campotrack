'use client'

import { useEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { recordsService } from '@/services/records.service'
import { ApiError } from '@/lib/api-client'
import { useAuthToken } from '@/features/auth/hooks/use-auth-token'
import { useOnlineStatus } from '@/hooks/use-online-status'
import { queryKeys } from '@/lib/query-keys'
import { usePendingRecordsStore } from '../store/use-pending-records-store'

/**
 * Background sync engine (info.md §15). When online with a token, flushes the
 * pending queue to the API one by one: removes synced items, marks client
 * (4xx) errors so they don't retry forever, and stops on network errors to
 * retry later. Mounted once in the app shell.
 */
export function useRecordSync(): void {
  const token = useAuthToken()
  const isOnline = useOnlineStatus()
  const queryClient = useQueryClient()
  const pendingCount = usePendingRecordsStore(state => state.items.filter(i => i.status === 'PENDING').length)
  const flushing = useRef(false)

  useEffect(() => {
    if (!token || !isOnline || pendingCount === 0 || flushing.current) return

    const flush = async (): Promise<void> => {
      flushing.current = true
      const store = usePendingRecordsStore.getState()
      store.setSyncing(true)
      try {
        const pending = usePendingRecordsStore.getState().items.filter(i => i.status === 'PENDING')
        for (const item of pending) {
          try {
            await recordsService.create(item.payload, token)
            usePendingRecordsStore.getState().remove(item.clientId)
            void queryClient.invalidateQueries({ queryKey: queryKeys.records.all })
          } catch (error) {
            if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
              usePendingRecordsStore.getState().markError(item.clientId, error.message)
            } else {
              break // network/server error — retry on the next online tick
            }
          }
        }
      } finally {
        usePendingRecordsStore.getState().setSyncing(false)
        flushing.current = false
      }
    }

    void flush()
  }, [token, isOnline, pendingCount, queryClient])
}
