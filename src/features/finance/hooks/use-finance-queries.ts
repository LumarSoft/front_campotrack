'use client'

import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import { financeService } from '@/services/finance.service'
import { useAuthToken } from '@/features/auth/hooks/use-auth-token'
import { queryKeys } from '@/lib/query-keys'
import type { ApiError } from '@/lib/api-client'
import type { Cost, Income, ListFinanceParams, Quote } from '@/types/api/finance'

export function useCosts(params: ListFinanceParams): UseQueryResult<Cost[], ApiError> {
  const token = useAuthToken()
  return useQuery<Cost[], ApiError>({
    queryKey: [...queryKeys.finance.costs, params],
    queryFn: () => financeService.listCosts(params, token!),
    enabled: !!token,
  })
}

export function useIncomes(params: ListFinanceParams): UseQueryResult<Income[], ApiError> {
  const token = useAuthToken()
  return useQuery<Income[], ApiError>({
    queryKey: [...queryKeys.finance.incomes, params],
    queryFn: () => financeService.listIncomes(params, token!),
    enabled: !!token,
  })
}

export function useQuotes(): UseQueryResult<Quote[], ApiError> {
  const token = useAuthToken()
  return useQuery<Quote[], ApiError>({
    queryKey: queryKeys.finance.quotes,
    queryFn: () => financeService.listQuotes(token!),
    enabled: !!token,
  })
}
