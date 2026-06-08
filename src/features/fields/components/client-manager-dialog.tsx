'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { useCreateClient, useDeleteClient } from '@/features/fields/hooks/use-client-mutations'
import type { Client } from '@/types/api/clients'

interface ClientManagerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  clients: Client[]
}

export function ClientManagerDialog({ open, onOpenChange, clients }: ClientManagerDialogProps): React.JSX.Element {
  const createClient = useCreateClient()
  const deleteClient = useDeleteClient()

  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [pendingDelete, setPendingDelete] = useState<Client | null>(null)

  const handleCreate = (event: React.FormEvent): void => {
    event.preventDefault()
    if (name.trim().length < 2) return
    createClient.mutate(
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Clientes</DialogTitle>
          <DialogDescription>
            Los clientes agrupan campos (un campo puede pertenecer a varios). Son opcionales.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleCreate} className="flex flex-col gap-3 rounded-md border p-3 sm:flex-row sm:items-end">
          <div className="flex-1 space-y-1.5">
            <Label htmlFor="client-name">Nombre</Label>
            <Input id="client-name" value={name} onChange={e => setName(e.target.value)} placeholder="Estancia Sur" />
          </div>
          <div className="flex-1 space-y-1.5">
            <Label htmlFor="client-contact">Contacto (opcional)</Label>
            <Input id="client-contact" value={contact} onChange={e => setContact(e.target.value)} placeholder="Tel / email" />
          </div>
          <Button type="submit" disabled={createClient.isPending || name.trim().length < 2}>
            Agregar
          </Button>
        </form>

        <div className="max-h-64 space-y-2 overflow-y-auto">
          {clients.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">Todavía no hay clientes.</p>
          ) : (
            clients.map(client => (
              <div key={client.id} className="flex items-center justify-between rounded-md border px-3 py-2">
                <div>
                  <p className="text-sm font-medium">{client.name}</p>
                  {client.contact && <p className="text-xs text-muted-foreground">{client.contact}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{client.fieldCount} campos</Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => setPendingDelete(client)}
                    aria-label={`Eliminar ${client.name}`}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>

      <ConfirmDialog
        open={pendingDelete !== null}
        onOpenChange={openState => !openState && setPendingDelete(null)}
        title="Eliminar cliente"
        description={`¿Eliminar "${pendingDelete?.name}"? Los campos no se borran, solo se desvincula el cliente.`}
        loading={deleteClient.isPending}
        onConfirm={() => {
          if (!pendingDelete) return
          deleteClient.mutate(pendingDelete.id, { onSuccess: () => setPendingDelete(null) })
        }}
      />
    </Dialog>
  )
}
