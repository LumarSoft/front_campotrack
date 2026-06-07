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
import { useAddLocation } from '@/features/fields/hooks/use-field-mutations'

interface LocationFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  fieldId: number
}

export function LocationFormDialog({ open, onOpenChange, fieldId }: LocationFormDialogProps): React.JSX.Element {
  const addLocation = useAddLocation(fieldId)
  const [locality, setLocality] = useState('')
  const [ha, setHa] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [wasOpen, setWasOpen] = useState(false)

  if (open && !wasOpen) {
    setWasOpen(true)
    setLocality('')
    setHa('')
    setError(null)
  } else if (!open && wasOpen) {
    setWasOpen(false)
  }

  const handleSubmit = (event: React.FormEvent): void => {
    event.preventDefault()
    const haValue = Number(ha)
    if (locality.trim().length < 2) return setError('Ingresá una localidad.')
    if (!Number.isFinite(haValue) || haValue <= 0) return setError('La superficie debe ser mayor a 0.')
    addLocation.mutate(
      { locality: locality.trim(), ha: haValue },
      { onSuccess: () => onOpenChange(false) },
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nueva ubicación</DialogTitle>
          <DialogDescription>
            Un campo puede abarcar varias ubicaciones reales. Las subdivisiones se reparten dentro de cada una.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="loc-locality">Localidad</Label>
            <Input
              id="loc-locality"
              value={locality}
              onChange={e => setLocality(e.target.value)}
              placeholder="9 de Julio"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="loc-ha">Superficie (ha)</Label>
            <Input id="loc-ha" type="number" min="0" step="any" value={ha} onChange={e => setHa(e.target.value)} placeholder="700" />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={addLocation.isPending}>
              Cancelar
            </Button>
            <Button type="submit" disabled={addLocation.isPending}>
              Agregar ubicación
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
