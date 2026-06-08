'use client'

import { create } from 'zustand'

interface RecordComposerState {
  open: boolean
  openComposer: () => void
  closeComposer: () => void
}

/**
 * Shared UI state for the "+ Cargar registro" composer so the global FAB and
 * the bitácora can open the same dialog from anywhere (info.md §4).
 */
export const useRecordComposerStore = create<RecordComposerState>(set => ({
  open: false,
  openComposer: () => set({ open: true }),
  closeComposer: () => set({ open: false }),
}))
