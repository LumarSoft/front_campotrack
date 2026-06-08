'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface NotificationsState {
  /** Notification ids the user has seen. */
  readIds: string[]
  /** Notification ids the user has dismissed from the list. */
  dismissedIds: string[]
  markRead: (id: string) => void
  markAllRead: (ids: string[]) => void
  dismiss: (id: string) => void
}

function addUnique(list: string[], id: string): string[] {
  return list.includes(id) ? list : [...list, id]
}

/**
 * Read/dismissed state for the notification bell (info.md §5 "Qué se guarda").
 * Notifications themselves are derived from events; only this local state is
 * persisted, so it survives reloads and works offline.
 */
export const useNotificationsStore = create<NotificationsState>()(
  persist(
    set => ({
      readIds: [],
      dismissedIds: [],
      markRead: id => set(state => ({ readIds: addUnique(state.readIds, id) })),
      markAllRead: ids => set(state => ({ readIds: Array.from(new Set([...state.readIds, ...ids])) })),
      dismiss: id =>
        set(state => ({
          dismissedIds: addUnique(state.dismissedIds, id),
          readIds: addUnique(state.readIds, id),
        })),
    }),
    {
      name: 'campotrack-notifications',
      partialize: state => ({ readIds: state.readIds, dismissedIds: state.dismissedIds }),
    },
  ),
)
