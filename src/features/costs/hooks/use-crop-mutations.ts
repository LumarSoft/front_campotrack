'use client'

import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query'
import { toast } from 'sonner'
import { cropsService } from '@/services/crops.service'
import { useAuthToken } from '@/features/auth/hooks/use-auth-token'
import { queryKeys } from '@/lib/query-keys'
import type { ApiError } from '@/lib/api-client'
import type { CreateCropRequest, Crop, UpdateCropRequest } from '@/types/api/crops'

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

interface UpdateCropVars {
  id: number
  payload: UpdateCropRequest
}

export function useUpdateCrop(): UseMutationResult<Crop, ApiError, UpdateCropVars> {
  const token = useAuthToken()
  const queryClient = useQueryClient()
  return useMutation<Crop, ApiError, UpdateCropVars>({
    mutationFn: ({ id, payload }) => cropsService.update(id, payload, token!),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.crops.all })
      toast.success('Cultivo actualizado')
    },
    onError: error => toast.error(error.message),
  })
}

export function useDeleteCrop(): UseMutationResult<void, ApiError, number> {
  const token = useAuthToken()
  const queryClient = useQueryClient()
  return useMutation<void, ApiError, number>({
    mutationFn: id => cropsService.remove(id, token!),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.crops.all })
      toast.success('Cultivo eliminado')
    },
    onError: error => toast.error(error.message),
  })
}
