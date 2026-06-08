'use client'

import { useEvents, useCampaigns } from '@/features/calendar/hooks/use-calendar-queries'
import { useFields } from '@/features/fields/hooks/use-fields-queries'
import {
  buildFieldStates,
  computeKpis,
  splitEvents,
  type DashboardKpis,
  type FieldState,
} from '../lib/derive-dashboard'
import type { CalendarEvent } from '@/types/api/events'

interface DashboardData {
  kpis: DashboardKpis
  overdue: CalendarEvent[]
  upcoming: CalendarEvent[]
  fieldStates: FieldState[]
  isLoading: boolean
  isError: boolean
}

/**
 * Aggregates the dashboard view (info.md §5) from existing server state:
 * events, campaigns and fields. All derivation is done here, not in the JSX.
 */
export function useDashboardData(): DashboardData {
  const eventsQuery = useEvents({})
  const campaignsQuery = useCampaigns()
  const fieldsQuery = useFields()

  const now = new Date()
  const events = eventsQuery.data ?? []
  const campaigns = campaignsQuery.data ?? []
  const fields = fieldsQuery.data ?? []
  const { overdue, upcoming } = splitEvents(events, now)

  return {
    kpis: computeKpis(campaigns, events, now),
    overdue,
    upcoming,
    fieldStates: buildFieldStates(fields, events, now),
    isLoading: eventsQuery.isLoading || campaignsQuery.isLoading || fieldsQuery.isLoading,
    isError: eventsQuery.isError || campaignsQuery.isError || fieldsQuery.isError,
  }
}
