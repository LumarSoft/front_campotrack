'use client'

import { useEvents } from '@/features/calendar/hooks/use-calendar-queries'
import { deriveNotifications, type AppNotification } from '../lib/derive-notifications'
import { useNotificationsStore } from '../store/use-notifications-store'
import { useNotificationPrefsStore } from '../store/use-notification-prefs-store'

export interface NotificationItem extends AppNotification {
  read: boolean
}

interface UseNotificationsResult {
  items: NotificationItem[]
  unreadCount: number
  isLoading: boolean
}

/**
 * Notifications shown by the bell: derived from events, filtered by the local
 * dismissed set and tagged with the persisted read state.
 */
export function useNotifications(): UseNotificationsResult {
  const eventsQuery = useEvents({})
  const readIds = useNotificationsStore(state => state.readIds)
  const dismissedIds = useNotificationsStore(state => state.dismissedIds)
  const prefs: Record<AppNotification['kind'], boolean> = {
    overdue: useNotificationPrefsStore(state => state.overdue),
    same_week: useNotificationPrefsStore(state => state.same_week),
    day_before: useNotificationPrefsStore(state => state.day_before),
    same_day: useNotificationPrefsStore(state => state.same_day),
  }

  const items = deriveNotifications(eventsQuery.data ?? [], new Date())
    .filter(notification => prefs[notification.kind])
    .filter(notification => !dismissedIds.includes(notification.id))
    .map(notification => ({ ...notification, read: readIds.includes(notification.id) }))

  return {
    items,
    unreadCount: items.filter(notification => !notification.read).length,
    isLoading: eventsQuery.isLoading,
  }
}
