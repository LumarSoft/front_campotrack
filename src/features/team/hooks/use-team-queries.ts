'use client'

import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import { teamService } from '@/services/team.service'
import { auditService } from '@/services/audit.service'
import { useAuthToken } from '@/features/auth/hooks/use-auth-token'
import { queryKeys } from '@/lib/query-keys'
import type { ApiError } from '@/lib/api-client'
import type { Invitation, TeamMember } from '@/types/api/team'
import type { AuditLogEntry } from '@/types/api/audit'

export function useTeamMembers(): UseQueryResult<TeamMember[], ApiError> {
  const token = useAuthToken()
  return useQuery<TeamMember[], ApiError>({
    queryKey: queryKeys.team.members,
    queryFn: () => teamService.listMembers(token!),
    enabled: !!token,
  })
}

export function useInvitations(): UseQueryResult<Invitation[], ApiError> {
  const token = useAuthToken()
  return useQuery<Invitation[], ApiError>({
    queryKey: queryKeys.team.invitations,
    queryFn: () => teamService.listInvitations(token!),
    enabled: !!token,
  })
}

export function useAuditLog(): UseQueryResult<AuditLogEntry[], ApiError> {
  const token = useAuthToken()
  return useQuery<AuditLogEntry[], ApiError>({
    queryKey: queryKeys.audit.all,
    queryFn: () => auditService.list(token!),
    enabled: !!token,
  })
}
