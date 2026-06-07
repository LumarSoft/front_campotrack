import type { UserRole } from './common'

export type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE'

export interface AuditLogEntry {
  id: number
  action: AuditAction
  entity: string
  entityId: number | null
  actorName: string | null
  actorRole: UserRole
  metadata: unknown
  createdAt: string
}
