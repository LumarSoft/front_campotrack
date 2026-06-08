import { dayDiff, eventDateKey, toDateKey } from '@/features/calendar/date-utils'
import { EVENT_TYPE_LABELS } from '@/features/calendar/event-config'
import type { CalendarEvent } from '@/types/api/events'

export type NotificationKind = 'overdue' | 'same_day' | 'day_before' | 'same_week'

/** A notification derived from a calendar event (info.md §16). */
export interface AppNotification {
  /** Stable id `${eventId}:${kind}` so read/dismissed state survives reloads. */
  id: string
  eventId: number
  kind: NotificationKind
  /** Event type label, e.g. "Fitosanitario". */
  title: string
  /** When it fires: "Vencido" | "Hoy" | "Mañana" | "Esta semana". */
  when: string
  /** Field · (subdivision ·) crop. */
  detail: string
  dateKey: string
}

const WHEN_LABEL: Record<NotificationKind, string> = {
  overdue: 'Vencido',
  same_day: 'Hoy',
  day_before: 'Mañana',
  same_week: 'Esta semana',
}

function eventDetail(event: CalendarEvent): string {
  const parts = [event.campaign.fieldName]
  if (event.subdivision) parts.push(event.subdivision.name)
  parts.push(event.campaign.cropName)
  return parts.join(' · ')
}

/** Most urgent alarm firing today for an upcoming event, or null. */
function firingAlarm(event: CalendarEvent, diff: number): NotificationKind | null {
  if (event.alarms.includes('SAME_DAY') && diff === 0) return 'same_day'
  if (event.alarms.includes('DAY_BEFORE') && diff === 1) return 'day_before'
  if (event.alarms.includes('SAME_WEEK') && diff >= 0 && diff <= 7) return 'same_week'
  return null
}

/**
 * Derives the notification list from calendar events: every overdue event plus
 * upcoming PLANNED events whose alarm fires today. One notification per event.
 */
export function deriveNotifications(events: CalendarEvent[], now: Date): AppNotification[] {
  const todayKey = toDateKey(now)
  const notifications: AppNotification[] = []

  for (const event of events) {
    const dateKey = eventDateKey(event.plannedDate)

    if (event.overdue) {
      notifications.push(buildNotification(event, 'overdue', dateKey))
      continue
    }

    if (event.status !== 'PLANNED' || event.alarms.length === 0) continue
    const kind = firingAlarm(event, dayDiff(todayKey, dateKey))
    if (kind) notifications.push(buildNotification(event, kind, dateKey))
  }

  return notifications.sort((a, b) => {
    if (a.kind === 'overdue' && b.kind !== 'overdue') return -1
    if (b.kind === 'overdue' && a.kind !== 'overdue') return 1
    return a.dateKey.localeCompare(b.dateKey)
  })
}

function buildNotification(event: CalendarEvent, kind: NotificationKind, dateKey: string): AppNotification {
  return {
    id: `${event.id}:${kind}`,
    eventId: event.id,
    kind,
    title: EVENT_TYPE_LABELS[event.type],
    when: WHEN_LABEL[kind],
    detail: eventDetail(event),
    dateKey,
  }
}
