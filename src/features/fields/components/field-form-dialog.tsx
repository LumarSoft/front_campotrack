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
import { useCreateField, useUpdateField } from '@/features/fields/hooks/use-field-mutations'
import type { Client } from '@/types/api/clients'
import type { FieldListItem } from '@/types/api/fields'

interface FieldFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  clients: Client[]
  /** Provided when editing an existing field. */
  field?: FieldListItem
}

export function FieldFormDialog({ open, onOpenChange, clients, field }: FieldFormDialogProps): React.JSX.Element {
  const isEdit = field !== undefined
  const createField = useCreateField()
  const updateField = useUpdateField(field?.id ?? 0)
  const mutation = isEdit ? updateField : createField

  const [name, setName] = useState('')
  const [totalHa, setTotalHa] = useState('')
  const [clientIds, setClientIds] = useState<number[]>([])
  const [error, setError] = useState<string | null>(null)
  const [wasOpen, setWasOpen] = useState(false)

  // Reset the form when the dialog opens (React's "adjust state during render"
  // pattern — avoids a setState-in-effect).
  if (open && !wasOpen) {
    setWasOpen(true)
    setName(field?.name ?? '')
    setTotalHa(field ? String(field.totalHa) : '')
    setClientIds(field?.clients.map(c => c.id) ?? [])
    setError(null)
  } else if (!open && wasOpen) {
    setWasOpen(false)
  }

  const toggleClient = (id: number): void => {
    setClientIds(current => (current.includes(id) ? current.filter(c => c !== id) : [...current, id]))
  }

  const handleSubmit = (event: React.FormEvent): void => {
    event.preventDefault()
    const ha = Number(totalHa)
    if (name.trim().length < 2) return setError('El nombre debe tener al menos 2 caracteres.')
    if (!Number.isFinite(ha) || ha <= 0) return setError('La superficie debe ser mayor a 0.')

    const payload = { name: name.trim(), totalHa: ha, clientIds }
    mutation.mutate(payload, { onSuccess: () => onOpenChange(false) })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar campo' : 'Nuevo campo'}</DialogTitle>
          <DialogDescription>
            Definí el nombre y la superficie total. Luego vas a poder cargar ubicaciones, subdivisiones y campañas.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="field-name">Nombre</Label>
            <Input id="field-name" value={name} onChange={e => setName(e.target.value)} placeholder="La Esperanza" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="field-ha">Superficie total (ha)</Label>
            <Input
              id="field-ha"
              type="number"
              min="0"
              step="any"
              value={totalHa}
              onChange={e => setTotalHa(e.target.value)}
              placeholder="1000"
            />
          </div>

          {clients.length > 0 && (
            <div className="space-y-2">
              <Label>Clientes (opcional)</Label>
              <div className="max-h-40 space-y-1 overflow-y-auto rounded-md border p-2">
                {clients.map(client => (
                  <label key={client.id} className="flex items-center gap-2 rounded px-1 py-1 text-sm hover:bg-muted">
                    <input
                      type="checkbox"
                      checked={clientIds.includes(client.id)}
                      onChange={() => toggleClient(client.id)}
                      className="size-4"
                    />
                    {client.name}
                  </label>
                ))}
              </div>
            </div>
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={mutation.isPending}>
              Cancelar
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {isEdit ? 'Guardar cambios' : 'Crear campo'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
