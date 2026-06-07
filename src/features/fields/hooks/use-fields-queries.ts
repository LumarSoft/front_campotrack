'use client'

import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import { fieldsService } from '@/services/fields.service'
import { clientsService } from '@/services/clients.service'
import { cropsService } from '@/services/crops.service'
import { useAuthToken } from '@/features/auth/hooks/use-auth-token'
import { queryKeys } from '@/lib/query-keys'
import type { ApiError } from '@/lib/api-client'
import type { FieldDetail, FieldListItem } from '@/types/api/fields'
import type { Client } from '@/types/api/clients'
import type { Crop } from '@/types/api/crops'

export function useFields(): UseQueryResult<FieldListItem[], ApiError> {
  const token = useAuthToken()
  return useQuery<FieldListItem[], ApiError>({
    queryKey: queryKeys.fields.all,
    queryFn: () => fieldsService.list(token!),
    enabled: !!token,
  })
}

export function useField(id: number): UseQueryResult<FieldDetail, ApiError> {
  const token = useAuthToken()
  return useQuery<FieldDetail, ApiError>({
    queryKey: queryKeys.fields.detail(id),
    queryFn: () => fieldsService.get(id, token!),
    enabled: !!token && Number.isFinite(id),
  })
}

export function useClients(): UseQueryResult<Client[], ApiError> {
  const token = useAuthToken()
  return useQuery<Client[], ApiError>({
    queryKey: queryKeys.clients.all,
    queryFn: () => clientsService.list(token!),
    enabled: !!token,
  })
}

export function useCrops(): UseQueryResult<Crop[], ApiError> {
  const token = useAuthToken()
  return useQuery<Crop[], ApiError>({
    queryKey: queryKeys.crops.all,
    queryFn: () => cropsService.list(token!),
    enabled: !!token,
  })
}
