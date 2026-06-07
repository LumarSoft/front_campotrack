import { apiRequest } from '@/lib/api-client'
import type {
  CreateFieldRequest,
  CreateLocationRequest,
  CreateSubdivisionRequest,
  FieldDetail,
  FieldListItem,
  UpdateFieldRequest,
  UpdateSubdivisionRequest,
} from '@/types/api/fields'

/**
 * Fields domain service: the field aggregate (field + clients + locations +
 * subdivisions). Mutations return the refreshed field detail.
 */
export const fieldsService = {
  list(token: string): Promise<FieldListItem[]> {
    return apiRequest<FieldListItem[]>('/fields', { token })
  },

  get(id: number, token: string): Promise<FieldDetail> {
    return apiRequest<FieldDetail>(`/fields/${id}`, { token })
  },

  create(payload: CreateFieldRequest, token: string): Promise<FieldDetail> {
    return apiRequest<FieldDetail>('/fields', { method: 'POST', body: payload, token })
  },

  update(id: number, payload: UpdateFieldRequest, token: string): Promise<FieldDetail> {
    return apiRequest<FieldDetail>(`/fields/${id}`, { method: 'PATCH', body: payload, token })
  },

  remove(id: number, token: string): Promise<void> {
    return apiRequest<void>(`/fields/${id}`, { method: 'DELETE', token })
  },

  addLocation(fieldId: number, payload: CreateLocationRequest, token: string): Promise<FieldDetail> {
    return apiRequest<FieldDetail>(`/fields/${fieldId}/locations`, { method: 'POST', body: payload, token })
  },

  removeLocation(fieldId: number, locationId: number, token: string): Promise<FieldDetail> {
    return apiRequest<FieldDetail>(`/fields/${fieldId}/locations/${locationId}`, { method: 'DELETE', token })
  },

  addSubdivision(fieldId: number, payload: CreateSubdivisionRequest, token: string): Promise<FieldDetail> {
    return apiRequest<FieldDetail>(`/fields/${fieldId}/subdivisions`, { method: 'POST', body: payload, token })
  },

  updateSubdivision(
    fieldId: number,
    subdivisionId: number,
    payload: UpdateSubdivisionRequest,
    token: string,
  ): Promise<FieldDetail> {
    return apiRequest<FieldDetail>(`/fields/${fieldId}/subdivisions/${subdivisionId}`, {
      method: 'PATCH',
      body: payload,
      token,
    })
  },

  removeSubdivision(fieldId: number, subdivisionId: number, token: string): Promise<FieldDetail> {
    return apiRequest<FieldDetail>(`/fields/${fieldId}/subdivisions/${subdivisionId}`, { method: 'DELETE', token })
  },
}
