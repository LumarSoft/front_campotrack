'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { PageHeader } from '@/components/layout/page-header'
import { useAuthStore } from '@/features/auth/store/use-auth-store'
import { useDashboardData } from '@/features/dashboard/hooks/use-dashboard-data'
import { DashboardKpisRow } from '@/features/dashboard/components/dashboard-kpis'
import { UpcomingEventsPanel } from '@/features/dashboard/components/upcoming-events-panel'
import { FieldStatusPanel } from '@/features/dashboard/components/field-status-panel'

/**
 * Dashboard home (info.md §5): KPIs, overdue/upcoming events and per-field state
 * across every accessible field, in the landing's editorial language.
 */
export default function DashboardPage(): React.JSX.Element {
  const user = useAuthStore(state => state.user)
  const firstName = user?.name?.split(' ')[0] ?? 'agrónomo'
  const { kpis, overdue, upcoming, fieldStates, isLoading, isError } = useDashboardData()

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <PageHeader
        kicker="Inicio"
        title={`Hola, ${firstName}`}
        description="El estado de tus campos, los eventos que se vienen y lo que está atrasado, de un vistazo."
      />

      {isError ? (
        <div className="rounded-2xl border border-hairline-on-bone p-10 text-center text-sm text-destructive">
          No pudimos cargar el panel. Reintentá en unos segundos.
        </div>
      ) : isLoading ? (
        <div className="space-y-8">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-2xl bg-[color-mix(in_srgb,var(--stone)_14%,var(--bone))]" />
            ))}
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            <Skeleton className="h-80 rounded-2xl bg-[color-mix(in_srgb,var(--stone)_14%,var(--bone))] lg:col-span-2" />
            <Skeleton className="h-80 rounded-2xl bg-[color-mix(in_srgb,var(--stone)_14%,var(--bone))]" />
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <DashboardKpisRow kpis={kpis} />
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <FieldStatusPanel fields={fieldStates} />
            </div>
            <div className="lg:col-span-1">
              <UpcomingEventsPanel overdue={overdue} upcoming={upcoming} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
