'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CreateRecordRequest, RecordSubtype } from '@/types/api/records'

/** A record created on the client, waiting to be synced to the server. */
export interface PendingRecord {
  clientId: string
  payload: CreateRecordRequest
  /** Denormalized fields so the bitácora can render without the server. */
  display: { subtype: RecordSubtype; recordDate: string; fieldLabel: string; summary: string }
  status: 'PENDING' | 'ERROR'
  error?: string
  createdAt: string
}

interface PendingRecordsState {
  items: PendingRecord[]
  /** Transient (not persisted) — true while the sync engine is flushing. */
  isSyncing: boolean
  enqueue: (item: PendingRecord) => void
  remove: (clientId: string) => void
  markError: (clientId: string, error: string) => void
  retry: (clientId: string) => void
  setSyncing: (value: boolean) => void
}

/**
 * Offline-first queue (info.md §8, §15): record creations are saved here and
 * flushed to the API when back online. Persisted so the queue survives reloads.
 */
export const usePendingRecordsStore = create<PendingRecordsState>()(
  persist(
    set => ({
      items: [],
      isSyncing: false,
      enqueue: item => set(state => ({ items: [item, ...state.items] })),
      remove: clientId => set(state => ({ items: state.items.filter(i => i.clientId !== clientId) })),
      markError: (clientId, error) =>
        set(state => ({
          items: state.items.map(i => (i.clientId === clientId ? { ...i, status: 'ERROR', error } : i)),
        })),
      retry: clientId =>
        set(state => ({
          items: state.items.map(i =>
            i.clientId === clientId ? { ...i, status: 'PENDING', error: undefined } : i,
          ),
        })),
      setSyncing: value => set({ isSyncing: value }),
    }),
    {
      name: 'campotrack-pending-records',
      partialize: state => ({ items: state.items }),
    },
  ),
)
