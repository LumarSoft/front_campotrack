'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Pencil, Plus, Trash2 } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { PILL_PRIMARY } from '@/components/ui/pill-button'
import { useField, useCrops } from '@/features/fields/hooks/use-fields-queries'
import { useRemoveSubdivision } from '@/features/fields/hooks/use-field-mutations'
import { useDeleteCampaign } from '@/features/fields/hooks/use-campaign-mutations'
import { useRecords } from '@/features/records/hooks/use-records-queries'
import { useAuthStore } from '@/features/auth/store/use-auth-store'
import { canManageFields, canModifyByRole } from '@/features/auth/roles'
import { SubdivisionFormDialog } from './subdivision-form-dialog'
import { CampaignFormDialog } from './campaign-form-dialog'
import type { FieldRecord } from '@/types/api/records'
import type { FieldCampaign, Subdivision } from '@/types/api/fields'

function formatDate(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

/** Hectares sown for a campaign = sum of its SOWING records' `ha`. */
function sownHaForCampaign(records: FieldRecord[], campaignId: number): number {
  const total = records
    .filter(record => record.subtype === 'SOWING' && record.campaign?.id === campaignId)
    .reduce((sum, record) => {
      const ha = record.data.ha
      return sum + (typeof ha === 'number' && Number.isFinite(ha) ? ha : 0)
    }, 0)
  return Math.round(total * 100) / 100
}

export function FieldDetailView({ fieldId }: { fieldId: number }): React.JSX.Element {
  const role = useAuthStore(state => state.user?.role ?? 'PRODUCER')
  const fieldQuery = useField(fieldId)
  const cropsQuery = useCrops()

  const recordsQuery = useRecords({ fieldId })
  const records = recordsQuery.data ?? []

  const removeSubdivision = useRemoveSubdivision(fieldId)
  const deleteCampaign = useDeleteCampaign(fieldId)

  const [subOpen, setSubOpen] = useState(false)
  const [editingSub, setEditingSub] = useState<Subdivision | undefined>(undefined)
  const [campaignOpen, setCampaignOpen] = useState(false)
  const [pendingSub, setPendingSub] = useState<Subdivision | null>(null)
  const [pendingCampaign, setPendingCampaign] = useState<FieldCampaign | null>(null)

  if (fieldQuery.isLoading) {
    return <Skeleton className="mx-auto h-96 max-w-4xl rounded-2xl bg-[color-mix(in_srgb,var(--stone)_14%,var(--bone))]" />
  }
  if (fieldQuery.isError || !fieldQuery.data) {
    return (
      <div className="mx-auto max-w-4xl rounded-2xl border border-hairline-on-bone p-10 text-center text-sm text-destructive">
        No pudimos cargar el campo. {fieldQuery.error?.message}
      </div>
    )
  }

  const field = fieldQuery.data
  const canManage = canManageFields(role)
  const assignedHa = Math.round(field.subdivisions.reduce((sum, sub) => sum + sub.ha, 0) * 100) / 100
  const remainingHa = Math.round((field.totalHa - assignedHa) * 100) / 100

  const openCreateSub = (): void => {
    setEditingSub(undefined)
    setSubOpen(true)
  }
  const openEditSub = (sub: Subdivision): void => {
    setEditingSub(sub)
    setSubOpen(true)
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="space-y-4">
        <Link
          href="/campos"
          className="inline-flex items-center gap-1.5 text-sm text-stone underline-offset-4 transition-colors hover:text-ink hover:underline"
        >
          <ArrowLeft className="size-4" />
          Volver a campos
        </Link>
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-hairline-on-bone pb-6">
          <div>
            <p className="kicker text-clay">Campo</p>
            <h1 className="font-display mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">{field.name}</h1>
            <p className="mt-2 font-sans text-[0.95rem] text-stone">{field.totalHa} ha</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {field.clients.length > 0 ? (
              field.clients.map(client => (
                <span
                  key={client.id}
                  className="rounded-full border border-hairline-on-bone px-2.5 py-0.5 text-xs text-stone"
                >
                  {client.name}
                </span>
              ))
            ) : (
              <span className="rounded-full border border-hairline-on-bone px-2.5 py-0.5 text-xs text-stone">
                Sin cliente
              </span>
            )}
          </div>
        </div>
      </div>

      <Tabs defaultValue="resumen">
        <TabsList>
          <TabsTrigger value="resumen">Resumen</TabsTrigger>
          <TabsTrigger value="lotes">Lotes</TabsTrigger>
          <TabsTrigger value="campanias">Campañas</TabsTrigger>
        </TabsList>

        <TabsContent value="resumen" className="mt-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <Metric label="Lotes" value={String(field.subdivisions.length)} />
            <Metric label="Hectáreas asignadas" value={`${assignedHa} / ${field.totalHa}`} />
            <Metric label="Campañas" value={String(field.campaigns.length)} />
          </div>
        </TabsContent>

        <TabsContent value="lotes" className="mt-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm text-stone">
              Asignado <span className="font-medium text-ink">{assignedHa} ha</span> de {field.totalHa} ha ·{' '}
              <span className="font-medium text-ink">{remainingHa} ha</span> disponibles
            </p>
            {canManage && (
              <Button className={PILL_PRIMARY} onClick={openCreateSub} disabled={remainingHa <= 0}>
                <Plus className="size-4" />
                Nuevo lote
              </Button>
            )}
          </div>

          <ul className="divide-y divide-hairline-on-bone rounded-2xl border border-hairline-on-bone">
            {field.subdivisions.map(sub => (
              <li key={sub.id} className="flex items-center justify-between px-6 py-3 text-sm">
                <span className="text-ink">
                  {sub.name} <span className="text-stone">· {sub.ha} ha</span>
                </span>
                {canModifyByRole(role, sub.creatorRole) && (
                  <span className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-stone hover:text-ink"
                      onClick={() => openEditSub(sub)}
                      aria-label="Editar"
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-stone hover:text-destructive"
                      onClick={() => setPendingSub(sub)}
                      aria-label="Eliminar"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </span>
                )}
              </li>
            ))}

            {remainingHa > 0 && (
              <li className="flex items-center justify-between bg-[color-mix(in_srgb,var(--stone)_8%,var(--bone))] px-6 py-3 text-sm">
                <span className="text-stone italic">
                  Sin asignar <span>· {remainingHa} ha</span>
                </span>
                {canManage && (
                  <Button variant="outline" size="sm" onClick={openCreateSub}>
                    <Plus className="size-4" />
                    Crear lote
                  </Button>
                )}
              </li>
            )}
          </ul>

          {remainingHa > 0 && (
            <p className="text-xs text-stone">
              Quedan {remainingHa} ha sin asignar. No pueden quedar hectáreas sueltas: asignalas creando lotes hasta
              cerrar el total del campo.
            </p>
          )}
        </TabsContent>

        <TabsContent value="campanias" className="mt-6 space-y-4">
          <div className="flex justify-end">
            <Button className={PILL_PRIMARY} onClick={() => setCampaignOpen(true)}>
              <Plus className="size-4" />
              Nueva campaña
            </Button>
          </div>

          {field.campaigns.length === 0 ? (
            <div className="rounded-2xl border border-hairline-on-bone p-10 text-center text-sm text-stone">
              Todavía no hay campañas en este campo.
            </div>
          ) : (
            field.campaigns.map(campaign => {
              const subdivision = campaign.subdivisionId
                ? field.subdivisions.find(s => s.id === campaign.subdivisionId)
                : null
              const sown = sownHaForCampaign(records, campaign.id)
              const pct = campaign.ha > 0 ? Math.min(100, Math.round((sown / campaign.ha) * 100)) : 0
              return (
                <article key={campaign.id} className="flex flex-col gap-4 rounded-2xl border border-hairline-on-bone p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="font-display font-semibold text-ink">
                        {campaign.crop.name} · {campaign.cycle}
                      </p>
                      <p className="text-sm text-stone">
                        {subdivision ? `Lote ${subdivision.name}` : 'Todo el campo'} · {campaign.ha} ha
                      </p>
                      <p className="text-xs text-stone">
                        Siembra {formatDate(campaign.sowingDateEst)} · Cosecha {formatDate(campaign.harvestDateEst)} · Fin
                        estimado {formatDate(campaign.endDateEst)}
                      </p>
                    </div>
                    {canModifyByRole(role, campaign.creatorRole) && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-stone hover:text-destructive"
                        onClick={() => setPendingCampaign(campaign)}
                        aria-label="Eliminar campaña"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-stone">
                      <span>Avance de siembra</span>
                      <span className="font-medium text-ink">
                        {sown} / {campaign.ha} ha ({pct}%)
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--stone)_18%,var(--bone))]">
                      <div className="h-full rounded-full bg-clay transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                </article>
              )
            })
          )}
        </TabsContent>
      </Tabs>

      <SubdivisionFormDialog
        open={subOpen}
        onOpenChange={setSubOpen}
        fieldId={fieldId}
        totalHa={field.totalHa}
        subdivisions={field.subdivisions}
        subdivision={editingSub}
      />
      <CampaignFormDialog
        open={campaignOpen}
        onOpenChange={setCampaignOpen}
        fieldId={fieldId}
        totalHa={field.totalHa}
        subdivisions={field.subdivisions}
        crops={cropsQuery.data ?? []}
      />

      <ConfirmDialog
        open={pendingSub !== null}
        onOpenChange={openState => !openState && setPendingSub(null)}
        title="Eliminar lote"
        description={`¿Eliminar el lote "${pendingSub?.name}"?`}
        loading={removeSubdivision.isPending}
        onConfirm={() => {
          if (!pendingSub) return
          removeSubdivision.mutate(pendingSub.id, { onSuccess: () => setPendingSub(null) })
        }}
      />
      <ConfirmDialog
        open={pendingCampaign !== null}
        onOpenChange={openState => !openState && setPendingCampaign(null)}
        title="Eliminar campaña"
        description={`¿Eliminar la campaña ${pendingCampaign?.crop.name} ${pendingCampaign?.cycle}?`}
        loading={deleteCampaign.isPending}
        onConfirm={() => {
          if (!pendingCampaign) return
          deleteCampaign.mutate(pendingCampaign.id, { onSuccess: () => setPendingCampaign(null) })
        }}
      />
    </div>
  )
}

function Metric({ label, value }: { label: string; value: string }): React.JSX.Element {
  return (
    <div className="rounded-2xl border border-hairline-on-bone p-6">
      <p className="font-display text-3xl font-bold text-ink">{value}</p>
      <p className="mt-1 text-sm text-stone">{label}</p>
    </div>
  )
}
