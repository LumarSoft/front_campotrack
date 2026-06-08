'use client'

import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query'
import { toast } from 'sonner'
import { fieldsService } from '@/services/fields.service'
import { useAuthToken } from '@/features/auth/hooks/use-auth-token'
import { queryKeys } from '@/lib/query-keys'
import type { ApiError } from '@/lib/api-client'
import type {
  CreateFieldRequest,
  CreateLocationRequest,
  CreateSubdivisionRequest,
  FieldDetail,
  UpdateFieldRequest,
  UpdateSubdivisionRequest,
} from '@/types/api/fields'

/** Refreshes the detail cache and the list after any field-aggregate mutation. */
function useFieldCacheSync(): (field: FieldDetail) => void {
  const queryClient = useQueryClient()
  return (field: FieldDetail) => {
    queryClient.setQueryData(queryKeys.fields.detail(field.id), field)
    void queryClient.invalidateQueries({ queryKey: queryKeys.fields.all })
  }
}

function notifyError(error: ApiError): void {
  toast.error(error.message)
}

export function useCreateField(): UseMutationResult<FieldDetail, ApiError, CreateFieldRequest> {
  const token = useAuthToken()
  const syncCache = useFieldCacheSync()
  return useMutation<FieldDetail, ApiError, CreateFieldRequest>({
    mutationFn: payload => fieldsService.create(payload, token!),
    onSuccess: field => {
      syncCache(field)
      toast.success('Campo creado')
    },
    onError: notifyError,
  })
}

export function useUpdateField(fieldId: number): UseMutationResult<FieldDetail, ApiError, UpdateFieldRequest> {
  const token = useAuthToken()
  const syncCache = useFieldCacheSync()
  return useMutation<FieldDetail, ApiError, UpdateFieldRequest>({
    mutationFn: payload => fieldsService.update(fieldId, payload, token!),
    onSuccess: field => {
      syncCache(field)
      toast.success('Campo actualizado')
    },
    onError: notifyError,
  })
}

export function useDeleteField(): UseMutationResult<void, ApiError, number> {
  const token = useAuthToken()
  const queryClient = useQueryClient()
  return useMutation<void, ApiError, number>({
    mutationFn: id => fieldsService.remove(id, token!),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.fields.all })
      toast.success('Campo eliminado')
    },
    onError: notifyError,
  })
}

export function useAddLocation(fieldId: number): UseMutationResult<FieldDetail, ApiError, CreateLocationRequest> {
  const token = useAuthToken()
  const syncCache = useFieldCacheSync()
  return useMutation<FieldDetail, ApiError, CreateLocationRequest>({
    mutationFn: payload => fieldsService.addLocation(fieldId, payload, token!),
    onSuccess: field => {
      syncCache(field)
      toast.success('Ubicación agregada')
    },
    onError: notifyError,
  })
}

export function useRemoveLocation(fieldId: number): UseMutationResult<FieldDetail, ApiError, number> {
  const token = useAuthToken()
  const syncCache = useFieldCacheSync()
  return useMutation<FieldDetail, ApiError, number>({
    mutationFn: locationId => fieldsService.removeLocation(fieldId, locationId, token!),
    onSuccess: field => {
      syncCache(field)
      toast.success('Ubicación eliminada')
    },
    onError: notifyError,
  })
}

export function useAddSubdivision(
  fieldId: number,
): UseMutationResult<FieldDetail, ApiError, CreateSubdivisionRequest> {
  const token = useAuthToken()
  const syncCache = useFieldCacheSync()
  return useMutation<FieldDetail, ApiError, CreateSubdivisionRequest>({
    mutationFn: payload => fieldsService.addSubdivision(fieldId, payload, token!),
    onSuccess: field => {
      syncCache(field)
      toast.success('Subdivisión creada')
    },
    onError: notifyError,
  })
}

interface UpdateSubdivisionVars {
  subdivisionId: number
  payload: UpdateSubdivisionRequest
}

export function useUpdateSubdivision(
  fieldId: number,
): UseMutationResult<FieldDetail, ApiError, UpdateSubdivisionVars> {
  const token = useAuthToken()
  const syncCache = useFieldCacheSync()
  return useMutation<FieldDetail, ApiError, UpdateSubdivisionVars>({
    mutationFn: ({ subdivisionId, payload }) =>
      fieldsService.updateSubdivision(fieldId, subdivisionId, payload, token!),
    onSuccess: field => {
      syncCache(field)
      toast.success('Subdivisión actualizada')
    },
    onError: notifyError,
  })
}

export function useRemoveSubdivision(fieldId: number): UseMutationResult<FieldDetail, ApiError, number> {
  const token = useAuthToken()
  const syncCache = useFieldCacheSync()
  return useMutation<FieldDetail, ApiError, number>({
    mutationFn: subdivisionId => fieldsService.removeSubdivision(fieldId, subdivisionId, token!),
    onSuccess: field => {
      syncCache(field)
      toast.success('Subdivisión eliminada')
    },
    onError: notifyError,
  })
}
