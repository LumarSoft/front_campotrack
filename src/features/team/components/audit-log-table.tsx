'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { ROLE_LABELS } from '@/features/auth/roles'
import { useAuditLog } from '../hooks/use-team-queries'
import type { AuditAction } from '@/types/api/audit'

const ACTION_LABELS: Record<AuditAction, string> = {
  CREATE: 'Creó',
  UPDATE: 'Editó',
  DELETE: 'Eliminó',
}

const ACTION_VARIANT: Record<AuditAction, 'default' | 'secondary' | 'destructive'> = {
  CREATE: 'default',
  UPDATE: 'secondary',
  DELETE: 'destructive',
}

const ENTITY_LABELS: Record<string, string> = {
  fields: 'Campo',
  clients: 'Cliente',
  campaigns: 'Campaña',
  events: 'Evento',
  records: 'Registro',
  crops: 'Cultivo',
  team: 'Equipo',
}

function entityLabel(entity: string): string {
  return ENTITY_LABELS[entity] ?? entity
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('es-AR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function AuditLogTable(): React.JSX.Element {
  const auditQuery = useAuditLog()

  if (auditQuery.isError) {
    return <p className="text-sm text-destructive">No pudimos cargar la auditoría.</p>
  }

  const entries = auditQuery.data ?? []

  return (
    <div className="overflow-hidden rounded-2xl border border-hairline-on-bone">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cuándo</TableHead>
            <TableHead>Quién</TableHead>
            <TableHead>Acción</TableHead>
            <TableHead>Entidad</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map(entry => (
            <TableRow key={entry.id}>
              <TableCell className="text-stone">{formatDateTime(entry.createdAt)}</TableCell>
              <TableCell className="font-medium text-ink">
                {entry.actorName ?? '—'}
                <span className="ml-1 text-xs font-normal text-stone">({ROLE_LABELS[entry.actorRole]})</span>
              </TableCell>
              <TableCell>
                <Badge variant={ACTION_VARIANT[entry.action]}>{ACTION_LABELS[entry.action]}</Badge>
              </TableCell>
              <TableCell className="text-stone">
                {entityLabel(entry.entity)}
                {entry.entityId !== null && <span className="text-xs"> #{entry.entityId}</span>}
              </TableCell>
            </TableRow>
          ))}
          {entries.length === 0 && !auditQuery.isLoading && (
            <TableRow>
              <TableCell colSpan={4} className="py-8 text-center text-sm text-stone">
                Todavía no hay actividad registrada.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
