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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAddSubdivision, useUpdateSubdivision } from '@/features/fields/hooks/use-field-mutations'
import type { FieldLocation, Subdivision } from '@/types/api/fields'

interface SubdivisionFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  fieldId: number
  locations: FieldLocation[]
  subdivision?: Subdivision
}

export function SubdivisionFormDialog({
  open,
  onOpenChange,
  fieldId,
  locations,
  subdivision,
}: SubdivisionFormDialogProps): React.JSX.Element {
  const isEdit = subdivision !== undefined
  const addSubdivision = useAddSubdivision(fieldId)
  const updateSubdivision = useUpdateSubdivision(fieldId)
  const mutation = isEdit ? updateSubdivision : addSubdivision

  const [locationId, setLocationId] = useState('')
  const [name, setName] = useState('')
  const [ha, setHa] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [wasOpen, setWasOpen] = useState(false)

  if (open && !wasOpen) {
    setWasOpen(true)
    setLocationId(subdivision ? String(subdivision.locationId) : locations[0] ? String(locations[0].id) : '')
    setName(subdivision?.name ?? '')
    setHa(subdivision ? String(subdivision.ha) : '')
    setError(null)
  } else if (!open && wasOpen) {
    setWasOpen(false)
  }

  const handleSubmit = (event: React.FormEvent): void => {
    event.preventDefault()
    const haValue = Number(ha)
    const locId = Number(locationId)
    if (!Number.isFinite(locId) || locId <= 0) return setError('Elegí una ubicación.')
    if (name.trim().length < 2) return setError('Ingresá un nombre.')
    if (!Number.isFinite(haValue) || haValue <= 0) return setError('La superficie debe ser mayor a 0.')

    const onSuccess = (): void => onOpenChange(false)
    if (isEdit) {
      updateSubdivision.mutate(
        { subdivisionId: subdivision.id, payload: { locationId: locId, name: name.trim(), ha: haValue } },
        { onSuccess },
      )
    } else {
      addSubdivision.mutate({ locationId: locId, name: name.trim(), ha: haValue }, { onSuccess })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar subdivisión' : 'Nueva subdivisión'}</DialogTitle>
          <DialogDescription>
            La subdivisión debe ser coherente con su ubicación: la suma de lotes no puede superar su superficie.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Ubicación</Label>
            <Select value={locationId} onValueChange={setLocationId}>
              <SelectTrigger>
                <SelectValue placeholder="Elegí una ubicación" />
              </SelectTrigger>
              <SelectContent>
                {locations.map(location => (
                  <SelectItem key={location.id} value={String(location.id)}>
                    {location.locality} ({location.ha} ha)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="sub-name">Nombre del lote</Label>
            <Input id="sub-name" value={name} onChange={e => setName(e.target.value)} placeholder="Lote 1" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sub-ha">Superficie (ha)</Label>
            <Input id="sub-ha" type="number" min="0" step="any" value={ha} onChange={e => setHa(e.target.value)} placeholder="300" />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={mutation.isPending}>
              Cancelar
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {isEdit ? 'Guardar cambios' : 'Crear subdivisión'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
