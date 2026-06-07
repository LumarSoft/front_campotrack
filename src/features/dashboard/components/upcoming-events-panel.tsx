import Link from 'next/link'
import { CalendarCheck } from 'lucide-react'
import { formatDayLong } from '@/features/calendar/date-utils'
import { EVENT_TYPE_COLOR, EVENT_TYPE_LABELS } from '@/features/calendar/event-config'
import type { CalendarEvent } from '@/types/api/events'

function EventRow({ event, overdue }: { event: CalendarEvent; overdue: boolean }): React.JSX.Element {
  return (
    <Link
      href="/calendario"
      className="flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-[color-mix(in_srgb,var(--stone)_8%,var(--bone))]"
    >
      <span className="mt-1.5 size-2.5 shrink-0 rounded-full" style={{ background: EVENT_TYPE_COLOR[event.type] }} />
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="flex items-center justify-between gap-2">
          <span className="truncate font-medium text-ink">{EVENT_TYPE_LABELS[event.type]}</span>
          <span className={overdue ? 'shrink-0 text-xs font-medium text-destructive' : 'shrink-0 text-xs text-stone'}>
            {formatDayLong(event.plannedDate.slice(0, 10))}
          </span>
        </span>
        <span className="truncate text-sm text-stone">
          {event.campaign.fieldName}
          {event.subdivision ? ` · ${event.subdivision.name}` : ''} · {event.campaign.cropName}
        </span>
      </span>
    </Link>
  )
}

interface UpcomingEventsPanelProps {
  overdue: CalendarEvent[]
  upcoming: CalendarEvent[]
}

/** Overdue and upcoming events (info.md §5), each linking into the calendar. */
export function UpcomingEventsPanel({ overdue, upcoming }: UpcomingEventsPanelProps): React.JSX.Element {
  const isEmpty = overdue.length === 0 && upcoming.length === 0

  return (
    <article className="rounded-2xl border border-hairline-on-bone bg-bone p-5">
      <header className="flex items-center justify-between gap-2">
        <h2 className="font-display text-lg font-semibold text-ink">Eventos</h2>
        <Link href="/calendario" className="text-sm text-primary hover:underline">
          Ver calendario
        </Link>
      </header>

      {isEmpty ? (
        <div className="flex flex-col items-center gap-2 py-10 text-center">
          <CalendarCheck className="size-7 text-stone" />
          <p className="text-sm text-stone">Sin eventos vencidos ni próximos.</p>
        </div>
      ) : (
        <div className="mt-3 space-y-5">
          {overdue.length > 0 && (
            <section>
              <p className="kicker text-destructive">Vencidos · {overdue.length}</p>
              <div className="mt-1.5">
                {overdue.map(event => (
                  <EventRow key={event.id} event={event} overdue />
                ))}
              </div>
            </section>
          )}
          {upcoming.length > 0 && (
            <section>
              <p className="kicker text-stone">Próximos</p>
              <div className="mt-1.5">
                {upcoming.map(event => (
                  <EventRow key={event.id} event={event} overdue={false} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </article>
  )
}
