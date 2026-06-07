'use client'

import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query'
import { toast } from 'sonner'
import { recordsService } from '@/services/records.service'
import { useAuthToken } from '@/features/auth/hooks/use-auth-token'
import { queryKeys } from '@/lib/query-keys'
import type { ApiError } from '@/lib/api-client'

export function useDeleteRecord(): UseMutationResult<void, ApiError, number> {
  const token = useAuthToken()
  const queryClient = useQueryClient()
  return useMutation<void, ApiError, number>({
    mutationFn: id => recordsService.remove(id, token!),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.records.all })
      toast.success('Registro eliminado')
    },
    onError: error => toast.error(error.message),
  })
}
