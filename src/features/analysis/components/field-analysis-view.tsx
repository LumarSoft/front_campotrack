'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { useFieldAnalysis } from '../hooks/use-field-analysis'
import { YieldComparisonChart } from './yield-comparison-chart'
import { CampaignComparisonTable } from './campaign-comparison-table'
import { RecommendationsPanel } from './recommendations-panel'

/** Full analysis for one field. Mounted only once a field is selected. */
export function FieldAnalysisView({ fieldId }: { fieldId: number }): React.JSX.Element {
  const {
    campaignStats,
    yieldSeries,
    averageYieldQqHa,
    recommendations,
    referenceDoses,
    activeCampaignId,
    hasData,
    isLoading,
    isError,
  } = useFieldAnalysis(fieldId)

  if (isError) {
    return (
      <div className="rounded-2xl border border-hairline-on-bone p-10 text-center text-sm text-destructive">
        No pudimos cargar el análisis. Reintentá en unos segundos.
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="grid gap-6 lg:grid-cols-3">
        <Skeleton className="h-72 rounded-2xl bg-[color-mix(in_srgb,var(--stone)_14%,var(--bone))] lg:col-span-2" />
        <Skeleton className="h-72 rounded-2xl bg-[color-mix(in_srgb,var(--stone)_14%,var(--bone))]" />
      </div>
    )
  }

  if (!hasData) {
    return (
      <div className="rounded-2xl border border-dashed border-hairline-on-bone p-10 text-center">
        <p className="text-sm text-stone">Este campo todavía no tiene campañas para analizar.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <YieldComparisonChart series={yieldSeries} averageQqHa={averageYieldQqHa} />
        <CampaignComparisonTable stats={campaignStats} />
      </div>
      <div className="lg:col-span-1">
        <RecommendationsPanel
          recommendations={recommendations}
          referenceDoses={referenceDoses}
          activeCampaignId={activeCampaignId}
        />
      </div>
    </div>
  )
}
