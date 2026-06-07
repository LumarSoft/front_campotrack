'use client'

import { useState } from 'react'
import { toast } from 'sonner'
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
import { useOnlineStatus } from '@/hooks/use-online-status'
import { useCampaigns } from '@/features/calendar/hooks/use-calendar-queries'
import { useRecordComposerStore } from '@/features/records/store/use-record-composer-store'
import { usePendingRecordsStore } from '@/features/records/store/use-pending-records-store'
import { RECORD_FIELDS, RECORD_SUBTYPE_LABELS, RECORD_SUBTYPE_ORDER, summarizeRecord } from '@/features/records/record-config'
import type { CreateRecordRequest, RecordSubtype } from '@/types/api/records'

function todayKey(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

/**
 * Global "+ Cargar registro" composer. Saves the record to the offline queue
 * (so it works without signal); the sync engine flushes it when back online.
 */
export function RecordComposer(): React.JSX.Element {
  const open = useRecordComposerStore(state => state.open)
  const closeComposer = useRecordComposerStore(state => state.closeComposer)
  const enqueue = usePendingRecordsStore(state => state.enqueue)
  const isOnline = useOnlineStatus()
  const campaignsQuery = useCampaigns()
  const campaigns = campaignsQuery.data ?? []

  const [campaignId, setCampaignId] = useState('')
  const [subtype, setSubtype] = useState<RecordSubtype>('SOWING')
  const [recordDate, setRecordDate] = useState('')
  const [values, setValues] = useState<Record<string, string>>({})
  const [error, setError] = useState<string | null>(null)
  const [wasOpen, setWasOpen] = useState(false)

  if (open && !wasOpen) {
    setWasOpen(true)
    setCampaignId('')
    setSubtype('SOWING')
    setRecordDate(todayKey())
    setValues({})
    setError(null)
  } else if (!open && wasOpen) {
    setWasOpen(false)
  }

  const fields = RECORD_FIELDS[subtype]
  const setValue = (key: string, value: string): void => setValues(current => ({ ...current, [key]: value }))

  const handleSubmit = (formEvent: React.FormEvent): void => {
    formEvent.preventDefault()
    if (!campaignId) return setError('Elegí una campaña.')
    if (!recordDate) return setError('Elegí una fecha.')

    const data: Record<string, unknown> = {}
    for (const field of fields) {
      const raw = values[field.key]?.trim() ?? ''
      if (!raw) {
        if (field.required) return setError(`Completá "${field.label}".`)
        continue
      }
      data[field.key] = field.kind === 'number' ? Number(raw) : raw
    }

    const campaign = campaigns.find(c => c.id === Number(campaignId))
    const payload: CreateRecordRequest = {
      subtype,
      campaignId: Number(campaignId),
      recordDate,
      data,
      clientUpdatedAt: new Date().toISOString(),
    }

    enqueue({
      clientId: crypto.randomUUID(),
      payload,
      display: {
        subtype,
        recordDate,
        fieldLabel: campaign ? `${campaign.fieldName} · ${campaign.crop.name} ${campaign.cycle}` : '',
        summary: summarizeRecord(subtype, data),
      },
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    })

    toast[isOnline ? 'success' : 'info'](
      isOnline ? 'Registro guardado' : 'Guardado sin conexión. Se sincronizará al reconectar.',
    )
    closeComposer()
  }

  return (
    <Dialog open={open} onOpenChange={value => (value ? undefined : closeComposer())}>
      <DialogContent className="max-h-[90svh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cargar registro</DialogTitle>
          <DialogDescription>Carga operativa del día. Funciona sin conexión.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select value={subtype} onValueChange={value => setSubtype(value as RecordSubtype)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RECORD_SUBTYPE_ORDER.map(item => (
                    <SelectItem key={item} value={item}>
                      {RECORD_SUBTYPE_LABELS[item]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="record-date">Fecha</Label>
              <Input id="record-date" type="date" value={recordDate} onChange={e => setRecordDate(e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Campaña</Label>
            {campaigns.length > 0 ? (
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

          {fields.map(field => (
            <div key={field.key} className="space-y-2">
              <Label htmlFor={`record-${field.key}`}>
                {field.label}
                {!field.required && <span className="text-stone"> (opcional)</span>}
              </Label>
              {field.kind === 'select' ? (
                <Select value={values[field.key] ?? ''} onValueChange={value => setValue(field.key, value)}>
                  <SelectTrigger id={`record-${field.key}`}>
                    <SelectValue placeholder="Elegí una opción" />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id={`record-${field.key}`}
                  type={field.kind === 'number' ? 'number' : 'text'}
                  step={field.kind === 'number' ? 'any' : undefined}
                  placeholder={field.placeholder}
                  value={values[field.key] ?? ''}
                  onChange={e => setValue(field.key, e.target.value)}
                />
              )}
            </div>
          ))}

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={closeComposer}>
              Cancelar
            </Button>
            <Button type="submit" className={PILL_PRIMARY} disabled={campaigns.length === 0}>
              Guardar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
