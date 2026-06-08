import type { AlarmType, EventStatus, EventType, PostponementCause } from '@/types/api/events'

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  SOWING: 'Siembra',
  FERTILIZATION: 'Fertilización',
  PHYTOSANITARY: 'Fitosanitario',
  HARVEST: 'Cosecha',
  EXPIRATION: 'Vencimiento',
  DEADLINE: 'Límite de tiempo',
  OTHER: 'Otro',
}

/** Color per event type for grid chips and the legend. */
export const EVENT_TYPE_COLOR: Record<EventType, string> = {
  SOWING: '#2a7a4a',
  FERTILIZATION: '#c89040',
  PHYTOSANITARY: '#2f6f8f',
  HARVEST: '#1c4a2e',
  EXPIRATION: '#b3261e',
  DEADLINE: '#7a5cb0',
  OTHER: '#627a6b',
}

export const EVENT_TYPE_ORDER: EventType[] = [
  'SOWING',
  'FERTILIZATION',
  'PHYTOSANITARY',
  'HARVEST',
  'EXPIRATION',
  'DEADLINE',
  'OTHER',
]

export const ALARM_LABELS: Record<AlarmType, string> = {
  SAME_WEEK: 'Misma semana',
  DAY_BEFORE: 'Día anterior',
  SAME_DAY: 'El mismo día',
}

export const ALARM_ORDER: AlarmType[] = ['SAME_WEEK', 'DAY_BEFORE', 'SAME_DAY']

export const STATUS_LABELS: Record<EventStatus, string> = {
  PLANNED: 'Planificado',
  DONE: 'Hecho',
  POSTPONED: 'Aplazado',
}

export const POSTPONEMENT_CAUSE_LABELS: Record<PostponementCause, string> = {
  WEATHER_DROUGHT: 'Clima — sequía',
  WEATHER_FROST: 'Clima — helada',
  WEATHER_HAIL: 'Clima — granizo',
  WEATHER_HEAT: 'Clima — ola de calor',
  SOIL_MOISTURE: 'Humedad del suelo',
  WATER_AVAILABILITY: 'Disponibilidad de agua',
  FLOOD_RISK: 'Riesgo de inundación',
  FIRE_RISK: 'Riesgo de incendio',
  OWN_DECISION: 'Decisión propia',
  SUPPLIER: 'Proveedor',
  OTHER: 'Otro',
}

export const POSTPONEMENT_CAUSE_ORDER: PostponementCause[] = [
  'WEATHER_DROUGHT',
  'WEATHER_FROST',
  'WEATHER_HAIL',
  'WEATHER_HEAT',
  'SOIL_MOISTURE',
  'WATER_AVAILABILITY',
  'FLOOD_RISK',
  'FIRE_RISK',
  'OWN_DECISION',
  'SUPPLIER',
  'OTHER',
]
