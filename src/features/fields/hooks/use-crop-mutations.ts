'use client'

import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query'
import { toast } from 'sonner'
import { cropsService } from '@/services/crops.service'
import { useAuthToken } from '@/features/auth/hooks/use-auth-token'
import { queryKeys } from '@/lib/query-keys'
import type { ApiError } from '@/lib/api-client'
import type { CreateCropRequest, Crop } from '@/types/api/crops'

/** Quick crop creation from the campaign form (catalog also lives in Configuración). */
export function useCreateCrop(): UseMutationResult<Crop, ApiError, CreateCropRequest> {
  const token = useAuthToken()
  const queryClient = useQueryClient()
  return useMutation<Crop, ApiError, CreateCropRequest>({
    mutationFn: payload => cropsService.create(payload, token!),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.crops.all })
      toast.success('Cultivo agregado')
    },
    onError: error => toast.error(error.message),
  })
}
