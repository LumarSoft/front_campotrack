'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Copy, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { ROLE_LABELS } from '@/features/auth/roles'
import { useInvitations } from '../hooks/use-team-queries'
import { useRevokeInvitation } from '../hooks/use-team-mutations'
import type { Invitation } from '@/types/api/team'

function invitationLink(token: string): string {
  if (typeof window === 'undefined') return ''
  return `${window.location.origin}/invitacion/${token}`
}

export function InvitationsList(): React.JSX.Element {
  const invitationsQuery = useInvitations()
  const revokeInvitation = useRevokeInvitation()
  const [pendingRevoke, setPendingRevoke] = useState<Invitation | null>(null)

  const copyLink = async (token: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(invitationLink(token))
      toast.success('Link copiado')
    } catch {
      toast.error('No pudimos copiar el link')
    }
  }

  if (invitationsQuery.isError) {
    return <p className="text-sm text-destructive">No pudimos cargar las invitaciones.</p>
  }

  const invitations = invitationsQuery.data ?? []

  if (invitations.length === 0 && !invitationsQuery.isLoading) {
    return (
      <p className="rounded-2xl border border-dashed border-hairline-on-bone p-8 text-center text-sm text-stone">
        No hay invitaciones pendientes.
      </p>
    )
  }

  return (
    <>
      <ul className="space-y-3">
        {invitations.map(invitation => (
          <li
            key={invitation.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-hairline-on-bone bg-bone p-4"
          >
            <div className="min-w-0">
              <p className="truncate font-medium text-ink">{invitation.email}</p>
              <p className="mt-0.5 flex items-center gap-2 text-sm text-stone">
                <Badge variant="secondary">{ROLE_LABELS[invitation.role]}</Badge>
                <span>
                  {invitation.fieldIds.length} campo{invitation.fieldIds.length === 1 ? '' : 's'}
                </span>
              </p>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" onClick={() => void copyLink(invitation.token)}>
                <Copy className="size-4" />
                Copiar link
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Revocar invitación"
                onClick={() => setPendingRevoke(invitation)}
              >
                <X className="size-4 text-destructive" />
              </Button>
            </div>
          </li>
        ))}
      </ul>

      <ConfirmDialog
        open={pendingRevoke !== null}
        onOpenChange={open => !open && setPendingRevoke(null)}
        title="Revocar invitación"
        description={`¿Revocar la invitación de ${pendingRevoke?.email}? El link dejará de funcionar.`}
        loading={revokeInvitation.isPending}
        onConfirm={() => {
          if (!pendingRevoke) return
          revokeInvitation.mutate(pendingRevoke.id, { onSuccess: () => setPendingRevoke(null) })
        }}
      />
    </>
  )
}
