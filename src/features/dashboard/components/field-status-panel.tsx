'use client'

import Link from 'next/link'
import { ArrowRight, MapPin } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { formatDayLong } from '@/features/calendar/date-utils'
import { EVENT_TYPE_LABELS } from '@/features/calendar/event-config'
import type { FieldState } from '../lib/derive-dashboard'

function FieldTile({ field, index }: { field: FieldState; index: number }): React.JSX.Element {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.36, delay: 0.1 + index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      whileHover={reduceMotion ? undefined : { y: -3 }}
    >
      <Link
        href={`/campos/${field.id}`}
        className="group relative flex h-full flex-col gap-3 overflow-hidden rounded-2xl border border-hairline-on-bone bg-bone p-5 transition-[border-color,box-shadow] duration-200 ease-[var(--ease-out)] hover:border-clay/35 hover:shadow-[var(--shadow-md)]"
      >
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-clay/30 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        />
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate font-display text-base font-semibold text-ink">{field.name}</h3>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {field.totalHa.toLocaleString('es-AR', { maximumFractionDigits: 1 })} ha
            </p>
          </div>
          {field.overdueCount > 0 && (
            <span className="shrink-0 rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive ring-1 ring-destructive/20">
              {field.overdueCount} atrasado{field.overdueCount > 1 ? 's' : ''}
            </span>
          )}
        </div>

        {field.activeCampaign ? (
          <p className="text-sm text-ink">
            <span className="font-medium">{field.activeCampaign.cropName}</span>
            <span className="text-muted-foreground"> · {field.activeCampaign.cycle}</span>
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">Sin campaña activa</p>
        )}

        <div className="mt-auto flex items-center justify-between gap-2 text-sm">
          {field.nextEvent ? (
            <span className="truncate text-muted-foreground">
              Próximo: <span className="text-ink">{EVENT_TYPE_LABELS[field.nextEvent.type]}</span>
              <span className="capitalize"> · {formatDayLong(field.nextEvent.dateKey)}</span>
            </span>
          ) : (
            <span className="text-muted-foreground">Sin eventos próximos</span>
          )}
          <ArrowRight className="size-4 shrink-0 text-clay transition-transform duration-200 group-hover:translate-x-1" />
        </div>
      </Link>
    </motion.div>
  )
}

/** Per-field state cards (info.md §5), most active first; quick access to detail. */
export function FieldStatusPanel({ fields }: { fields: FieldState[] }): React.JSX.Element {
  const reduceMotion = useReducedMotion()

  return (
    <section data-tour="fields" className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-display text-lg font-semibold text-ink">Estado de tus campos</h2>
        <Link
          href="/campos"
          className="text-sm font-medium text-primary transition-colors duration-150 hover:text-clay-deep hover:underline underline-offset-4"
        >
          Ver todos
        </Link>
      </div>

      {fields.length === 0 ? (
        <motion.article
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-hairline-strong bg-bone p-10 text-center"
        >
          <span className="flex size-12 items-center justify-center rounded-full bg-clay/8 text-clay">
            <MapPin className="size-6" />
          </span>
          <p className="text-sm text-muted-foreground">Todavía no cargaste campos.</p>
          <Link
            href="/campos"
            className="text-sm font-medium text-primary transition-colors duration-150 hover:text-clay-deep hover:underline underline-offset-4"
          >
            Cargar mi primer campo
          </Link>
        </motion.article>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {fields.map((field, i) => (
            <FieldTile key={field.id} field={field} index={i} />
          ))}
        </div>
      )}
    </section>
  )
}
