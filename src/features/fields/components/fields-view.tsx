'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MapPin, Pencil, Plus, Trash2, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { PageHeader } from '@/components/layout/page-header'
import { useFields, useClients } from '@/features/fields/hooks/use-fields-queries'
import { useDeleteField } from '@/features/fields/hooks/use-field-mutations'
import { useAuthStore } from '@/features/auth/store/use-auth-store'
import { canManageFields, canModifyByRole } from '@/features/auth/roles'
import { PILL_OUTLINE, PILL_PRIMARY } from '@/components/ui/pill-button'
import { FieldFormDialog } from './field-form-dialog'
import { ClientManagerDialog } from './client-manager-dialog'
import type { FieldListItem } from '@/types/api/fields'

export function FieldsView(): React.JSX.Element {
  const role = useAuthStore(state => state.user?.role ?? 'PRODUCER')
  const fieldsQuery = useFields()
  const clientsQuery = useClients()
  const deleteField = useDeleteField()

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<FieldListItem | undefined>(undefined)
  const [clientsOpen, setClientsOpen] = useState(false)
  const [pendingDelete, setPendingDelete] = useState<FieldListItem | null>(null)

  const canManage = canManageFields(role)
  const clients = clientsQuery.data ?? []

  const openCreate = (): void => {
    setEditing(undefined)
    setFormOpen(true)
  }

  const openEdit = (field: FieldListItem): void => {
    setEditing(field)
    setFormOpen(true)
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <PageHeader
        kicker="Gestión agrícola"
        title="Campos y Campañas"
        description="Tus campos, ubicaciones, subdivisiones y campañas."
        actions={
          canManage && (
            <>
              <Button variant="outline" className={PILL_OUTLINE} onClick={() => setClientsOpen(true)}>
                <Users className="size-4" />
                Clientes
              </Button>
              <Button className={PILL_PRIMARY} onClick={openCreate}>
                <Plus className="size-4" />
                Nuevo campo
              </Button>
            </>
          )
        }
      />

      {fieldsQuery.isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map(i => (
            <Skeleton key={i} className="h-44 w-full rounded-2xl bg-[color-mix(in_srgb,var(--stone)_14%,var(--bone))]" />
          ))}
        </div>
      ) : fieldsQuery.isError ? (
        <div className="rounded-2xl border border-hairline-on-bone p-10 text-center text-sm text-destructive">
          No pudimos cargar los campos. {fieldsQuery.error.message}
        </div>
      ) : (fieldsQuery.data?.length ?? 0) === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-hairline-on-bone p-14 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-clay/10 text-clay">
            <MapPin className="size-6" />
          </span>
          <div>
            <p className="font-display text-lg font-semibold text-ink">Todavía no cargaste ningún campo</p>
            <p className="mt-1 text-sm text-stone">Empezá creando tu primer campo.</p>
          </div>
          {canManage && (
            <Button className={PILL_PRIMARY} onClick={openCreate}>
              <Plus className="size-4" />
              Nuevo campo
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {fieldsQuery.data?.map(field => (
            <article
              key={field.id}
              className="group flex flex-col gap-4 rounded-2xl border border-hairline-on-bone p-6 transition-colors hover:border-clay/40"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-display text-lg font-semibold text-ink">
                  <Link href={`/campos/${field.id}`} className="hover:text-clay">
                    {field.name}
                  </Link>
                </h3>
                {canManage && canModifyByRole(role, field.creatorRole) && (
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="size-8 text-stone hover:text-ink" onClick={() => openEdit(field)} aria-label="Editar">
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-stone hover:text-destructive"
                      onClick={() => setPendingDelete(field)}
                      aria-label="Eliminar"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                )}
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
                  <span className="text-xs text-stone">Sin cliente</span>
                )}
              </div>

              <div className="space-y-2 border-t border-hairline-on-bone pt-3 text-sm">
                <div className="flex justify-between text-stone">
                  <span>Superficie</span>
                  <span className="font-medium text-ink">{field.totalHa} ha</span>
                </div>
                <div className="flex justify-between text-stone">
                  <span>Campaña actual</span>
                  <span className="font-medium text-ink">
                    {field.latestCampaign ? `${field.latestCampaign.cropName} · ${field.latestCampaign.cycle}` : '—'}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 text-xs text-stone">
                <span>{field.locationCount} ubic.</span>
                <span>{field.subdivisionCount} lotes</span>
                <span>{field.campaignCount} campañas</span>
              </div>
            </article>
          ))}
        </div>
      )}

      <FieldFormDialog open={formOpen} onOpenChange={setFormOpen} clients={clients} field={editing} />
      <ClientManagerDialog open={clientsOpen} onOpenChange={setClientsOpen} clients={clients} />
      <ConfirmDialog
        open={pendingDelete !== null}
        onOpenChange={openState => !openState && setPendingDelete(null)}
        title="Eliminar campo"
        description={`¿Eliminar "${pendingDelete?.name}"? Se borrarán sus ubicaciones, subdivisiones y campañas.`}
        loading={deleteField.isPending}
        onConfirm={() => {
          if (!pendingDelete) return
          deleteField.mutate(pendingDelete.id, { onSuccess: () => setPendingDelete(null) })
        }}
      />
    </div>
  )
}
