'use client'

import { AlarmClock, CalendarClock, Layers, Sprout } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/utils'
import type { DashboardKpis } from '../lib/derive-dashboard'

function formatHa(value: number): string {
  return value.toLocaleString('es-AR', { maximumFractionDigits: 1 })
}

/** Mini-indicators row (info.md §5): ha in production, active campaigns, overdue, upcoming. */
export function DashboardKpisRow({ kpis }: { kpis: DashboardKpis }): React.JSX.Element {
  const reduceMotion = useReducedMotion()
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
    <div data-tour="kpis" className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {tiles.map((tile, i) => (
        <motion.article
          key={tile.label}
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
          whileHover={reduceMotion ? undefined : { y: -2 }}
          className={cn(
            'group relative overflow-hidden rounded-2xl border p-5 transition-[border-color,box-shadow] duration-200 ease-[var(--ease-out)]',
            tile.alert
              ? 'border-destructive/25 bg-[color-mix(in_srgb,var(--destructive)_5%,var(--bone))] hover:border-destructive/40 hover:shadow-[var(--shadow-md)]'
              : 'border-hairline-on-bone bg-bone hover:border-clay/30 hover:shadow-[var(--shadow-soft)]',
          )}
        >
          <span
            aria-hidden
            className={cn(
              'absolute inset-x-0 top-0 h-px',
              tile.alert
                ? 'bg-gradient-to-r from-transparent via-destructive/40 to-transparent'
                : 'bg-gradient-to-r from-transparent via-clay/30 to-transparent',
            )}
          />
          <span
            className={cn(
              'flex size-10 items-center justify-center rounded-xl transition-transform duration-200 ease-[var(--ease-spring)] group-hover:scale-105',
              tile.alert
                ? 'bg-destructive/12 text-destructive ring-1 ring-destructive/20'
                : 'bg-clay/10 text-field ring-1 ring-clay/15',
            )}
          >
            <tile.icon className="size-5" />
          </span>
          <p className="font-display mt-4 text-3xl font-semibold tabular-nums text-ink">
            {tile.value}
            {tile.unit && <span className="ml-1 text-base font-normal text-stone">{tile.unit}</span>}
          </p>
          <p className="mt-1 font-sans text-sm text-muted-foreground">{tile.label}</p>
        </motion.article>
      ))}
    </div>
  )
}
