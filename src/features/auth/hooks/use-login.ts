'use client'

import { useMutation, type UseMutationResult } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { authService } from '@/services/auth.service'
import { useAuthStore } from '@/features/auth/store/use-auth-store'
import { queryKeys } from '@/lib/query-keys'
import type { ApiError } from '@/lib/api-client'
import type { AuthResponse, LoginRequest } from '@/types/api/auth'

/**
 * Login mutation. On success it stores the session and redirects to the app;
 * the error is exposed via `mutation.error` for the form to surface.
 */
export function useLogin(): UseMutationResult<AuthResponse, ApiError, LoginRequest> {
  const router = useRouter()
  const setSession = useAuthStore(state => state.setSession)

  return useMutation<AuthResponse, ApiError, LoginRequest>({
    mutationKey: queryKeys.auth.login,
    mutationFn: authService.login,
    onSuccess: ({ accessToken, user }) => {
      setSession(accessToken, user)
      router.push('/billing')
    },
  })
}
