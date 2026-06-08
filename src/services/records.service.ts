import { apiRequest } from '@/lib/api-client'
import type { CreateRecordRequest, FieldRecord, ListRecordsParams } from '@/types/api/records'

function buildQuery(params: ListRecordsParams): string {
  const search = new URLSearchParams()
  if (params.campaignId) search.set('campaignId', String(params.campaignId))
  if (params.fieldId) search.set('fieldId', String(params.fieldId))
  if (params.subdivisionId) search.set('subdivisionId', String(params.subdivisionId))
  if (params.subtype) search.set('subtype', params.subtype)
  const qs = search.toString()
  return qs ? `?${qs}` : ''
}

/** Field records domain service. */
export const recordsService = {
  list(params: ListRecordsParams, token: string): Promise<FieldRecord[]> {
    return apiRequest<FieldRecord[]>(`/records${buildQuery(params)}`, { token })
  },

  create(payload: CreateRecordRequest, token: string): Promise<FieldRecord> {
    return apiRequest<FieldRecord>('/records', { method: 'POST', body: payload, token })
  },

  remove(id: number, token: string): Promise<void> {
    return apiRequest<void>(`/records/${id}`, { method: 'DELETE', token })
  },
}
