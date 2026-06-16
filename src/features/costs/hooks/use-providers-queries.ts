'use client'

import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import { providersService } from '@/services/providers.service'
import { useAuthToken } from '@/features/auth/hooks/use-auth-token'
import { queryKeys } from '@/lib/query-keys'
import type { ApiError } from '@/lib/api-client'
import type { Provider } from '@/types/api/providers'

export function useProviders(): UseQueryResult<Provider[], ApiError> {
  const token = useAuthToken()
  return useQuery<Provider[], ApiError>({
    queryKey: queryKeys.providers.all,
    queryFn: () => providersService.list(token!),
    enabled: !!token,
  })
}
