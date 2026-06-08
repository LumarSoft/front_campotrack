'use client'

import { CloudOff, Loader2, TriangleAlert } from 'lucide-react'
import { usePendingRecordsStore } from '@/features/records/store/use-pending-records-store'

/** Topbar indicator for the offline queue: syncing spinner / pending / errors. */
export function SyncStatus(): React.JSX.Element | null {
  const pending = usePendingRecordsStore(state => state.items.filter(i => i.status === 'PENDING').length)
  const errors = usePendingRecordsStore(state => state.items.filter(i => i.status === 'ERROR').length)
  const isSyncing = usePendingRecordsStore(state => state.isSyncing)

  if (isSyncing) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-clay/25 bg-clay/10 px-3 py-1 text-xs font-medium text-field">
        <Loader2 className="size-3.5 animate-spin" />
        <span className="hidden sm:inline">Sincronizando</span>
      </span>
    )
  }

  if (errors > 0) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-destructive/30 bg-destructive/10 px-3 py-1 text-xs font-medium text-destructive">
        <TriangleAlert className="size-3.5" />
        {errors}
      </span>
    )
  }

  if (pending > 0) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-wheat/40 bg-wheat/15 px-3 py-1 text-xs font-medium text-[#8a5a1a]">
        <CloudOff className="size-3.5" />
        {pending} pendiente{pending > 1 ? 's' : ''}
      </span>
    )
  }

  return null
}
