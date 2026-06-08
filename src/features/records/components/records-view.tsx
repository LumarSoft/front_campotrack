'use client'

import { useState } from 'react'
import { Check, CloudOff, Plus, RefreshCw, Trash2, TriangleAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { PILL_PRIMARY } from '@/components/ui/pill-button'
import { PageHeader } from '@/components/layout/page-header'
import { useFields } from '@/features/fields/hooks/use-fields-queries'
import { useAuthStore } from '@/features/auth/store/use-auth-store'
import { canModifyByRole } from '@/features/auth/roles'
import { eventDateKey } from '@/features/calendar/date-utils'
import { useRecords } from '@/features/records/hooks/use-records-queries'
import { useDeleteRecord } from '@/features/records/hooks/use-record-mutations'
import { usePendingRecordsStore } from '@/features/records/store/use-pending-records-store'
import { useRecordComposerStore } from '@/features/records/store/use-record-composer-store'
import { summarizeRecord, RECORD_SUBTYPE_LABELS, RECORD_SUBTYPE_ORDER } from '@/features/records/record-config'
import { RecordRow } from './record-row'
import type { FieldRecord, RecordSubtype } from '@/types/api/records'

const ALL = 'all'

export function RecordsView(): React.JSX.Element {
  const role = useAuthStore(state => state.user?.role ?? 'PRODUCER')
  const openComposer = useRecordComposerStore(state => state.openComposer)

  const pendingItems = usePendingRecordsStore(state => state.items)
  const retryPending = usePendingRecordsStore(state => state.retry)
  const removePending = usePendingRecordsStore(state => state.remove)

  const [fieldFilter, setFieldFilter] = useState<string>(ALL)
  const [subtypeFilter, setSubtypeFilter] = useState<string>(ALL)
  const [pendingDelete, setPendingDelete] = useState<FieldRecord | null>(null)

  const fieldsQuery = useFields()
  const deleteRecord = useDeleteRecord()
  const recordsQuery = useRecords({
    fieldId: fieldFilter === ALL ? undefined : Number(fieldFilter),
    subtype: subtypeFilter === ALL ? undefined : (subtypeFilter as RecordSubtype),
  })

  const visiblePending = pendingItems.filter(
    item => subtypeFilter === ALL || item.display.subtype === subtypeFilter,
  )

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        kicker="Operativo"
        title="Registros de Campo"
        description="La bitácora del día a día. Cargás en el campo aunque no haya señal."
        actions={
          <Button className={PILL_PRIMARY} onClick={openComposer}>
            <Plus className="size-4" />
            Cargar registro
          </Button>
        }
      />

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
        <Select value={subtypeFilter} onValueChange={setSubtypeFilter}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Todos los tipos</SelectItem>
            {RECORD_SUBTYPE_ORDER.map(subtype => (
              <SelectItem key={subtype} value={subtype}>
                {RECORD_SUBTYPE_LABELS[subtype]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Pending / errored local records, waiting to sync. */}
      {visiblePending.map(item => (
        <RecordRow
          key={item.clientId}
          subtype={item.display.subtype}
          dateKey={item.display.recordDate}
          fieldLabel={item.display.fieldLabel}
          summary={item.display.summary}
          badge={
            item.status === 'ERROR' ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-destructive/30 bg-destructive/10 px-2 py-0.5 text-[11px] text-destructive">
                <TriangleAlert className="size-3" />
                Error
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full border border-wheat/40 bg-wheat/15 px-2 py-0.5 text-[11px] text-[#8a5a1a]">
                <CloudOff className="size-3" />
                Pendiente
              </span>
            )
          }
          actions={
            <div className="flex gap-1">
              {item.status === 'ERROR' && (
                <Button variant="ghost" size="icon" className="size-8 text-stone hover:text-ink" onClick={() => retryPending(item.clientId)} aria-label="Reintentar">
                  <RefreshCw className="size-4" />
                </Button>
              )}
              <Button variant="ghost" size="icon" className="size-8 text-stone hover:text-destructive" onClick={() => removePending(item.clientId)} aria-label="Descartar">
                <Trash2 className="size-4" />
              </Button>
            </div>
          }
        />
      ))}

      {recordsQuery.isLoading ? (
        <div className="space-y-3">
          {[0, 1, 2].map(i => (
            <Skeleton key={i} className="h-24 w-full rounded-2xl bg-[color-mix(in_srgb,var(--stone)_14%,var(--bone))]" />
          ))}
        </div>
      ) : recordsQuery.isError ? (
        <div className="rounded-2xl border border-hairline-on-bone p-10 text-center text-sm text-destructive">
          No pudimos cargar la bitácora. {recordsQuery.error.message}
        </div>
      ) : (recordsQuery.data?.length ?? 0) === 0 && visiblePending.length === 0 ? (
        <div className="rounded-2xl border border-hairline-on-bone p-12 text-center">
          <p className="font-display text-lg font-semibold text-ink">Sin registros todavía</p>
          <p className="mt-1 text-sm text-stone">Cargá tu primer registro operativo.</p>
        </div>
      ) : (
        recordsQuery.data?.map(record => (
          <RecordRow
            key={record.id}
            subtype={record.subtype}
            dateKey={eventDateKey(record.recordDate)}
            fieldLabel={`${record.campaign.fieldName} · ${record.campaign.cropName} ${record.campaign.cycle}`}
            summary={summarizeRecord(record.subtype, record.data)}
            badge={
              <span className="inline-flex items-center gap-1 rounded-full border border-clay/25 bg-clay/10 px-2 py-0.5 text-[11px] text-field">
                <Check className="size-3" />
                Sincronizado
              </span>
            }
            actions={
              canModifyByRole(role, record.creatorRole) && (
                <Button variant="ghost" size="icon" className="size-8 text-stone hover:text-destructive" onClick={() => setPendingDelete(record)} aria-label="Eliminar">
                  <Trash2 className="size-4" />
                </Button>
              )
            }
          />
        ))
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        onOpenChange={openState => !openState && setPendingDelete(null)}
        title="Eliminar registro"
        description="¿Eliminar este registro de la bitácora?"
        loading={deleteRecord.isPending}
        onConfirm={() => {
          if (!pendingDelete) return
          deleteRecord.mutate(pendingDelete.id, { onSuccess: () => setPendingDelete(null) })
        }}
      />
    </div>
  )
}
