import { apiRequest } from '@/lib/api-client'
import type { AuditLogEntry } from '@/types/api/audit'

/** Audit trail domain service — admin only (info.md §11). */
export const auditService = {
  list(token: string): Promise<AuditLogEntry[]> {
    return apiRequest<AuditLogEntry[]>('/audit', { token })
  },
}
