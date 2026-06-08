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
import { usePostponeEvent } from '@/features/calendar/hooks/use-event-mutations'
import { POSTPONEMENT_CAUSE_LABELS, POSTPONEMENT_CAUSE_ORDER } from '@/features/calendar/event-config'
import type { CalendarEvent, PostponementCause } from '@/types/api/events'

interface PostponeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  event: CalendarEvent | null
}

export function PostponeDialog({ open, onOpenChange, event }: PostponeDialogProps): React.JSX.Element {
  const postpone = usePostponeEvent()
  const [newDate, setNewDate] = useState('')
  const [cause, setCause] = useState<PostponementCause>('WEATHER_DROUGHT')
  const [note, setNote] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [wasOpen, setWasOpen] = useState(false)

  if (open && !wasOpen) {
    setWasOpen(true)
    setNewDate(event ? event.plannedDate.slice(0, 10) : '')
    setCause('WEATHER_DROUGHT')
    setNote('')
    setError(null)
  } else if (!open && wasOpen) {
    setWasOpen(false)
  }

  const handleSubmit = (formEvent: React.FormEvent): void => {
    formEvent.preventDefault()
    if (!event) return
    if (!newDate) return setError('Elegí la nueva fecha.')
    postpone.mutate(
      { id: event.id, payload: { newDate, cause, note: note.trim() || undefined } },
      { onSuccess: () => onOpenChange(false) },
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Aplazar evento</DialogTitle>
          <DialogDescription>Registrá la nueva fecha y la causa del aplazamiento.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="postpone-date">Nueva fecha</Label>
            <Input id="postpone-date" type="date" value={newDate} onChange={e => setNewDate(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Causa</Label>
            <Select value={cause} onValueChange={value => setCause(value as PostponementCause)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {POSTPONEMENT_CAUSE_ORDER.map(item => (
                  <SelectItem key={item} value={item}>
                    {POSTPONEMENT_CAUSE_LABELS[item]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="postpone-note">Nota (opcional)</Label>
            <textarea
              id="postpone-note"
              value={note}
              onChange={e => setNote(e.target.value)}
              rows={2}
              className="w-full rounded-md border border-hairline-on-bone bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={postpone.isPending}>
              Cancelar
            </Button>
            <Button type="submit" disabled={postpone.isPending}>
              Aplazar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
