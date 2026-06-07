import type { UserRole } from '@/types/api/common'

/** Spanish labels for the English `UserRole` values (info.md §2). */
export const ROLE_LABELS: Record<UserRole, string> = {
  ADMIN: 'Ingeniero agrónomo',
  MEMBER: 'Miembro del equipo',
  PRODUCER: 'Productor',
}

/** Roles allowed to create/manage fields and clients (producers cannot). */
export function canManageFields(role: UserRole): boolean {
  return role === 'ADMIN' || role === 'MEMBER'
}

/**
 * UI gate mirroring the backend edit rule (info.md §2): records created by an
 * ADMIN can only be modified by an ADMIN. The member-owns-its-record check is
 * enforced by the API. Used to show/hide edit and delete actions.
 */
export function canModifyByRole(userRole: UserRole, creatorRole: UserRole): boolean {
  if (userRole === 'ADMIN') return true
  return creatorRole !== 'ADMIN'
}
