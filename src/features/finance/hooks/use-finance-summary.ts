'use client'

import { useCampaigns } from '@/features/calendar/hooks/use-calendar-queries'
import { useRecords } from '@/features/records/hooks/use-records-queries'
import { useCosts, useIncomes } from './use-finance-queries'
import { profitabilityByCampaign, type CampaignProfitability } from '../lib/derive-finance'
import type { Cost, Income } from '@/types/api/finance'

interface FinanceSummaryResult {
  costs: Cost[]
  incomes: Income[]
  profitability: CampaignProfitability[]
  isLoading: boolean
  isError: boolean
}

/**
 * Per-field financial summary (info.md §9): costs/incomes plus derived
 * profitability by campaign. All aggregation lives in the lib.
 */
export function useFinanceSummary(fieldId: number | null): FinanceSummaryResult {
  const params = fieldId ? { fieldId } : {}
  const costsQuery = useCosts(params)
  const incomesQuery = useIncomes(params)
  const campaignsQuery = useCampaigns()
  const recordsQuery = useRecords(params)

  const costs = fieldId ? (costsQuery.data ?? []) : []
  const incomes = fieldId ? (incomesQuery.data ?? []) : []
  const fieldCampaigns = (campaignsQuery.data ?? []).filter(campaign => campaign.fieldId === fieldId)
  const records = fieldId ? (recordsQuery.data ?? []) : []

  return {
    costs,
    incomes,
    profitability: profitabilityByCampaign(fieldCampaigns, costs, incomes, records),
    isLoading: costsQuery.isLoading || incomesQuery.isLoading || campaignsQuery.isLoading,
    isError: costsQuery.isError || incomesQuery.isError,
  }
}
