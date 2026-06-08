import type { UserRole } from './common'

export type EventType = 'SOWING' | 'FERTILIZATION' | 'PHYTOSANITARY' | 'HARVEST' | 'EXPIRATION' | 'DEADLINE' | 'OTHER'

export type EventStatus = 'PLANNED' | 'DONE' | 'POSTPONED'

export type AlarmType = 'SAME_WEEK' | 'DAY_BEFORE' | 'SAME_DAY'

export type PostponementCause =
  | 'WEATHER_DROUGHT'
  | 'WEATHER_FROST'
  | 'WEATHER_HAIL'
  | 'WEATHER_HEAT'
  | 'SOIL_MOISTURE'
  | 'WATER_AVAILABILITY'
  | 'FLOOD_RISK'
  | 'FIRE_RISK'
  | 'OWN_DECISION'
  | 'SUPPLIER'
  | 'OTHER'

export interface CalendarEvent {
  id: number
  type: EventType
  plannedDate: string
  actualDate: string | null
  status: EventStatus
  /** Derived server-side: a PLANNED event already past its date. */
  overdue: boolean
  suggestedBySystem: boolean
  note: string | null
  creatorRole: UserRole
  campaign: { id: number; cycle: string; cropName: string; fieldId: number | null; fieldName: string }
  subdivision: { id: number; name: string } | null
  alarms: AlarmType[]
}

export interface CreateEventRequest {
  campaignId: number
  subdivisionId?: number
  type: EventType
  plannedDate: string
  note?: string
  alarms?: AlarmType[]
  suggestedBySystem?: boolean
}

export interface UpdateEventRequest {
  type?: EventType
  plannedDate?: string
  status?: EventStatus
  actualDate?: string
  note?: string
  alarms?: AlarmType[]
}

export interface PostponeEventRequest {
  newDate: string
  cause: PostponementCause
  note?: string
}

export interface ListEventsParams {
  from?: string
  to?: string
  fieldId?: number
  campaignId?: number
  type?: EventType
}
