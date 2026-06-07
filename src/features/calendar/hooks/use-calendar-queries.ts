'use client'

import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import { eventsService } from '@/services/events.service'
import { campaignsService } from '@/services/campaigns.service'
import { useAuthToken } from '@/features/auth/hooks/use-auth-token'
import { queryKeys } from '@/lib/query-keys'
import type { ApiError } from '@/lib/api-client'
import type { CalendarEvent, ListEventsParams } from '@/types/api/events'
import type { Campaign } from '@/types/api/campaigns'

export function useEvents(params: ListEventsParams): UseQueryResult<CalendarEvent[], ApiError> {
  const token = useAuthToken()
  return useQuery<CalendarEvent[], ApiError>({
    queryKey: [...queryKeys.events.all, params],
    queryFn: () => eventsService.list(params, token!),
    enabled: !!token,
  })
}

export function useCampaigns(): UseQueryResult<Campaign[], ApiError> {
  const token = useAuthToken()
  return useQuery<Campaign[], ApiError>({
    queryKey: queryKeys.campaigns.all,
    queryFn: () => campaignsService.list(token!),
    enabled: !!token,
  })
}
