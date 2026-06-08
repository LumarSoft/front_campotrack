import { apiRequest } from '@/lib/api-client'
import type { AuthResponse } from '@/types/api/auth'
import type {
  AcceptInvitationRequest,
  CreateInvitationRequest,
  Invitation,
  InvitationPreview,
  TeamMember,
  UpdateMemberRequest,
} from '@/types/api/team'

/** Team & permissions domain service (info.md §11). */
export const teamService = {
  listMembers(token: string): Promise<TeamMember[]> {
    return apiRequest<TeamMember[]>('/team/members', { token })
  },

  updateMember(id: number, payload: UpdateMemberRequest, token: string): Promise<TeamMember> {
    return apiRequest<TeamMember>(`/team/members/${id}`, { method: 'PATCH', body: payload, token })
  },

  removeMember(id: number, token: string): Promise<void> {
    return apiRequest<void>(`/team/members/${id}`, { method: 'DELETE', token })
  },

  listInvitations(token: string): Promise<Invitation[]> {
    return apiRequest<Invitation[]>('/team/invitations', { token })
  },

  createInvitation(payload: CreateInvitationRequest, token: string): Promise<Invitation> {
    return apiRequest<Invitation>('/team/invitations', { method: 'POST', body: payload, token })
  },

  revokeInvitation(id: number, token: string): Promise<void> {
    return apiRequest<void>(`/team/invitations/${id}`, { method: 'DELETE', token })
  },

  // Public accept flow — no auth token; `invitationToken` is the invitation's own token.
  previewInvitation(invitationToken: string): Promise<InvitationPreview> {
    return apiRequest<InvitationPreview>(`/team/invitations/${invitationToken}`)
  },

  acceptInvitation(invitationToken: string, payload: AcceptInvitationRequest): Promise<AuthResponse> {
    return apiRequest<AuthResponse>(`/team/invitations/${invitationToken}/accept`, { method: 'POST', body: payload })
  },
}
