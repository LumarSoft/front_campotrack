'use client'

import { buildMonthGrid, eventDateKey, isSameMonth, toDateKey } from '@/features/calendar/date-utils'
import { EVENT_TYPE_COLOR, EVENT_TYPE_LABELS } from '@/features/calendar/event-config'
import { cn } from '@/lib/utils'
import type { CalendarEvent } from '@/types/api/events'

const WEEKDAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

interface MonthGridProps {
  month: Date
  events: CalendarEvent[]
  selectedKey: string
  onSelectDay: (dateKey: string) => void
}

export function MonthGrid({ month, events, selectedKey, onSelectDay }: MonthGridProps): React.JSX.Element {
  const todayKey = toDateKey(new Date())
  const days = buildMonthGrid(month)

  const byDay = new Map<string, CalendarEvent[]>()
  for (const event of events) {
    const key = eventDateKey(event.plannedDate)
    const list = byDay.get(key)
    if (list) list.push(event)
    else byDay.set(key, [event])
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-hairline-on-bone">
      <div className="grid grid-cols-7 border-b border-hairline-on-bone">
        {WEEKDAYS.map(day => (
          <div key={day} className="px-2 py-2 text-center text-xs font-medium text-stone">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {days.map(day => {
          const key = toDateKey(day)
          const dayEvents = byDay.get(key) ?? []
          const inMonth = isSameMonth(day, month)
          const isToday = key === todayKey
          const isSelected = key === selectedKey

          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelectDay(key)}
              className={cn(
                'flex min-h-20 flex-col gap-1 border-b border-r border-hairline-on-bone p-1.5 text-left transition-colors last:border-r-0 hover:bg-clay/[0.04] sm:min-h-24',
                !inMonth && 'bg-[color-mix(in_srgb,var(--stone)_6%,var(--bone))]',
                isSelected && 'bg-clay/[0.07] ring-1 ring-inset ring-clay/40',
              )}
            >
              <span
                className={cn(
                  'inline-flex size-6 items-center justify-center rounded-full text-xs',
                  inMonth ? 'text-ink' : 'text-stone/50',
                  isToday && 'bg-clay font-semibold text-bone',
                )}
              >
                {day.getDate()}
              </span>
              <span className="flex flex-col gap-0.5 overflow-hidden">
                {dayEvents.slice(0, 2).map(event => (
                  <span
                    key={event.id}
                    className={cn(
                      'flex items-center gap-1 truncate text-[10px] leading-tight sm:text-[11px]',
                      event.status === 'DONE' ? 'text-stone line-through' : 'text-ink',
                    )}
                  >
                    <span
                      className="size-1.5 shrink-0 rounded-full"
                      style={{ background: EVENT_TYPE_COLOR[event.type] }}
                    />
                    <span className="truncate">{EVENT_TYPE_LABELS[event.type]}</span>
                  </span>
                ))}
                {dayEvents.length > 2 && (
                  <span className="text-[10px] text-stone">+{dayEvents.length - 2} más</span>
                )}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
