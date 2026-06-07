'use client'

import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query'
import { toast } from 'sonner'
import { campaignsService } from '@/services/campaigns.service'
import { useAuthToken } from '@/features/auth/hooks/use-auth-token'
import { queryKeys } from '@/lib/query-keys'
import type { ApiError } from '@/lib/api-client'
import type { Campaign, CreateCampaignRequest } from '@/types/api/campaigns'

/** Campaigns are embedded in the field detail, so both caches are refreshed. */
function useCampaignCacheSync(fieldId: number): () => void {
  const queryClient = useQueryClient()
  return () => {
    void queryClient.invalidateQueries({ queryKey: queryKeys.fields.detail(fieldId) })
    void queryClient.invalidateQueries({ queryKey: queryKeys.fields.all })
  }
}

export function useCreateCampaign(fieldId: number): UseMutationResult<Campaign, ApiError, CreateCampaignRequest> {
  const token = useAuthToken()
  const syncCache = useCampaignCacheSync(fieldId)
  return useMutation<Campaign, ApiError, CreateCampaignRequest>({
    mutationFn: payload => campaignsService.create(payload, token!),
    onSuccess: () => {
      syncCache()
      toast.success('Campaña creada')
    },
    onError: error => toast.error(error.message),
  })
}

export function useDeleteCampaign(fieldId: number): UseMutationResult<void, ApiError, number> {
  const token = useAuthToken()
  const syncCache = useCampaignCacheSync(fieldId)
  return useMutation<void, ApiError, number>({
    mutationFn: id => campaignsService.remove(id, token!),
    onSuccess: () => {
      syncCache()
      toast.success('Campaña eliminada')
    },
    onError: error => toast.error(error.message),
  })
}
