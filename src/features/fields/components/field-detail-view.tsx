'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, MapPin, Pencil, Plus, Trash2 } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { PILL_OUTLINE, PILL_PRIMARY } from '@/components/ui/pill-button'
import { useField, useCrops } from '@/features/fields/hooks/use-fields-queries'
import { useRemoveLocation, useRemoveSubdivision } from '@/features/fields/hooks/use-field-mutations'
import { useDeleteCampaign } from '@/features/fields/hooks/use-campaign-mutations'
import { useAuthStore } from '@/features/auth/store/use-auth-store'
import { canManageFields, canModifyByRole } from '@/features/auth/roles'
import { LocationFormDialog } from './location-form-dialog'
import { SubdivisionFormDialog } from './subdivision-form-dialog'
import { CampaignFormDialog } from './campaign-form-dialog'
import type { FieldCampaign, FieldLocation, Subdivision } from '@/types/api/fields'

function formatDate(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export function FieldDetailView({ fieldId }: { fieldId: number }): React.JSX.Element {
  const role = useAuthStore(state => state.user?.role ?? 'PRODUCER')
  const fieldQuery = useField(fieldId)
  const cropsQuery = useCrops()

  const removeLocation = useRemoveLocation(fieldId)
  const removeSubdivision = useRemoveSubdivision(fieldId)
  const deleteCampaign = useDeleteCampaign(fieldId)

  const [locationOpen, setLocationOpen] = useState(false)
  const [subOpen, setSubOpen] = useState(false)
  const [editingSub, setEditingSub] = useState<Subdivision | undefined>(undefined)
  const [campaignOpen, setCampaignOpen] = useState(false)
  const [pendingLocation, setPendingLocation] = useState<FieldLocation | null>(null)
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
  const hasLocations = field.locations.length > 0

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
          <TabsTrigger value="subdivisiones">Subdivisiones</TabsTrigger>
          <TabsTrigger value="campanias">Campañas</TabsTrigger>
        </TabsList>

        <TabsContent value="resumen" className="mt-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <Metric label="Ubicaciones" value={field.locations.length} />
            <Metric label="Subdivisiones" value={field.subdivisions.length} />
            <Metric label="Campañas" value={field.campaigns.length} />
          </div>
        </TabsContent>

        <TabsContent value="subdivisiones" className="mt-6 space-y-4">
          <div className="flex flex-wrap justify-end gap-2">
            {canManage && (
              <Button variant="outline" className={PILL_OUTLINE} onClick={() => setLocationOpen(true)}>
                <MapPin className="size-4" />
                Nueva ubicación
              </Button>
            )}
            <Button className={PILL_PRIMARY} onClick={openCreateSub} disabled={!hasLocations}>
              <Plus className="size-4" />
              Nueva subdivisión
            </Button>
          </div>

          {!hasLocations ? (
            <div className="rounded-2xl border border-hairline-on-bone p-10 text-center text-sm text-stone">
              Agregá primero una ubicación; las subdivisiones se reparten dentro de cada una.
            </div>
          ) : (
            field.locations.map(location => (
              <article key={location.id} className="rounded-2xl border border-hairline-on-bone p-6">
                <div className="flex items-center justify-between gap-2 border-b border-hairline-on-bone pb-3">
                  <h3 className="font-display text-base font-semibold text-ink">
                    {location.locality} · {location.ha} ha
                  </h3>
                  {canManage && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-stone hover:text-destructive"
                      onClick={() => setPendingLocation(location)}
                      aria-label="Eliminar ubicación"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  )}
                </div>
                {location.subdivisions.length === 0 ? (
                  <p className="pt-3 text-sm text-stone">Sin subdivisiones en esta ubicación.</p>
                ) : (
                  <ul className="divide-y divide-hairline-on-bone">
                    {location.subdivisions.map(sub => (
                      <li key={sub.id} className="flex items-center justify-between py-2.5 text-sm">
                        <span className="text-ink">
                          {sub.name} <span className="text-stone">· {sub.ha} ha</span>
                        </span>
                        {canModifyByRole(role, sub.creatorRole) && (
                          <span className="flex gap-1">
                            <Button variant="ghost" size="icon" className="size-8 text-stone hover:text-ink" onClick={() => openEditSub(sub)} aria-label="Editar">
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
                  </ul>
                )}
              </article>
            ))
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
              return (
                <article
                  key={campaign.id}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-hairline-on-bone p-6"
                >
                  <div className="space-y-1">
                    <p className="font-display font-semibold text-ink">
                      {campaign.crop.name} · {campaign.cycle}
                    </p>
                    <p className="text-sm text-stone">
                      {subdivision ? `Lote ${subdivision.name}` : 'Todo el campo'} · {campaign.ha} ha
                    </p>
                    <p className="text-xs text-stone">
                      Siembra {formatDate(campaign.sowingDateEst)} · Cosecha {formatDate(campaign.harvestDateEst)}
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
                </article>
              )
            })
          )}
        </TabsContent>
      </Tabs>

      <LocationFormDialog open={locationOpen} onOpenChange={setLocationOpen} fieldId={fieldId} />
      <SubdivisionFormDialog
        open={subOpen}
        onOpenChange={setSubOpen}
        fieldId={fieldId}
        locations={field.locations}
        subdivision={editingSub}
      />
      <CampaignFormDialog
        open={campaignOpen}
        onOpenChange={setCampaignOpen}
        fieldId={fieldId}
        subdivisions={field.subdivisions}
        crops={cropsQuery.data ?? []}
      />

      <ConfirmDialog
        open={pendingLocation !== null}
        onOpenChange={openState => !openState && setPendingLocation(null)}
        title="Eliminar ubicación"
        description={`¿Eliminar "${pendingLocation?.locality}"? Se borrarán también sus subdivisiones.`}
        loading={removeLocation.isPending}
        onConfirm={() => {
          if (!pendingLocation) return
          removeLocation.mutate(pendingLocation.id, { onSuccess: () => setPendingLocation(null) })
        }}
      />
      <ConfirmDialog
        open={pendingSub !== null}
        onOpenChange={openState => !openState && setPendingSub(null)}
        title="Eliminar subdivisión"
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

function Metric({ label, value }: { label: string; value: number }): React.JSX.Element {
  return (
    <div className="rounded-2xl border border-hairline-on-bone p-6">
      <p className="font-display text-3xl font-bold text-ink">{value}</p>
      <p className="mt-1 text-sm text-stone">{label}</p>
    </div>
  )
}
