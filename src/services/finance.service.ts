import { apiRequest } from '@/lib/api-client'
import type {
  Cost,
  CreateCostRequest,
  CreateIncomeRequest,
  CreateQuoteRequest,
  Income,
  ListFinanceParams,
  Quote,
  UpdateCostRequest,
  UpdateIncomeRequest,
} from '@/types/api/finance'

function buildQuery(params: ListFinanceParams): string {
  const search = new URLSearchParams()
  if (params.fieldId) search.set('fieldId', String(params.fieldId))
  if (params.campaignId) search.set('campaignId', String(params.campaignId))
  const qs = search.toString()
  return qs ? `?${qs}` : ''
}

/** Finance domain service — costs, incomes and manual grain quotes (info.md §9). */
export const financeService = {
  listCosts(params: ListFinanceParams, token: string): Promise<Cost[]> {
    return apiRequest<Cost[]>(`/finance/costs${buildQuery(params)}`, { token })
  },
  createCost(payload: CreateCostRequest, token: string): Promise<Cost> {
    return apiRequest<Cost>('/finance/costs', { method: 'POST', body: payload, token })
  },
  updateCost(id: number, payload: UpdateCostRequest, token: string): Promise<Cost> {
    return apiRequest<Cost>(`/finance/costs/${id}`, { method: 'PATCH', body: payload, token })
  },
  removeCost(id: number, token: string): Promise<void> {
    return apiRequest<void>(`/finance/costs/${id}`, { method: 'DELETE', token })
  },

  listIncomes(params: ListFinanceParams, token: string): Promise<Income[]> {
    return apiRequest<Income[]>(`/finance/incomes${buildQuery(params)}`, { token })
  },
  createIncome(payload: CreateIncomeRequest, token: string): Promise<Income> {
    return apiRequest<Income>('/finance/incomes', { method: 'POST', body: payload, token })
  },
  updateIncome(id: number, payload: UpdateIncomeRequest, token: string): Promise<Income> {
    return apiRequest<Income>(`/finance/incomes/${id}`, { method: 'PATCH', body: payload, token })
  },
  removeIncome(id: number, token: string): Promise<void> {
    return apiRequest<void>(`/finance/incomes/${id}`, { method: 'DELETE', token })
  },

  listQuotes(token: string): Promise<Quote[]> {
    return apiRequest<Quote[]>('/finance/quotes', { token })
  },
  createQuote(payload: CreateQuoteRequest, token: string): Promise<Quote> {
    return apiRequest<Quote>('/finance/quotes', { method: 'POST', body: payload, token })
  },
  removeQuote(id: number, token: string): Promise<void> {
    return apiRequest<void>(`/finance/quotes/${id}`, { method: 'DELETE', token })
  },
}
