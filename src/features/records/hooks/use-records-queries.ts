'use client'

import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import { recordsService } from '@/services/records.service'
import { useAuthToken } from '@/features/auth/hooks/use-auth-token'
import { queryKeys } from '@/lib/query-keys'
import type { ApiError } from '@/lib/api-client'
import type { FieldRecord, ListRecordsParams } from '@/types/api/records'

export function useRecords(params: ListRecordsParams): UseQueryResult<FieldRecord[], ApiError> {
  const token = useAuthToken()
  return useQuery<FieldRecord[], ApiError>({
    queryKey: [...queryKeys.records.all, params],
    queryFn: () => recordsService.list(params, token!),
    enabled: !!token,
  })
}
