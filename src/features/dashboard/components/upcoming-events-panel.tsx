'use client'

import Link from 'next/link'
import { CalendarCheck, ChevronRight } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { formatDayLong } from '@/features/calendar/date-utils'
import { EVENT_TYPE_COLOR, EVENT_TYPE_LABELS } from '@/features/calendar/event-config'
import type { CalendarEvent } from '@/types/api/events'

function EventRow({ event, overdue, index }: { event: CalendarEvent; overdue: boolean; index: number }): React.JSX.Element {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: 0.15 + index * 0.04, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href="/calendario"
        className="group flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors duration-150 hover:bg-accent"
      >
        <span
          className="mt-1.5 size-2.5 shrink-0 rounded-full ring-2 ring-bone"
          style={{ background: EVENT_TYPE_COLOR[event.type] }}
        />
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="flex items-center justify-between gap-2">
            <span className="truncate font-medium text-ink">{EVENT_TYPE_LABELS[event.type]}</span>
            <span
              className={
                overdue
                  ? 'shrink-0 text-xs font-medium text-destructive'
                  : 'shrink-0 text-xs text-muted-foreground'
              }
            >
              {formatDayLong(event.plannedDate.slice(0, 10))}
            </span>
          </span>
          <span className="truncate text-sm text-muted-foreground">
            {event.campaign.fieldName}
            {event.subdivision ? ` · ${event.subdivision.name}` : ''} · {event.campaign.cropName}
          </span>
        </span>
        <ChevronRight className="mt-1.5 size-3.5 shrink-0 text-stone-soft opacity-0 transition-all duration-150 group-hover:translate-x-0.5 group-hover:opacity-100" />
      </Link>
    </motion.div>
  )
}

interface UpcomingEventsPanelProps {
  overdue: CalendarEvent[]
  upcoming: CalendarEvent[]
}

/** Overdue and upcoming events (info.md §5), each linking into the calendar. */
export function UpcomingEventsPanel({ overdue, upcoming }: UpcomingEventsPanelProps): React.JSX.Element {
  const reduceMotion = useReducedMotion()
  const isEmpty = overdue.length === 0 && upcoming.length === 0

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      data-tour="events"
      className="relative overflow-hidden rounded-2xl border border-hairline-on-bone bg-bone p-5"
    >
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-clay/25 to-transparent"
      />
      <header className="flex items-center justify-between gap-2">
        <h2 className="font-display text-lg font-semibold text-ink">Eventos</h2>
        <Link
          href="/calendario"
          className="text-sm font-medium text-primary transition-colors duration-150 hover:text-clay-deep hover:underline underline-offset-4"
        >
          Ver calendario
        </Link>
      </header>

      {isEmpty ? (
        <div className="flex flex-col items-center gap-2 py-10 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-clay/8 text-clay">
            <CalendarCheck className="size-6" />
          </span>
          <p className="text-sm text-muted-foreground">Sin eventos vencidos ni próximos.</p>
        </div>
      ) : (
        <div className="mt-3 space-y-5">
          {overdue.length > 0 && (
            <section>
              <p className="kicker text-destructive">Vencidos · {overdue.length}</p>
              <div className="mt-1.5">
                {overdue.map((event, i) => (
                  <EventRow key={event.id} event={event} overdue index={i} />
                ))}
              </div>
            </section>
          )}
          {upcoming.length > 0 && (
            <section>
              <p className="kicker text-stone">Próximos</p>
              <div className="mt-1.5">
                {upcoming.map((event, i) => (
                  <EventRow key={event.id} event={event} overdue={false} index={i + overdue.length} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </motion.article>
  )
}
