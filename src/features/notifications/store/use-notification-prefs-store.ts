'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { NotificationKind } from '../lib/derive-notifications'

/** Which derived notifications the bell surfaces (info.md §13, §16). */
export interface NotificationPrefs {
  overdue: boolean
  same_week: boolean
  day_before: boolean
  same_day: boolean
}

interface NotificationPrefsState extends NotificationPrefs {
  toggle: (key: NotificationKind) => void
}

/** Local notification preferences. Email channel is deferred (info.md §16). */
export const useNotificationPrefsStore = create<NotificationPrefsState>()(
  persist(
    set => ({
      overdue: true,
      same_week: true,
      day_before: true,
      same_day: true,
      toggle: key => set(state => ({ [key]: !state[key] }) as Pick<NotificationPrefs, NotificationKind>),
    }),
    {
      name: 'campotrack-notification-prefs',
      partialize: state => ({
        overdue: state.overdue,
        same_week: state.same_week,
        day_before: state.day_before,
        same_day: state.same_day,
      }),
    },
  ),
)
