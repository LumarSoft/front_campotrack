'use client'

import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query'
import { toast } from 'sonner'
import { financeService } from '@/services/finance.service'
import { useAuthToken } from '@/features/auth/hooks/use-auth-token'
import { queryKeys } from '@/lib/query-keys'
import type { ApiError } from '@/lib/api-client'
import type {
  Cost,
  CreateCostRequest,
  CreateIncomeRequest,
  CreateQuoteRequest,
  Income,
  Quote,
  UpdateCostRequest,
  UpdateIncomeRequest,
} from '@/types/api/finance'

function notifyError(error: ApiError): void {
  toast.error(error.message)
}

function useInvalidate(keys: readonly (readonly unknown[])[]): () => void {
  const queryClient = useQueryClient()
  return () => keys.forEach(key => void queryClient.invalidateQueries({ queryKey: key }))
}

export function useSaveCost(): UseMutationResult<Cost, ApiError, { id?: number; payload: CreateCostRequest }> {
  const token = useAuthToken()
  const invalidate = useInvalidate([queryKeys.finance.costs])
  return useMutation({
    mutationFn: ({ id, payload }: { id?: number; payload: CreateCostRequest }) =>
      id
        ? financeService.updateCost(id, payload as UpdateCostRequest, token!)
        : financeService.createCost(payload, token!),
    onSuccess: () => {
      invalidate()
      toast.success('Costo guardado')
    },
    onError: notifyError,
  })
}

export function useDeleteCost(): UseMutationResult<void, ApiError, number> {
  const token = useAuthToken()
  const invalidate = useInvalidate([queryKeys.finance.costs])
  return useMutation<void, ApiError, number>({
    mutationFn: id => financeService.removeCost(id, token!),
    onSuccess: () => {
      invalidate()
      toast.success('Costo eliminado')
    },
    onError: notifyError,
  })
}

export function useSaveIncome(): UseMutationResult<Income, ApiError, { id?: number; payload: CreateIncomeRequest }> {
  const token = useAuthToken()
  const invalidate = useInvalidate([queryKeys.finance.incomes])
  return useMutation({
    mutationFn: ({ id, payload }: { id?: number; payload: CreateIncomeRequest }) =>
      id
        ? financeService.updateIncome(id, payload as UpdateIncomeRequest, token!)
        : financeService.createIncome(payload, token!),
    onSuccess: () => {
      invalidate()
      toast.success('Ingreso guardado')
    },
    onError: notifyError,
  })
}

export function useDeleteIncome(): UseMutationResult<void, ApiError, number> {
  const token = useAuthToken()
  const invalidate = useInvalidate([queryKeys.finance.incomes])
  return useMutation<void, ApiError, number>({
    mutationFn: id => financeService.removeIncome(id, token!),
    onSuccess: () => {
      invalidate()
      toast.success('Ingreso eliminado')
    },
    onError: notifyError,
  })
}

export function useCreateQuote(): UseMutationResult<Quote, ApiError, CreateQuoteRequest> {
  const token = useAuthToken()
  const invalidate = useInvalidate([queryKeys.finance.quotes])
  return useMutation<Quote, ApiError, CreateQuoteRequest>({
    mutationFn: payload => financeService.createQuote(payload, token!),
    onSuccess: () => {
      invalidate()
      toast.success('Cotización cargada')
    },
    onError: notifyError,
  })
}

export function useDeleteQuote(): UseMutationResult<void, ApiError, number> {
  const token = useAuthToken()
  const invalidate = useInvalidate([queryKeys.finance.quotes])
  return useMutation<void, ApiError, number>({
    mutationFn: id => financeService.removeQuote(id, token!),
    onSuccess: () => {
      invalidate()
      toast.success('Cotización eliminada')
    },
    onError: notifyError,
  })
}
