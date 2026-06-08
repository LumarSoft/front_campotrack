'use client'

import { useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { ROLE_LABELS } from '@/features/auth/roles'
import { useTeamMembers } from '../hooks/use-team-queries'
import { useRemoveMember } from '../hooks/use-team-mutations'
import { EditMemberDialog } from './edit-member-dialog'
import type { TeamMember } from '@/types/api/team'

export function MembersTable(): React.JSX.Element {
  const membersQuery = useTeamMembers()
  const removeMember = useRemoveMember()
  const [editing, setEditing] = useState<TeamMember | null>(null)
  const [pendingRemove, setPendingRemove] = useState<TeamMember | null>(null)

  if (membersQuery.isError) {
    return <p className="text-sm text-destructive">No pudimos cargar el equipo. {membersQuery.error.message}</p>
  }

  const members = membersQuery.data ?? []

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-hairline-on-bone">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Campos</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map(member => (
              <TableRow key={member.id}>
                <TableCell className="font-medium text-ink">{member.name ?? '—'}</TableCell>
                <TableCell className="text-stone">{member.email}</TableCell>
                <TableCell>
                  <Badge variant={member.isOwner ? 'default' : 'secondary'}>{ROLE_LABELS[member.role]}</Badge>
                </TableCell>
                <TableCell className="text-stone">
                  {member.isOwner ? 'Todos' : member.fieldIds.length}
                </TableCell>
                <TableCell className="text-right">
                  {member.isOwner ? (
                    <span className="text-xs text-stone">Dueño de la cuenta</span>
                  ) : (
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" aria-label="Editar acceso" onClick={() => setEditing(member)}>
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Quitar acceso"
                        onClick={() => setPendingRemove(member)}
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {members.length === 0 && !membersQuery.isLoading && (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-sm text-stone">
                  Todavía no hay miembros. Invitá a alguien para empezar.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <EditMemberDialog member={editing} onOpenChange={open => !open && setEditing(null)} />

      <ConfirmDialog
        open={pendingRemove !== null}
        onOpenChange={open => !open && setPendingRemove(null)}
        title="Quitar acceso"
        description={`¿Quitar a ${pendingRemove?.email} de tu cuenta? Perderá el acceso a todos los campos.`}
        loading={removeMember.isPending}
        onConfirm={() => {
          if (!pendingRemove) return
          removeMember.mutate(pendingRemove.id, { onSuccess: () => setPendingRemove(null) })
        }}
      />
    </>
  )
}
