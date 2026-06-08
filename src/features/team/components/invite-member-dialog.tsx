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
import { PILL_PRIMARY } from '@/components/ui/pill-button'
import { ROLE_LABELS } from '@/features/auth/roles'
import { useFields } from '@/features/fields/hooks/use-fields-queries'
import { useCreateInvitation } from '../hooks/use-team-mutations'
import { FieldScopeSelect } from './field-scope-select'
import type { InvitableRole } from '@/types/api/team'

interface InviteMemberDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const INVITABLE_ROLES: InvitableRole[] = ['MEMBER', 'PRODUCER']

export function InviteMemberDialog({ open, onOpenChange }: InviteMemberDialogProps): React.JSX.Element {
  const fieldsQuery = useFields()
  const createInvitation = useCreateInvitation()

  const [email, setEmail] = useState('')
  const [role, setRole] = useState<InvitableRole>('MEMBER')
  const [fieldIds, setFieldIds] = useState<number[]>([])
  const [error, setError] = useState<string | null>(null)
  const [wasOpen, setWasOpen] = useState(false)

  if (open && !wasOpen) {
    setWasOpen(true)
    setEmail('')
    setRole('MEMBER')
    setFieldIds([])
    setError(null)
  } else if (!open && wasOpen) {
    setWasOpen(false)
  }

  const handleSubmit = (event: React.FormEvent): void => {
    event.preventDefault()
    if (!email.trim()) return setError('Ingresá un email.')
    createInvitation.mutate(
      { email: email.trim(), role, fieldIds },
      { onSuccess: () => onOpenChange(false) },
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invitar al equipo</DialogTitle>
          <DialogDescription>
            Generá una invitación por email para un miembro o un productor (info.md §3).
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="invite-email">Email</Label>
            <Input
              id="invite-email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="persona@ejemplo.com"
            />
          </div>

          <div className="space-y-2">
            <Label>Rol</Label>
            <Select value={role} onValueChange={value => setRole(value as InvitableRole)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {INVITABLE_ROLES.map(invitable => (
                  <SelectItem key={invitable} value={invitable}>
                    {ROLE_LABELS[invitable]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <FieldScopeSelect fields={fieldsQuery.data ?? []} selected={fieldIds} onChange={setFieldIds} />

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createInvitation.isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" className={PILL_PRIMARY} disabled={createInvitation.isPending}>
              Crear invitación
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
