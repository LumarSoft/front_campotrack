'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { PILL_PRIMARY } from '@/components/ui/pill-button'
import { useProviders } from '../hooks/use-providers-queries'
import { useCreateProvider, useDeleteProvider } from '../hooks/use-provider-mutations'
import type { Provider } from '@/types/api/providers'

export function ProviderManager(): React.JSX.Element {
  const providersQuery = useProviders()
  const createProvider = useCreateProvider()
  const deleteProvider = useDeleteProvider()

  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [pendingDelete, setPendingDelete] = useState<Provider | null>(null)

  const providers = providersQuery.data ?? []

  const handleCreate = (event: React.FormEvent): void => {
    event.preventDefault()
    if (name.trim().length < 2) return
    createProvider.mutate(
      { name: name.trim(), contact: contact.trim() || undefined },
      {
        onSuccess: () => {
          setName('')
          setContact('')
        },
      },
    )
  }

  return (
    <div className="max-w-xl space-y-5">
      <p className="text-sm text-stone">
        Tus proveedores de insumos y servicios. Después los asociás a cada costo que cargás.
      </p>

      <form onSubmit={handleCreate} className="flex flex-col gap-3 rounded-md border p-3 sm:flex-row sm:items-end">
        <div className="flex-1 space-y-1.5">
          <Label htmlFor="provider-name">Nombre</Label>
          <Input id="provider-name" value={name} onChange={e => setName(e.target.value)} placeholder="Agroinsumos SA" />
        </div>
        <div className="flex-1 space-y-1.5">
          <Label htmlFor="provider-contact">Contacto (opcional)</Label>
          <Input
            id="provider-contact"
            value={contact}
            onChange={e => setContact(e.target.value)}
            placeholder="Tel / email"
          />
        </div>
        <Button type="submit" className={PILL_PRIMARY} disabled={createProvider.isPending || name.trim().length < 2}>
          Agregar
        </Button>
      </form>

      {providersQuery.isError ? (
        <p className="text-sm text-destructive">No pudimos cargar los proveedores.</p>
      ) : providers.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-hairline-on-bone p-6 text-center text-sm text-stone">
          Todavía no hay proveedores cargados.
        </p>
      ) : (
        <div className="space-y-2">
          {providers.map(provider => (
            <div key={provider.id} className="flex items-center justify-between rounded-md border px-3 py-2">
              <div>
                <p className="text-sm font-medium text-ink">{provider.name}</p>
                {provider.contact && <p className="text-xs text-stone">{provider.contact}</p>}
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{provider.costCount} costos</Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-stone hover:text-destructive"
                  onClick={() => setPendingDelete(provider)}
                  aria-label={`Eliminar ${provider.name}`}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        onOpenChange={openState => !openState && setPendingDelete(null)}
        title="Eliminar proveedor"
        description={`¿Eliminar "${pendingDelete?.name}"? Los costos no se borran, solo se desvincula el proveedor.`}
        loading={deleteProvider.isPending}
        onConfirm={() => {
          if (!pendingDelete) return
          deleteProvider.mutate(pendingDelete.id, { onSuccess: () => setPendingDelete(null) })
        }}
      />
    </div>
  )
}
