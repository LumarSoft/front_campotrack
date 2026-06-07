import { AlarmClock, CalendarClock, Layers, Sprout } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { DashboardKpis } from '../lib/derive-dashboard'

function formatHa(value: number): string {
  return value.toLocaleString('es-AR', { maximumFractionDigits: 1 })
}

/** Mini-indicators row (info.md §5): ha in production, active campaigns, overdue, upcoming. */
export function DashboardKpisRow({ kpis }: { kpis: DashboardKpis }): React.JSX.Element {
  const tiles = [
    { icon: Sprout, label: 'Hectáreas en producción', value: formatHa(kpis.haInProduction), unit: 'ha' },
    { icon: Layers, label: 'Campañas activas', value: String(kpis.activeCampaigns), unit: null },
    { icon: CalendarClock, label: 'Próximos 7 días', value: String(kpis.upcomingCount), unit: null },
    {
      icon: AlarmClock,
      label: 'Eventos atrasados',
      value: String(kpis.overdueCount),
      unit: null,
      alert: kpis.overdueCount > 0,
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {tiles.map(tile => (
        <article
          key={tile.label}
          className={cn(
            'rounded-2xl border p-5',
            tile.alert
              ? 'border-destructive/30 bg-[color-mix(in_srgb,var(--destructive)_6%,var(--bone))]'
              : 'border-hairline-on-bone bg-bone',
          )}
        >
          <span
            className={cn(
              'flex size-9 items-center justify-center rounded-full',
              tile.alert ? 'bg-destructive/15 text-destructive' : 'bg-clay/12 text-field',
            )}
          >
            <tile.icon className="size-5" />
          </span>
          <p className="font-display mt-4 text-3xl font-semibold text-ink">
            {tile.value}
            {tile.unit && <span className="ml-1 text-base font-normal text-stone">{tile.unit}</span>}
          </p>
          <p className="mt-1 font-sans text-sm text-stone">{tile.label}</p>
        </article>
      ))}
    </div>
  )
}
