'use client'

import { useCampaigns, useEvents } from '@/features/calendar/hooks/use-calendar-queries'
import { useRecords } from '@/features/records/hooks/use-records-queries'
import { buildFieldAnalysis, type FieldAnalysis } from '../lib/derive-analysis'

interface FieldAnalysisResult extends FieldAnalysis {
  /** Most recent campaign of the field — target for accepting a recommendation. */
  activeCampaignId: number | null
  isLoading: boolean
  isError: boolean
}

/**
 * Builds the per-field analysis (info.md §10) from existing server state:
 * campaigns and records, scoped by account. All derivation lives in the lib.
 */
export function useFieldAnalysis(fieldId: number | null): FieldAnalysisResult {
  const campaignsQuery = useCampaigns()
  const recordsQuery = useRecords(fieldId ? { fieldId } : {})
  // Keeps the events cache warm so an accepted recommendation shows immediately.
  useEvents(fieldId ? { fieldId } : {})

  const fieldCampaigns = (campaignsQuery.data ?? []).filter(campaign => campaign.fieldId === fieldId)
  const records = fieldId ? (recordsQuery.data ?? []) : []
  const analysis = buildFieldAnalysis(fieldCampaigns, records, new Date())

  return {
    ...analysis,
    activeCampaignId: fieldCampaigns[0]?.id ?? null,
    isLoading: campaignsQuery.isLoading || recordsQuery.isLoading,
    isError: campaignsQuery.isError || recordsQuery.isError,
  }
}
