'use client'

import { useState } from 'react'
import { UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PILL_PRIMARY } from '@/components/ui/pill-button'
import { PageHeader } from '@/components/layout/page-header'
import { useAuthStore } from '@/features/auth/store/use-auth-store'
import { MembersTable } from '@/features/team/components/members-table'
import { InvitationsList } from '@/features/team/components/invitations-list'
import { AuditLogTable } from '@/features/team/components/audit-log-table'
import { InviteMemberDialog } from '@/features/team/components/invite-member-dialog'

/**
 * Team & permissions (info.md §11) — admin only. Members, invitations and the
 * audit trail. The API enforces the same admin restriction.
 */
export default function EquipoPage(): React.JSX.Element {
  const role = useAuthStore(state => state.user?.role ?? 'PRODUCER')
  const [inviteOpen, setInviteOpen] = useState(false)

  if (role !== 'ADMIN') {
    return (
      <div className="mx-auto max-w-3xl">
        <PageHeader kicker="Equipo y permisos" title="Solo administradores" />
        <p className="mt-6 text-sm text-stone">Esta sección está disponible solo para el administrador de la cuenta.</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <PageHeader
        kicker="Equipo y permisos"
        title="Tu equipo"
        description="Invitá miembros y productores, definí a qué campos acceden y revisá la auditoría."
        actions={
          <Button className={PILL_PRIMARY} onClick={() => setInviteOpen(true)}>
            <UserPlus className="size-4" />
            Invitar
          </Button>
        }
      />

      <Tabs defaultValue="equipo">
        <TabsList>
          <TabsTrigger value="equipo">Equipo</TabsTrigger>
          <TabsTrigger value="invitaciones">Invitaciones</TabsTrigger>
          <TabsTrigger value="auditoria">Auditoría</TabsTrigger>
        </TabsList>

        <TabsContent value="equipo" className="mt-6">
          <MembersTable />
        </TabsContent>
        <TabsContent value="invitaciones" className="mt-6">
          <InvitationsList />
        </TabsContent>
        <TabsContent value="auditoria" className="mt-6">
          <AuditLogTable />
        </TabsContent>
      </Tabs>

      <InviteMemberDialog open={inviteOpen} onOpenChange={setInviteOpen} />
    </div>
  )
}
