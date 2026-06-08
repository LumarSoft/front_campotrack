'use client'

import { Bell, CalendarClock, Check, MoreVertical, Pencil, Trash2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { formatDayLong } from '@/features/calendar/date-utils'
import { EVENT_TYPE_COLOR, EVENT_TYPE_LABELS, STATUS_LABELS } from '@/features/calendar/event-config'
import { canModifyByRole } from '@/features/auth/roles'
import { cn } from '@/lib/utils'
import type { UserRole } from '@/types/api/common'
import type { CalendarEvent } from '@/types/api/events'

interface DayAgendaProps {
  dateKey: string
  events: CalendarEvent[]
  role: UserRole
  onEdit: (event: CalendarEvent) => void
  onPostpone: (event: CalendarEvent) => void
  onDelete: (event: CalendarEvent) => void
  onMarkDone: (event: CalendarEvent) => void
}

function statusStyle(event: CalendarEvent): string {
  if (event.overdue) return 'border-destructive/30 bg-destructive/10 text-destructive'
  if (event.status === 'DONE') return 'border-clay/25 bg-clay/10 text-field'
  if (event.status === 'POSTPONED') return 'border-wheat/40 bg-wheat/15 text-[#8a5a1a]'
  return 'border-hairline-on-bone text-stone'
}

export function DayAgenda({
  dateKey,
  events,
  role,
  onEdit,
  onPostpone,
  onDelete,
  onMarkDone,
}: DayAgendaProps): React.JSX.Element {
  return (
    <div className="space-y-3">
      <h2 className="font-display text-lg font-semibold capitalize text-ink">{formatDayLong(dateKey)}</h2>

      {events.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-hairline-on-bone p-6 text-center text-sm text-stone">
          Sin eventos este día.
        </p>
      ) : (
        events.map(event => {
          const canModify = canModifyByRole(role, event.creatorRole)
          return (
            <article key={event.id} className="rounded-2xl border border-hairline-on-bone p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="size-2.5 shrink-0 rounded-full" style={{ background: EVENT_TYPE_COLOR[event.type] }} />
                    <span className="font-medium text-ink">{EVENT_TYPE_LABELS[event.type]}</span>
                    <span className={cn('rounded-full border px-2 py-0.5 text-[11px]', statusStyle(event))}>
                      {event.overdue ? 'Vencido' : STATUS_LABELS[event.status]}
                    </span>
                  </div>
                  <p className="truncate text-sm text-stone">
                    {event.campaign.fieldName} · {event.campaign.cropName} {event.campaign.cycle}
                    {event.subdivision ? ` · Lote ${event.subdivision.name}` : ''}
                  </p>
                  {event.note && <p className="text-sm text-ink/80">{event.note}</p>}
                  {event.alarms.length > 0 && (
                    <p className="flex items-center gap-1 text-xs text-stone">
                      <Bell className="size-3" />
                      {event.alarms.length} alarma{event.alarms.length > 1 ? 's' : ''}
                    </p>
                  )}
                </div>

                {canModify && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-8 shrink-0 text-stone" aria-label="Acciones">
                        <MoreVertical className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {event.status !== 'DONE' && (
                        <DropdownMenuItem onClick={() => onMarkDone(event)}>
                          <Check className="size-4" />
                          Marcar hecho
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => onPostpone(event)}>
                        <CalendarClock className="size-4" />
                        Aplazar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(event)}>
                        <Pencil className="size-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem variant="destructive" onClick={() => onDelete(event)}>
                        <Trash2 className="size-4" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </article>
          )
        })
      )}
    </div>
  )
}
