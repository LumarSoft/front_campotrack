'use client'

import { useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { PILL_PRIMARY } from '@/components/ui/pill-button'
import { MONTH_OPTIONS, formatSowingWindow } from '@/lib/months'
import { useCrops } from '@/features/fields/hooks/use-fields-queries'
import { useCreateCrop, useDeleteCrop, useUpdateCrop } from '../hooks/use-crop-mutations'
import type { Crop } from '@/types/api/crops'

const NONE = 'none'

function toMonth(value: string): number | undefined {
  return value === NONE ? undefined : Number(value)
}

export function CropCatalogManager(): React.JSX.Element {
  const cropsQuery = useCrops()
  const createCrop = useCreateCrop()
  const updateCrop = useUpdateCrop()
  const deleteCrop = useDeleteCrop()

  const [name, setName] = useState('')
  const [from, setFrom] = useState(NONE)
  const [to, setTo] = useState(NONE)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editFrom, setEditFrom] = useState(NONE)
  const [editTo, setEditTo] = useState(NONE)
  const [pendingDelete, setPendingDelete] = useState<Crop | null>(null)

  const crops = cropsQuery.data ?? []

  const handleAdd = (event: React.FormEvent): void => {
    event.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    createCrop.mutate(
      { name: trimmed, sowingFromMonth: toMonth(from), sowingToMonth: toMonth(to) },
      {
        onSuccess: () => {
          setName('')
          setFrom(NONE)
          setTo(NONE)
        },
      },
    )
  }

  const startEdit = (crop: Crop): void => {
    setEditingId(crop.id)
    setEditFrom(crop.sowingFromMonth ? String(crop.sowingFromMonth) : NONE)
    setEditTo(crop.sowingToMonth ? String(crop.sowingToMonth) : NONE)
  }

  const saveEdit = (crop: Crop): void => {
    updateCrop.mutate(
      { id: crop.id, payload: { sowingFromMonth: toMonth(editFrom), sowingToMonth: toMonth(editTo) } },
      { onSuccess: () => setEditingId(null) },
    )
  }

  return (
    <div className="max-w-2xl space-y-5">
      <p className="text-sm text-stone">
        Cultivos disponibles al crear campañas. La época de siembra alimenta los consejos del análisis.
      </p>

      <form onSubmit={handleAdd} className="space-y-3 rounded-md border p-3">
        <div className="space-y-1.5">
          <Label htmlFor="crop-name">Nuevo cultivo</Label>
          <Input
            id="crop-name"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Ej. Soja"
            disabled={createCrop.isPending}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>Siembra desde</Label>
            <Select value={from} onValueChange={setFrom}>
              <SelectTrigger>
                <SelectValue placeholder="Mes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NONE}>Sin especificar</SelectItem>
                {MONTH_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Siembra hasta</Label>
            <Select value={to} onValueChange={setTo}>
              <SelectTrigger>
                <SelectValue placeholder="Mes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NONE}>Sin especificar</SelectItem>
                {MONTH_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button type="submit" className={PILL_PRIMARY} disabled={createCrop.isPending || !name.trim()}>
          <Plus className="size-4" />
          Agregar cultivo
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
            <li key={crop.id} className="px-4 py-3">
              {editingId === crop.id ? (
                <div className="space-y-3">
                  <p className="font-medium text-ink">{crop.name}</p>
                  <div className="grid grid-cols-2 gap-3">
                    <Select value={editFrom} onValueChange={setEditFrom}>
                      <SelectTrigger>
                        <SelectValue placeholder="Desde" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={NONE}>Sin especificar</SelectItem>
                        {MONTH_OPTIONS.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={editTo} onValueChange={setEditTo}>
                      <SelectTrigger>
                        <SelectValue placeholder="Hasta" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={NONE}>Sin especificar</SelectItem>
                        {MONTH_OPTIONS.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => saveEdit(crop)} disabled={updateCrop.isPending}>
                      Guardar
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <span className="text-ink">{crop.name}</span>
                    <p className="text-xs text-stone">
                      {formatSowingWindow(crop.sowingFromMonth, crop.sowingToMonth) ?? 'Sin época definida'}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Editar época de ${crop.name}`}
                      onClick={() => startEdit(crop)}
                    >
                      <Pencil className="size-4 text-stone" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Eliminar ${crop.name}`}
                      onClick={() => setPendingDelete(crop)}
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              )}
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
