'use client'

import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { PILL_PRIMARY } from '@/components/ui/pill-button'
import { useCrops } from '@/features/fields/hooks/use-fields-queries'
import { useCreateCrop, useDeleteCrop } from '../hooks/use-crop-mutations'
import type { Crop } from '@/types/api/crops'

export function CropCatalogManager(): React.JSX.Element {
  const cropsQuery = useCrops()
  const createCrop = useCreateCrop()
  const deleteCrop = useDeleteCrop()

  const [name, setName] = useState('')
  const [pendingDelete, setPendingDelete] = useState<Crop | null>(null)

  const handleAdd = (event: React.FormEvent): void => {
    event.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    createCrop.mutate(trimmed, { onSuccess: () => setName('') })
  }

  const crops = cropsQuery.data ?? []

  return (
    <div className="max-w-xl space-y-5">
      <p className="text-sm text-stone">Cultivos disponibles al crear campañas (info.md §13).</p>

      <form onSubmit={handleAdd} className="flex gap-2">
        <Input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Nuevo cultivo (ej. Soja)"
          disabled={createCrop.isPending}
        />
        <Button type="submit" className={PILL_PRIMARY} disabled={createCrop.isPending || !name.trim()}>
          <Plus className="size-4" />
          Agregar
        </Button>
      </form>

      {cropsQuery.isError ? (
        <p className="text-sm text-destructive">No pudimos cargar los cultivos.</p>
      ) : crops.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-hairline-on-bone p-6 text-center text-sm text-stone">
          Todavía no hay cultivos cargados.
        </p>
      ) : (
        <ul className="divide-y divide-hairline-on-bone rounded-2xl border border-hairline-on-bone bg-bone">
          {crops.map(crop => (
            <li key={crop.id} className="flex items-center justify-between gap-4 px-4 py-3">
              <span className="text-ink">{crop.name}</span>
              <Button
                variant="ghost"
                size="icon"
                aria-label={`Eliminar ${crop.name}`}
                onClick={() => setPendingDelete(crop)}
              >
                <Trash2 className="size-4 text-destructive" />
              </Button>
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        onOpenChange={open => !open && setPendingDelete(null)}
        title="Eliminar cultivo"
        description={`¿Eliminar "${pendingDelete?.name}" del catálogo? No se puede si está en uso por una campaña.`}
        loading={deleteCrop.isPending}
        onConfirm={() => {
          if (!pendingDelete) return
          deleteCrop.mutate(pendingDelete.id, { onSuccess: () => setPendingDelete(null) })
        }}
      />
    </div>
  )
}
