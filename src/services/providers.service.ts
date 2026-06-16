import { apiRequest } from '@/lib/api-client'
import type { CreateProviderRequest, Provider, UpdateProviderRequest } from '@/types/api/providers'

/** Providers (suppliers) domain service. */
export const providersService = {
  list(token: string): Promise<Provider[]> {
    return apiRequest<Provider[]>('/providers', { token })
  },

  create(payload: CreateProviderRequest, token: string): Promise<Provider> {
    return apiRequest<Provider>('/providers', { method: 'POST', body: payload, token })
  },

  update(id: number, payload: UpdateProviderRequest, token: string): Promise<Provider> {
    return apiRequest<Provider>(`/providers/${id}`, { method: 'PATCH', body: payload, token })
  },

  remove(id: number, token: string): Promise<void> {
    return apiRequest<void>(`/providers/${id}`, { method: 'DELETE', token })
  },
}
