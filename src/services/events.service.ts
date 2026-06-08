import { apiRequest } from '@/lib/api-client'
import type {
  CalendarEvent,
  CreateEventRequest,
  ListEventsParams,
  PostponeEventRequest,
  UpdateEventRequest,
} from '@/types/api/events'

function buildQuery(params: ListEventsParams): string {
  const search = new URLSearchParams()
  if (params.from) search.set('from', params.from)
  if (params.to) search.set('to', params.to)
  if (params.fieldId) search.set('fieldId', String(params.fieldId))
  if (params.campaignId) search.set('campaignId', String(params.campaignId))
  if (params.type) search.set('type', params.type)
  const qs = search.toString()
  return qs ? `?${qs}` : ''
}

/** Calendar events domain service. */
export const eventsService = {
  list(params: ListEventsParams, token: string): Promise<CalendarEvent[]> {
    return apiRequest<CalendarEvent[]>(`/events${buildQuery(params)}`, { token })
  },

  create(payload: CreateEventRequest, token: string): Promise<CalendarEvent> {
    return apiRequest<CalendarEvent>('/events', { method: 'POST', body: payload, token })
  },

  update(id: number, payload: UpdateEventRequest, token: string): Promise<CalendarEvent> {
    return apiRequest<CalendarEvent>(`/events/${id}`, { method: 'PATCH', body: payload, token })
  },

  postpone(id: number, payload: PostponeEventRequest, token: string): Promise<CalendarEvent> {
    return apiRequest<CalendarEvent>(`/events/${id}/postpone`, { method: 'POST', body: payload, token })
  },

  remove(id: number, token: string): Promise<void> {
    return apiRequest<void>(`/events/${id}`, { method: 'DELETE', token })
  },
}
