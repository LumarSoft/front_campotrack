import { dayDiff, eventDateKey, toDateKey } from '@/features/calendar/date-utils'
import type { CalendarEvent, EventType } from '@/types/api/events'
import type { Campaign } from '@/types/api/campaigns'
import type { FieldListItem } from '@/types/api/fields'

/** Days ahead included in the "próximos" panel and the upcoming KPI window. */
export const UPCOMING_PANEL_DAYS = 30
const UPCOMING_KPI_DAYS = 7

export interface DashboardKpis {
  haInProduction: number
  activeCampaigns: number
  overdueCount: number
  upcomingCount: number
}

export interface FieldState {
  id: number
  name: string
  totalHa: number
  campaignCount: number
  activeCampaign: { id: number; cycle: string; cropName: string } | null
  overdueCount: number
  nextEvent: { type: EventType; dateKey: string } | null
}

function isUpcoming(event: CalendarEvent, todayKey: string, windowDays: number): boolean {
  if (event.status !== 'PLANNED' || event.overdue) return false
  const diff = dayDiff(todayKey, eventDateKey(event.plannedDate))
  return diff >= 0 && diff <= windowDays
}

export function computeKpis(campaigns: Campaign[], events: CalendarEvent[], now: Date): DashboardKpis {
  const todayKey = toDateKey(now)
  return {
    haInProduction: campaigns.reduce((sum, campaign) => sum + campaign.ha, 0),
    activeCampaigns: campaigns.length,
    overdueCount: events.filter(event => event.overdue).length,
    upcomingCount: events.filter(event => isUpcoming(event, todayKey, UPCOMING_KPI_DAYS)).length,
  }
}

/** Overdue events (oldest first) and upcoming events within the panel window (soonest first). */
export function splitEvents(
  events: CalendarEvent[],
  now: Date,
): { overdue: CalendarEvent[]; upcoming: CalendarEvent[] } {
  const todayKey = toDateKey(now)
  const byDate = (a: CalendarEvent, b: CalendarEvent): number =>
    eventDateKey(a.plannedDate).localeCompare(eventDateKey(b.plannedDate))

  return {
    overdue: events.filter(event => event.overdue).sort(byDate),
    upcoming: events.filter(event => isUpcoming(event, todayKey, UPCOMING_PANEL_DAYS)).sort(byDate),
  }
}

/**
 * Per-field state for the dashboard: active campaign, overdue count and next
 * planned event. Fields with overdue work or sooner activity surface first.
 */
export function buildFieldStates(fields: FieldListItem[], events: CalendarEvent[], now: Date): FieldState[] {
  const todayKey = toDateKey(now)

  const states = fields.map<FieldState>(field => {
    const fieldEvents = events.filter(event => event.campaign.fieldId === field.id)
    const next = fieldEvents
      .filter(event => isUpcoming(event, todayKey, UPCOMING_PANEL_DAYS))
      .sort((a, b) => eventDateKey(a.plannedDate).localeCompare(eventDateKey(b.plannedDate)))[0]

    return {
      id: field.id,
      name: field.name,
      totalHa: field.totalHa,
      campaignCount: field.campaignCount,
      activeCampaign: field.latestCampaign,
      overdueCount: fieldEvents.filter(event => event.overdue).length,
      nextEvent: next ? { type: next.type, dateKey: eventDateKey(next.plannedDate) } : null,
    }
  })

  return states.sort((a, b) => {
    if (a.overdueCount !== b.overdueCount) return b.overdueCount - a.overdueCount
    if (a.nextEvent && b.nextEvent) return a.nextEvent.dateKey.localeCompare(b.nextEvent.dateKey)
    if (a.nextEvent) return -1
    if (b.nextEvent) return 1
    return b.campaignCount - a.campaignCount
  })
}
