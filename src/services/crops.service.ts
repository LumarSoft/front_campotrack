import { apiRequest } from '@/lib/api-client'
import type { Crop, CreateCropRequest, UpdateCropRequest } from '@/types/api/crops'

/** Crop catalog service. */
export const cropsService = {
  list(token: string): Promise<Crop[]> {
    return apiRequest<Crop[]>('/crops', { token })
  },

  create(payload: CreateCropRequest, token: string): Promise<Crop> {
    return apiRequest<Crop>('/crops', { method: 'POST', body: payload, token })
  },

  update(id: number, payload: UpdateCropRequest, token: string): Promise<Crop> {
    return apiRequest<Crop>(`/crops/${id}`, { method: 'PATCH', body: payload, token })
  },

  remove(id: number, token: string): Promise<void> {
    return apiRequest<void>(`/crops/${id}`, { method: 'DELETE', token })
  },
}
