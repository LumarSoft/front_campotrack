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
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PILL_PRIMARY } from '@/components/ui/pill-button'
import { ROLE_LABELS } from '@/features/auth/roles'
import { useFields } from '@/features/fields/hooks/use-fields-queries'
import { useUpdateMember } from '../hooks/use-team-mutations'
import { FieldScopeSelect } from './field-scope-select'
import type { InvitableRole, TeamMember } from '@/types/api/team'

interface EditMemberDialogProps {
  member: TeamMember | null
  onOpenChange: (open: boolean) => void
}

const INVITABLE_ROLES: InvitableRole[] = ['MEMBER', 'PRODUCER']

export function EditMemberDialog({ member, onOpenChange }: EditMemberDialogProps): React.JSX.Element {
  const fieldsQuery = useFields()
  const updateMember = useUpdateMember()

  const [role, setRole] = useState<InvitableRole>('MEMBER')
  const [fieldIds, setFieldIds] = useState<number[]>([])
  const [lastMemberId, setLastMemberId] = useState<number | null>(null)

  // Reset the form when a different member is opened (render-phase, no effect).
  if (member && member.id !== lastMemberId) {
    setLastMemberId(member.id)
    setRole(member.role === 'PRODUCER' ? 'PRODUCER' : 'MEMBER')
    setFieldIds(member.fieldIds)
  }

  const handleSubmit = (event: React.FormEvent): void => {
    event.preventDefault()
    if (!member) return
    updateMember.mutate({ id: member.id, payload: { role, fieldIds } }, { onSuccess: () => onOpenChange(false) })
  }

  return (
    <Dialog open={member !== null} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar acceso</DialogTitle>
          <DialogDescription>{member?.email}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={updateMember.isPending}>
              Cancelar
            </Button>
            <Button type="submit" className={PILL_PRIMARY} disabled={updateMember.isPending}>
              Guardar cambios
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
