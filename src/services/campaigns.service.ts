import { apiRequest } from '@/lib/api-client'
import type { Campaign, CreateCampaignRequest, UpdateCampaignRequest } from '@/types/api/campaigns'

/** Campaigns domain service. */
export const campaignsService = {
  list(token: string): Promise<Campaign[]> {
    return apiRequest<Campaign[]>('/campaigns', { token })
  },

  create(payload: CreateCampaignRequest, token: string): Promise<Campaign> {
    return apiRequest<Campaign>('/campaigns', { method: 'POST', body: payload, token })
  },

  update(id: number, payload: UpdateCampaignRequest, token: string): Promise<Campaign> {
    return apiRequest<Campaign>(`/campaigns/${id}`, { method: 'PATCH', body: payload, token })
  },

  remove(id: number, token: string): Promise<void> {
    return apiRequest<void>(`/campaigns/${id}`, { method: 'DELETE', token })
  },
}
