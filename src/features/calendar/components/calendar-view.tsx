'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { PILL_PRIMARY } from '@/components/ui/pill-button'
import { PageHeader } from '@/components/layout/page-header'
import { useFields } from '@/features/fields/hooks/use-fields-queries'
import { useAuthStore } from '@/features/auth/store/use-auth-store'
import { useEvents, useCampaigns } from '@/features/calendar/hooks/use-calendar-queries'
import { useDeleteEvent, useUpdateEvent } from '@/features/calendar/hooks/use-event-mutations'
import { addMonths, eventDateKey, formatMonthYear, gridRange, toDateKey } from '@/features/calendar/date-utils'
import { EVENT_TYPE_COLOR, EVENT_TYPE_LABELS, EVENT_TYPE_ORDER } from '@/features/calendar/event-config'
import { MonthGrid } from './month-grid'
import { DayAgenda } from './day-agenda'
import { EventFormDialog } from './event-form-dialog'
import { PostponeDialog } from './postpone-dialog'
import type { CalendarEvent, EventType } from '@/types/api/events'

const ALL = 'all'

export function CalendarView(): React.JSX.Element {
  const role = useAuthStore(state => state.user?.role ?? 'PRODUCER')

  const [month, setMonth] = useState(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  })
  const [selectedKey, setSelectedKey] = useState(() => toDateKey(new Date()))
  const [fieldFilter, setFieldFilter] = useState<string>(ALL)
  const [typeFilter, setTypeFilter] = useState<string>(ALL)

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<CalendarEvent | undefined>(undefined)
  const [postponeOpen, setPostponeOpen] = useState(false)
  const [postponeTarget, setPostponeTarget] = useState<CalendarEvent | null>(null)
  const [pendingDelete, setPendingDelete] = useState<CalendarEvent | null>(null)

  const range = gridRange(month)
  const eventsQuery = useEvents({
    from: range.from,
    to: range.to,
    fieldId: fieldFilter === ALL ? undefined : Number(fieldFilter),
    type: typeFilter === ALL ? undefined : (typeFilter as EventType),
  })
  const campaignsQuery = useCampaigns()
  const fieldsQuery = useFields()

  const updateEvent = useUpdateEvent()
  const deleteEvent = useDeleteEvent()

  const events = eventsQuery.data ?? []
  const dayEvents = events.filter(event => eventDateKey(event.plannedDate) === selectedKey)

  const openCreate = (): void => {
    setEditing(undefined)
    setFormOpen(true)
  }
  const openEdit = (event: CalendarEvent): void => {
    setEditing(event)
    setFormOpen(true)
  }
  const openPostpone = (event: CalendarEvent): void => {
    setPostponeTarget(event)
    setPostponeOpen(true)
  }
  const markDone = (event: CalendarEvent): void => {
    updateEvent.mutate({ id: event.id, payload: { status: 'DONE' } })
  }
  const goToday = (): void => {
    const now = new Date()
    setMonth(new Date(now.getFullYear(), now.getMonth(), 1))
    setSelectedKey(toDateKey(now))
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        kicker="Operativo"
        title="Calendario"
        description="Siembra, fertilización, fitosanitarios, cosecha y vencimientos, con alarmas."
        actions={
          <Button className={PILL_PRIMARY} onClick={openCreate}>
            <Plus className="size-4" />
            Nuevo evento
          </Button>
        }
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="rounded-full" onClick={() => setMonth(addMonths(month, -1))} aria-label="Mes anterior">
            <ChevronLeft className="size-4" />
          </Button>
          <span className="min-w-44 text-center font-display text-lg font-semibold capitalize text-ink">
            {formatMonthYear(month)}
          </span>
          <Button variant="outline" size="icon" className="rounded-full" onClick={() => setMonth(addMonths(month, 1))} aria-label="Mes siguiente">
            <ChevronRight className="size-4" />
          </Button>
          <Button variant="ghost" className="text-stone hover:text-ink" onClick={goToday}>
            Hoy
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          <Select value={fieldFilter} onValueChange={setFieldFilter}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Campo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Todos los campos</SelectItem>
              {fieldsQuery.data?.map(field => (
                <SelectItem key={field.id} value={String(field.id)}>
                  {field.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Todos los tipos</SelectItem>
              {EVENT_TYPE_ORDER.map(type => (
                <SelectItem key={type} value={type}>
                  {EVENT_TYPE_LABELS[type]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1.5">
        {EVENT_TYPE_ORDER.map(type => (
          <span key={type} className="flex items-center gap-1.5 text-xs text-stone">
            <span className="size-2.5 rounded-full" style={{ background: EVENT_TYPE_COLOR[type] }} />
            {EVENT_TYPE_LABELS[type]}
          </span>
        ))}
      </div>

      {eventsQuery.isError ? (
        <div className="rounded-2xl border border-hairline-on-bone p-10 text-center text-sm text-destructive">
          No pudimos cargar el calendario. {eventsQuery.error.message}
        </div>
      ) : (
        <div data-tour="calendar-body" className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {eventsQuery.isLoading ? (
              <Skeleton className="h-[28rem] w-full rounded-2xl bg-[color-mix(in_srgb,var(--stone)_14%,var(--bone))]" />
            ) : (
              <MonthGrid month={month} events={events} selectedKey={selectedKey} onSelectDay={setSelectedKey} />
            )}
          </div>
          <div className="lg:col-span-1">
            <DayAgenda
              dateKey={selectedKey}
              events={dayEvents}
              role={role}
              onEdit={openEdit}
              onPostpone={openPostpone}
              onDelete={setPendingDelete}
              onMarkDone={markDone}
            />
          </div>
        </div>
      )}

      <EventFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        campaigns={campaignsQuery.data ?? []}
        event={editing}
        defaultDate={selectedKey}
      />
      <PostponeDialog open={postponeOpen} onOpenChange={setPostponeOpen} event={postponeTarget} />
      <ConfirmDialog
        open={pendingDelete !== null}
        onOpenChange={openState => !openState && setPendingDelete(null)}
        title="Eliminar evento"
        description={`¿Eliminar el evento ${pendingDelete ? EVENT_TYPE_LABELS[pendingDelete.type] : ''}?`}
        loading={deleteEvent.isPending}
        onConfirm={() => {
          if (!pendingDelete) return
          deleteEvent.mutate(pendingDelete.id, { onSuccess: () => setPendingDelete(null) })
        }}
      />
    </div>
  )
}
