'use client'

import { useMutation, useQuery, type UseMutationResult, type UseQueryResult } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { teamService } from '@/services/team.service'
import { useAuthStore } from '@/features/auth/store/use-auth-store'
import type { ApiError } from '@/lib/api-client'
import type { AcceptInvitationRequest, InvitationPreview } from '@/types/api/team'

export function useInvitationPreview(token: string): UseQueryResult<InvitationPreview, ApiError> {
  return useQuery<InvitationPreview, ApiError>({
    queryKey: ['invitation', token],
    queryFn: () => teamService.previewInvitation(token),
    retry: false,
  })
}

/** Accepts the invitation, stores the new session and lands in the dashboard. */
export function useAcceptInvitation(token: string): UseMutationResult<void, ApiError, AcceptInvitationRequest> {
  const router = useRouter()
  const setSession = useAuthStore(state => state.setSession)
  return useMutation<void, ApiError, AcceptInvitationRequest>({
    mutationFn: async payload => {
      const response = await teamService.acceptInvitation(token, payload)
      setSession(response.accessToken, response.user)
    },
    onSuccess: () => router.replace('/dashboard'),
  })
}
