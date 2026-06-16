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
import { SearchableSelect } from '@/components/ui/searchable-select'
import { PILL_PRIMARY } from '@/components/ui/pill-button'
import { useOnlineStatus } from '@/hooks/use-online-status'
import { useFields, useField } from '@/features/fields/hooks/use-fields-queries'
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
 * Global "+ Cargar registro" composer. A record is anchored to a field and,
 * optionally, to one of its lotes — no campaign required. Saves to the offline
 * queue; the sync engine flushes it when back online.
 */
export function RecordComposer(): React.JSX.Element {
  const open = useRecordComposerStore(state => state.open)
  const closeComposer = useRecordComposerStore(state => state.closeComposer)
  const enqueue = usePendingRecordsStore(state => state.enqueue)
  const isOnline = useOnlineStatus()

  const fieldsQuery = useFields()
  const fields = fieldsQuery.data ?? []

  const [fieldId, setFieldId] = useState('')
  const [subdivisionId, setSubdivisionId] = useState('')
  const [campaignId, setCampaignId] = useState('')
  const [subtype, setSubtype] = useState<RecordSubtype>('SOWING')
  const [recordDate, setRecordDate] = useState('')
  const [values, setValues] = useState<Record<string, string>>({})
  const [error, setError] = useState<string | null>(null)
  const [wasOpen, setWasOpen] = useState(false)

  const fieldDetailQuery = useField(fieldId ? Number(fieldId) : Number.NaN)
  const lotes = fieldDetailQuery.data?.subdivisions ?? []

  const campaignsQuery = useCampaigns(fieldId ? Number(fieldId) : undefined)
  // Campaigns relevant to the chosen scope: those of the selected lote (or the
  // whole field) so a Siembra record can feed that campaign's progress.
  const campaigns = (fieldId ? (campaignsQuery.data ?? []) : []).filter(campaign =>
    subdivisionId ? campaign.subdivisionId === Number(subdivisionId) || campaign.subdivisionId === null : true,
  )

  if (open && !wasOpen) {
    setWasOpen(true)
    setFieldId('')
    setSubdivisionId('')
    setCampaignId('')
    setSubtype('SOWING')
    setRecordDate(todayKey())
    setValues({})
    setError(null)
  } else if (!open && wasOpen) {
    setWasOpen(false)
  }

  const fields_ = RECORD_FIELDS[subtype]
  const setValue = (key: string, value: string): void => setValues(current => ({ ...current, [key]: value }))

  const fieldOptions = fields.map(field => ({ value: String(field.id), label: field.name }))

  const handleFieldChange = (value: string): void => {
    setFieldId(value)
    setSubdivisionId('')
    setCampaignId('')
  }

  const handleLoteChange = (value: string): void => {
    setSubdivisionId(value === 'none' ? '' : value)
    setCampaignId('')
  }

  const handleSubmit = (formEvent: React.FormEvent): void => {
    formEvent.preventDefault()
    if (!fieldId) return setError('Elegí un campo.')
    if (!recordDate) return setError('Elegí una fecha.')

    const data: Record<string, unknown> = {}
    for (const field of fields_) {
      const raw = values[field.key]?.trim() ?? ''
      if (!raw) {
        if (field.required) return setError(`Completá "${field.label}".`)
        continue
      }
      data[field.key] = field.kind === 'number' ? Number(raw) : raw
    }

    const selectedField = fields.find(item => item.id === Number(fieldId))
    const selectedLote = lotes.find(item => item.id === Number(subdivisionId))
    const payload: CreateRecordRequest = {
      subtype,
      fieldId: Number(fieldId),
      subdivisionId: subdivisionId ? Number(subdivisionId) : undefined,
      campaignId: campaignId ? Number(campaignId) : undefined,
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
        fieldLabel: [selectedField?.name, selectedLote?.name].filter(Boolean).join(' · '),
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
            <Label htmlFor="record-field">Campo</Label>
            {fields.length > 0 ? (
              <SearchableSelect
                id="record-field"
                options={fieldOptions}
                value={fieldId}
                onChange={handleFieldChange}
                placeholder="Elegí un campo"
                searchPlaceholder="Buscar campo…"
              />
            ) : (
              <p className="rounded-md border border-dashed border-hairline-on-bone px-3 py-2 text-sm text-stone">
                Primero creá un campo en Campos y Campañas.
              </p>
            )}
          </div>

          {fieldId && lotes.length > 0 && (
            <div className="space-y-2">
              <Label>Lote (opcional)</Label>
              <Select value={subdivisionId || 'none'} onValueChange={handleLoteChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Todo el campo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Todo el campo</SelectItem>
                  {lotes.map(lote => (
                    <SelectItem key={lote.id} value={String(lote.id)}>
                      {lote.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {fieldId && campaigns.length > 0 && (
            <div className="space-y-2">
              <Label>Campaña (opcional)</Label>
              <Select value={campaignId || 'none'} onValueChange={value => setCampaignId(value === 'none' ? '' : value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sin campaña" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sin campaña</SelectItem>
                  {campaigns.map(campaign => (
                    <SelectItem key={campaign.id} value={String(campaign.id)}>
                      {campaign.crop.name} {campaign.cycle}
                      {campaign.subdivisionName ? ` · Lote ${campaign.subdivisionName}` : ' · Todo el campo'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {subtype === 'SOWING' && (
                <p className="text-xs text-stone">Asociá la siembra a una campaña para ver su avance.</p>
              )}
            </div>
          )}

          {fields_.map(field => (
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
            <Button type="submit" className={PILL_PRIMARY} disabled={fields.length === 0}>
              Guardar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
