'use client'

import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query'
import { toast } from 'sonner'
import { providersService } from '@/services/providers.service'
import { useAuthToken } from '@/features/auth/hooks/use-auth-token'
import { queryKeys } from '@/lib/query-keys'
import type { ApiError } from '@/lib/api-client'
import type { CreateProviderRequest, Provider } from '@/types/api/providers'

export function useCreateProvider(): UseMutationResult<Provider, ApiError, CreateProviderRequest> {
  const token = useAuthToken()
  const queryClient = useQueryClient()
  return useMutation<Provider, ApiError, CreateProviderRequest>({
    mutationFn: payload => providersService.create(payload, token!),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.providers.all })
      toast.success('Proveedor agregado')
    },
    onError: error => toast.error(error.message),
  })
}

export function useDeleteProvider(): UseMutationResult<void, ApiError, number> {
  const token = useAuthToken()
  const queryClient = useQueryClient()
  return useMutation<void, ApiError, number>({
    mutationFn: id => providersService.remove(id, token!),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.providers.all })
      toast.success('Proveedor eliminado')
    },
    onError: error => toast.error(error.message),
  })
}
