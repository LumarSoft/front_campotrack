'use client'

import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query'
import { toast } from 'sonner'
import { teamService } from '@/services/team.service'
import { useAuthToken } from '@/features/auth/hooks/use-auth-token'
import { queryKeys } from '@/lib/query-keys'
import type { ApiError } from '@/lib/api-client'
import type { CreateInvitationRequest, Invitation, TeamMember, UpdateMemberRequest } from '@/types/api/team'

function notifyError(error: ApiError): void {
  toast.error(error.message)
}

export function useCreateInvitation(): UseMutationResult<Invitation, ApiError, CreateInvitationRequest> {
  const token = useAuthToken()
  const queryClient = useQueryClient()
  return useMutation<Invitation, ApiError, CreateInvitationRequest>({
    mutationFn: payload => teamService.createInvitation(payload, token!),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.team.invitations })
      toast.success('Invitación creada')
    },
    onError: notifyError,
  })
}

export function useRevokeInvitation(): UseMutationResult<void, ApiError, number> {
  const token = useAuthToken()
  const queryClient = useQueryClient()
  return useMutation<void, ApiError, number>({
    mutationFn: id => teamService.revokeInvitation(id, token!),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.team.invitations })
      toast.success('Invitación revocada')
    },
    onError: notifyError,
  })
}

interface UpdateMemberVars {
  id: number
  payload: UpdateMemberRequest
}

export function useUpdateMember(): UseMutationResult<TeamMember, ApiError, UpdateMemberVars> {
  const token = useAuthToken()
  const queryClient = useQueryClient()
  return useMutation<TeamMember, ApiError, UpdateMemberVars>({
    mutationFn: ({ id, payload }) => teamService.updateMember(id, payload, token!),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.team.members })
      toast.success('Miembro actualizado')
    },
    onError: notifyError,
  })
}

export function useRemoveMember(): UseMutationResult<void, ApiError, number> {
  const token = useAuthToken()
  const queryClient = useQueryClient()
  return useMutation<void, ApiError, number>({
    mutationFn: id => teamService.removeMember(id, token!),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.team.members })
      toast.success('Acceso revocado')
    },
    onError: notifyError,
  })
}
