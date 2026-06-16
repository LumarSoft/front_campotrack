'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
import { SearchableMultiSelect } from '@/components/ui/searchable-multi-select'
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
  const router = useRouter()
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

  const clientOptions = clients.map(client => ({ value: String(client.id), label: client.name }))

  const handleSubmit = (event: React.FormEvent): void => {
    event.preventDefault()
    const ha = Number(totalHa)
    if (name.trim().length < 2) return setError('El nombre debe tener al menos 2 caracteres.')
    if (!Number.isFinite(ha) || ha <= 0) return setError('La superficie debe ser mayor a 0.')

    const payload = { name: name.trim(), totalHa: ha, clientIds }
    mutation.mutate(payload, {
      onSuccess: created => {
        onOpenChange(false)
        // After creating a field, jump into its detail so the user can divide it
        // into lotes and load its campaigns right away.
        if (!isEdit) router.push(`/campos/${created.id}`)
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar campo' : 'Nuevo campo'}</DialogTitle>
          <DialogDescription>
            Definí el nombre, la superficie total y el cliente. Al crearlo te llevamos al campo para dividirlo en
            lotes y dar de alta sus campañas.
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

          <div className="space-y-2">
            <Label>Cliente (opcional)</Label>
            {clients.length > 0 ? (
              <SearchableMultiSelect
                options={clientOptions}
                selected={clientIds.map(String)}
                onChange={values => setClientIds(values.map(Number))}
                placeholder="Buscar y asignar clientes"
                searchPlaceholder="Buscar cliente…"
                emptyText="Sin clientes que coincidan"
              />
            ) : (
              <p className="rounded-md border border-dashed border-hairline-on-bone px-3 py-2 text-sm text-stone">
                Todavía no hay clientes. Creá uno desde el botón “Clientes”.
              </p>
            )}
          </div>

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
