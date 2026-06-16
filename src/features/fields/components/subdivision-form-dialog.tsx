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
import { useAddSubdivision, useUpdateSubdivision } from '@/features/fields/hooks/use-field-mutations'
import type { Subdivision } from '@/types/api/fields'

interface SubdivisionFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  fieldId: number
  /** Total surface of the field — lotes must add up to (at most) this. */
  totalHa: number
  /** All current lotes of the field, used to compute the remaining surface. */
  subdivisions: Subdivision[]
  subdivision?: Subdivision
}

export function SubdivisionFormDialog({
  open,
  onOpenChange,
  fieldId,
  totalHa,
  subdivisions,
  subdivision,
}: SubdivisionFormDialogProps): React.JSX.Element {
  const isEdit = subdivision !== undefined
  const addSubdivision = useAddSubdivision(fieldId)
  const updateSubdivision = useUpdateSubdivision(fieldId)
  const mutation = isEdit ? updateSubdivision : addSubdivision

  const [name, setName] = useState('')
  const [ha, setHa] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [wasOpen, setWasOpen] = useState(false)

  if (open && !wasOpen) {
    setWasOpen(true)
    setName(subdivision?.name ?? '')
    setHa(subdivision ? String(subdivision.ha) : '')
    setError(null)
  } else if (!open && wasOpen) {
    setWasOpen(false)
  }

  const usedByOthers = subdivisions
    .filter(item => item.id !== subdivision?.id)
    .reduce((sum, item) => sum + item.ha, 0)
  const remaining = Math.max(0, Math.round((totalHa - usedByOthers) * 100) / 100)

  const handleSubmit = (event: React.FormEvent): void => {
    event.preventDefault()
    const haValue = Number(ha)
    if (name.trim().length < 2) return setError('Ingresá un nombre.')
    if (!Number.isFinite(haValue) || haValue <= 0) return setError('La superficie debe ser mayor a 0.')
    if (haValue > remaining + 0.001) {
      return setError(`La superficie supera las ${remaining} ha disponibles del campo.`)
    }

    const onSuccess = (): void => onOpenChange(false)
    if (isEdit) {
      updateSubdivision.mutate(
        { subdivisionId: subdivision.id, payload: { name: name.trim(), ha: haValue } },
        { onSuccess },
      )
    } else {
      addSubdivision.mutate({ name: name.trim(), ha: haValue }, { onSuccess })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar lote' : 'Nuevo lote'}</DialogTitle>
          <DialogDescription>
            Dividí el campo en lotes. La suma de las hectáreas de todos los lotes no puede superar el total del campo.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="rounded-md border border-hairline-on-bone bg-bone px-3 py-2 text-sm text-stone">
            Disponible: <span className="font-medium text-ink">{remaining} ha</span> de {totalHa} ha
          </div>
          <div className="space-y-2">
            <Label htmlFor="sub-name">Nombre del lote</Label>
            <Input id="sub-name" value={name} onChange={e => setName(e.target.value)} placeholder="Lote 1" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sub-ha">Superficie (ha)</Label>
            <Input
              id="sub-ha"
              type="number"
              min="0"
              step="any"
              value={ha}
              onChange={e => setHa(e.target.value)}
              placeholder="300"
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={mutation.isPending}>
              Cancelar
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {isEdit ? 'Guardar cambios' : 'Crear lote'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
