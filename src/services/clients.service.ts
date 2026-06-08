import { apiRequest } from '@/lib/api-client'
import type { Client, CreateClientRequest, UpdateClientRequest } from '@/types/api/clients'

/** Clients domain service. */
export const clientsService = {
  list(token: string): Promise<Client[]> {
    return apiRequest<Client[]>('/clients', { token })
  },

  create(payload: CreateClientRequest, token: string): Promise<Client> {
    return apiRequest<Client>('/clients', { method: 'POST', body: payload, token })
  },

  update(id: number, payload: UpdateClientRequest, token: string): Promise<Client> {
    return apiRequest<Client>(`/clients/${id}`, { method: 'PATCH', body: payload, token })
  },

  remove(id: number, token: string): Promise<void> {
    return apiRequest<void>(`/clients/${id}`, { method: 'DELETE', token })
  },
}
