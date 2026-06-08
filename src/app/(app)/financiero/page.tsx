'use client'

import { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/layout/page-header'
import { useAuthStore } from '@/features/auth/store/use-auth-store'
import { useFields, useCrops } from '@/features/fields/hooks/use-fields-queries'
import { useCampaigns } from '@/features/calendar/hooks/use-calendar-queries'
import { useFinanceSummary } from '@/features/finance/hooks/use-finance-summary'
import { useQuotes } from '@/features/finance/hooks/use-finance-queries'
import { ProfitabilityCards } from '@/features/finance/components/profitability-cards'
import { MonthlyView } from '@/features/finance/components/monthly-view'
import { CostsTable } from '@/features/finance/components/costs-table'
import { IncomesTable } from '@/features/finance/components/incomes-table'
import { QuotesPanel } from '@/features/finance/components/quotes-panel'

/**
 * Finance & profitability (info.md §9) — hidden from the producer. Costs,
 * incomes, manual quotes and per-campaign profitability (ARS/USD, no FX).
 */
export default function FinancieroPage(): React.JSX.Element {
  const role = useAuthStore(state => state.user?.role ?? 'PRODUCER')

  const fieldsQuery = useFields()
  const fields = fieldsQuery.data ?? []
  const [selectedId, setSelectedId] = useState('')

  if (selectedId === '' && fields.length > 0) {
    setSelectedId(String(fields[0].id))
  }

  const fieldId = selectedId === '' ? null : Number(selectedId)
  const summary = useFinanceSummary(fieldId)
  const campaignsQuery = useCampaigns()
  const cropsQuery = useCrops()
  const quotesQuery = useQuotes()

  const fieldCampaigns = (campaignsQuery.data ?? []).filter(campaign => campaign.fieldId === fieldId)
  const crops = cropsQuery.data ?? []
  const quotes = quotesQuery.data ?? []

  if (role === 'PRODUCER') {
    return (
      <div className="mx-auto max-w-3xl">
        <PageHeader kicker="Financiero" title="Sección no disponible" />
        <p className="mt-6 text-sm text-stone">El módulo financiero está reservado al equipo interno.</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        kicker="Financiero"
        title="Costos y rentabilidad"
        description="Cargá costos e ingresos y mirá la rentabilidad por campaña. Pesos y dólares por separado."
        actions={
          fields.length > 0 ? (
            <Select value={selectedId} onValueChange={setSelectedId}>
              <SelectTrigger className="w-56">
                <SelectValue placeholder="Elegí un campo" />
              </SelectTrigger>
              <SelectContent>
                {fields.map(field => (
                  <SelectItem key={field.id} value={String(field.id)}>
                    {field.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : undefined
        }
      />

      {fieldsQuery.isLoading ? (
        <Skeleton className="h-72 w-full rounded-2xl bg-[color-mix(in_srgb,var(--stone)_14%,var(--bone))]" />
      ) : fields.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-hairline-on-bone p-10 text-center text-sm text-stone">
          Todavía no tenés campos. Cargá uno para empezar a cargar costos e ingresos.
        </div>
      ) : (
        <Tabs defaultValue="resumen">
          <TabsList>
            <TabsTrigger value="resumen">Resumen</TabsTrigger>
            <TabsTrigger value="costos">Costos</TabsTrigger>
            <TabsTrigger value="ingresos">Ingresos</TabsTrigger>
            <TabsTrigger value="cotizaciones">Cotizaciones</TabsTrigger>
          </TabsList>

          <TabsContent value="resumen" className="mt-6 space-y-6">
            {summary.isError ? (
              <div className="rounded-2xl border border-hairline-on-bone p-10 text-center text-sm text-destructive">
                No pudimos cargar el resumen financiero.
              </div>
            ) : summary.isLoading ? (
              <Skeleton className="h-60 w-full rounded-2xl bg-[color-mix(in_srgb,var(--stone)_14%,var(--bone))]" />
            ) : summary.profitability.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-hairline-on-bone p-10 text-center text-sm text-stone">
                Este campo no tiene campañas. Creá una para cargar su economía.
              </div>
            ) : (
              <>
                <ProfitabilityCards profitability={summary.profitability} />
                <MonthlyView costs={summary.costs} incomes={summary.incomes} />
              </>
            )}
          </TabsContent>

          <TabsContent value="costos" className="mt-6">
            <CostsTable costs={summary.costs} campaigns={fieldCampaigns} />
          </TabsContent>

          <TabsContent value="ingresos" className="mt-6">
            <IncomesTable incomes={summary.incomes} campaigns={fieldCampaigns} crops={crops} quotes={quotes} />
          </TabsContent>

          <TabsContent value="cotizaciones" className="mt-6">
            <QuotesPanel />
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
