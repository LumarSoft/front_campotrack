import Link from 'next/link'
import { ArrowRight, MapPin } from 'lucide-react'
import { formatDayLong } from '@/features/calendar/date-utils'
import { EVENT_TYPE_LABELS } from '@/features/calendar/event-config'
import type { FieldState } from '../lib/derive-dashboard'

function FieldTile({ field }: { field: FieldState }): React.JSX.Element {
  return (
    <Link
      href={`/campos/${field.id}`}
      className="group flex flex-col gap-3 rounded-2xl border border-hairline-on-bone bg-bone p-5 transition-colors hover:border-clay/40"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="truncate font-display text-base font-semibold text-ink">{field.name}</h3>
          <p className="mt-0.5 text-sm text-stone">
            {field.totalHa.toLocaleString('es-AR', { maximumFractionDigits: 1 })} ha
          </p>
        </div>
        {field.overdueCount > 0 && (
          <span className="shrink-0 rounded-full bg-destructive/12 px-2 py-0.5 text-xs font-medium text-destructive">
            {field.overdueCount} atrasado{field.overdueCount > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {field.activeCampaign ? (
        <p className="text-sm text-ink">
          <span className="font-medium">{field.activeCampaign.cropName}</span>
          <span className="text-stone"> · {field.activeCampaign.cycle}</span>
        </p>
      ) : (
        <p className="text-sm text-stone">Sin campaña activa</p>
      )}

      <div className="mt-auto flex items-center justify-between gap-2 text-sm">
        {field.nextEvent ? (
          <span className="truncate text-stone">
            Próximo: {EVENT_TYPE_LABELS[field.nextEvent.type]}
            <span className="capitalize"> · {formatDayLong(field.nextEvent.dateKey)}</span>
          </span>
        ) : (
          <span className="text-stone">Sin eventos próximos</span>
        )}
        <ArrowRight className="size-4 shrink-0 text-clay transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  )
}

/** Per-field state cards (info.md §5), most active first; quick access to detail. */
export function FieldStatusPanel({ fields }: { fields: FieldState[] }): React.JSX.Element {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-display text-lg font-semibold text-ink">Estado de tus campos</h2>
        <Link href="/campos" className="text-sm text-primary hover:underline">
          Ver todos
        </Link>
      </div>

      {fields.length === 0 ? (
        <article className="flex flex-col items-center gap-3 rounded-2xl border border-hairline-on-bone bg-bone p-10 text-center">
          <MapPin className="size-7 text-stone" />
          <p className="text-sm text-stone">Todavía no cargaste campos.</p>
          <Link href="/campos" className="text-sm font-medium text-primary hover:underline">
            Cargar mi primer campo
          </Link>
        </article>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {fields.map(field => (
            <FieldTile key={field.id} field={field} />
          ))}
        </div>
      )}
    </section>
  )
}
