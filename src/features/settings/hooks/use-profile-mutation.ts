'use client'

import { useMutation, type UseMutationResult } from '@tanstack/react-query'
import { toast } from 'sonner'
import { authService } from '@/services/auth.service'
import { useAuthStore } from '@/features/auth/store/use-auth-store'
import { useAuthToken } from '@/features/auth/hooks/use-auth-token'
import type { ApiError } from '@/lib/api-client'
import type { AuthUser, UpdateProfileRequest } from '@/types/api/auth'

/** Updates the current user's profile and refreshes the persisted session. */
export function useUpdateProfile(): UseMutationResult<AuthUser, ApiError, UpdateProfileRequest> {
  const token = useAuthToken()
  const updateUser = useAuthStore(state => state.updateUser)
  return useMutation<AuthUser, ApiError, UpdateProfileRequest>({
    mutationFn: payload => authService.updateProfile(payload, token!),
    onSuccess: user => {
      updateUser(user)
      toast.success('Perfil actualizado')
    },
    onError: error => toast.error(error.message),
  })
}
