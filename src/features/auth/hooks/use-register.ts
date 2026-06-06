'use client'

import { useMutation, type UseMutationResult } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { authService } from '@/services/auth.service'
import { useAuthStore } from '@/features/auth/store/use-auth-store'
import { queryKeys } from '@/lib/query-keys'
import type { ApiError } from '@/lib/api-client'
import type { AuthResponse, RegisterRequest } from '@/types/api/auth'

/**
 * Registration mutation. On success it stores the session (the API returns a
 * token on register) and redirects into the app.
 */
export function useRegister(): UseMutationResult<AuthResponse, ApiError, RegisterRequest> {
  const router = useRouter()
  const setSession = useAuthStore(state => state.setSession)

  return useMutation<AuthResponse, ApiError, RegisterRequest>({
    mutationKey: queryKeys.auth.register,
    mutationFn: authService.register,
    onSuccess: ({ accessToken, user }) => {
      setSession(accessToken, user)
      router.push('/billing')
    },
  })
}
