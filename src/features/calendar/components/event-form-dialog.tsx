'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PILL_PRIMARY } from '@/components/ui/pill-button'
import { useCreateEvent, useUpdateEvent } from '@/features/calendar/hooks/use-event-mutations'
import { ALARM_LABELS, ALARM_ORDER, EVENT_TYPE_LABELS, EVENT_TYPE_ORDER } from '@/features/calendar/event-config'
import type { Campaign } from '@/types/api/campaigns'
import type { AlarmType, CalendarEvent, EventType } from '@/types/api/events'

interface EventFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  campaigns: Campaign[]
  /** Provided when editing an existing event. */
  event?: CalendarEvent
  /** Date key (YYYY-MM-DD) prefilled when creating from a day cell. */
  defaultDate?: string
}

export function EventFormDialog({
  open,
  onOpenChange,
  campaigns,
  event,
  defaultDate,
}: EventFormDialogProps): React.JSX.Element {
  const isEdit = event !== undefined
  const createEvent = useCreateEvent()
  const updateEvent = useUpdateEvent()
  const mutation = isEdit ? updateEvent : createEvent

  const [campaignId, setCampaignId] = useState('')
  const [type, setType] = useState<EventType>('SOWING')
  const [plannedDate, setPlannedDate] = useState('')
  const [alarms, setAlarms] = useState<AlarmType[]>([])
  const [note, setNote] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [wasOpen, setWasOpen] = useState(false)

  if (open && !wasOpen) {
    setWasOpen(true)
    setCampaignId(event ? String(event.campaign.id) : '')
    setType(event?.type ?? 'SOWING')
    setPlannedDate(event ? event.plannedDate.slice(0, 10) : (defaultDate ?? ''))
    setAlarms(event?.alarms ?? [])
    setNote(event?.note ?? '')
    setError(null)
  } else if (!open && wasOpen) {
    setWasOpen(false)
  }

  const toggleAlarm = (alarm: AlarmType): void => {
    setAlarms(current => (current.includes(alarm) ? current.filter(a => a !== alarm) : [...current, alarm]))
  }

  const handleSubmit = (event_: React.FormEvent): void => {
    event_.preventDefault()
    if (!isEdit && !campaignId) return setError('Elegí una campaña.')
    if (!plannedDate) return setError('Elegí una fecha.')

    const onSuccess = (): void => onOpenChange(false)
    if (isEdit) {
      updateEvent.mutate(
        { id: event.id, payload: { type, plannedDate, alarms, note: note.trim() || undefined } },
        { onSuccess },
      )
    } else {
      createEvent.mutate(
        { campaignId: Number(campaignId), type, plannedDate, alarms, note: note.trim() || undefined },
        { onSuccess },
      )
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar evento' : 'Nuevo evento'}</DialogTitle>
          <DialogDescription>Siembra, fertilización, fitosanitario, cosecha o vencimientos.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Campaña</Label>
            {isEdit ? (
              <p className="rounded-md border border-hairline-on-bone px-3 py-2 text-sm text-stone">
                {event.campaign.fieldName} · {event.campaign.cropName} {event.campaign.cycle}
              </p>
            ) : campaigns.length > 0 ? (
              <Select value={campaignId} onValueChange={setCampaignId}>
                <SelectTrigger>
                  <SelectValue placeholder="Elegí una campaña" />
                </SelectTrigger>
                <SelectContent>
                  {campaigns.map(campaign => (
                    <SelectItem key={campaign.id} value={String(campaign.id)}>
                      {campaign.fieldName} · {campaign.crop.name} {campaign.cycle}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <p className="rounded-md border border-dashed border-hairline-on-bone px-3 py-2 text-sm text-stone">
                Primero creá una campaña en Campos y Campañas.
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select value={type} onValueChange={value => setType(value as EventType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EVENT_TYPE_ORDER.map(eventType => (
                    <SelectItem key={eventType} value={eventType}>
                      {EVENT_TYPE_LABELS[eventType]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="event-date">Fecha planificada</Label>
              <Input id="event-date" type="date" value={plannedDate} onChange={e => setPlannedDate(e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Alarmas</Label>
            <div className="flex flex-wrap gap-2">
              {ALARM_ORDER.map(alarm => {
                const active = alarms.includes(alarm)
                return (
                  <button
                    key={alarm}
                    type="button"
                    onClick={() => toggleAlarm(alarm)}
                    className={
                      active
                        ? 'rounded-full bg-clay px-3 py-1 text-xs font-medium text-bone'
                        : 'rounded-full border border-hairline-on-bone px-3 py-1 text-xs text-stone hover:text-ink'
                    }
                  >
                    {ALARM_LABELS[alarm]}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="event-note">Nota (opcional)</Label>
            <textarea
              id="event-note"
              value={note}
              onChange={e => setNote(e.target.value)}
              rows={2}
              className="w-full rounded-md border border-hairline-on-bone bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={mutation.isPending}>
              Cancelar
            </Button>
            <Button type="submit" className={PILL_PRIMARY} disabled={mutation.isPending || (!isEdit && campaigns.length === 0)}>
              {isEdit ? 'Guardar cambios' : 'Crear evento'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
