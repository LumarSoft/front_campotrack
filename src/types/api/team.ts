import type { UserRole } from './common'

/** A role that can be invited — never another admin (info.md §3). */
export type InvitableRole = 'MEMBER' | 'PRODUCER'

export type InvitationStatus = 'PENDING' | 'ACCEPTED' | 'REVOKED'

export interface TeamMember {
  id: number
  name: string | null
  email: string
  role: UserRole
  /** The account owner (registering admin) cannot be edited or removed. */
  isOwner: boolean
  fieldIds: number[]
}

export interface Invitation {
  id: number
  email: string
  role: UserRole
  token: string
  status: InvitationStatus
  fieldIds: number[]
  expiresAt: string
  createdAt: string
}

export interface CreateInvitationRequest {
  email: string
  role: InvitableRole
  fieldIds?: number[]
}

export interface UpdateMemberRequest {
  role?: InvitableRole
  fieldIds?: number[]
}

export interface InvitationPreview {
  email: string
  role: UserRole
  accountName: string | null
}

export interface AcceptInvitationRequest {
  name: string
  password: string
}
