'use client'

import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query'
import { toast } from 'sonner'
import { clientsService } from '@/services/clients.service'
import { useAuthToken } from '@/features/auth/hooks/use-auth-token'
import { queryKeys } from '@/lib/query-keys'
import type { ApiError } from '@/lib/api-client'
import type { Client, CreateClientRequest } from '@/types/api/clients'

function useClientCacheSync(): () => void {
  const queryClient = useQueryClient()
  return () => {
    void queryClient.invalidateQueries({ queryKey: queryKeys.clients.all })
    void queryClient.invalidateQueries({ queryKey: queryKeys.fields.all })
  }
}

export function useCreateClient(): UseMutationResult<Client, ApiError, CreateClientRequest> {
  const token = useAuthToken()
  const syncCache = useClientCacheSync()
  return useMutation<Client, ApiError, CreateClientRequest>({
    mutationFn: payload => clientsService.create(payload, token!),
    onSuccess: () => {
      syncCache()
      toast.success('Cliente creado')
    },
    onError: error => toast.error(error.message),
  })
}

export function useDeleteClient(): UseMutationResult<void, ApiError, number> {
  const token = useAuthToken()
  const syncCache = useClientCacheSync()
  return useMutation<void, ApiError, number>({
    mutationFn: id => clientsService.remove(id, token!),
    onSuccess: () => {
      syncCache()
      toast.success('Cliente eliminado')
    },
    onError: error => toast.error(error.message),
  })
}
