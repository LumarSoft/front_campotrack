'use client'

import { useRecordSync } from '@/features/records/hooks/use-record-sync'

/** Mounts the offline sync engine once in the app shell. Renders nothing. */
export function RecordSyncEngine(): null {
  useRecordSync()
  return null
}
