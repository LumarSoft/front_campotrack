import type { UserRole } from './common'

export type RecordSubtype = 'SOWING' | 'FERTILIZATION' | 'PHYTOSANITARY' | 'OBSERVATION' | 'HARVEST'

export type ObservationKind = 'PEST' | 'DISEASE' | 'WEED' | 'OTHER'

export type YieldUnit = 'QQ_HA' | 'TN_HA'

export interface FieldRecord {
  id: number
  subtype: RecordSubtype
  recordDate: string
  data: Record<string, unknown>
  photos: string[]
  clientUpdatedAt: string | null
  creatorRole: UserRole
  createdAt: string
  field: { id: number; name: string }
  campaign: { id: number; cycle: string; cropName: string } | null
  subdivision: { id: number; name: string } | null
}

export interface CreateRecordRequest {
  subtype: RecordSubtype
  fieldId: number
  campaignId?: number
  subdivisionId?: number
  recordDate: string
  data: Record<string, unknown>
  photos?: string[]
  clientUpdatedAt?: string
}

export interface ListRecordsParams {
  campaignId?: number
  fieldId?: number
  subdivisionId?: number
  subtype?: RecordSubtype
}
