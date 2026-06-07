'use client'

import { useAuthStore } from '@/features/auth/store/use-auth-store'

/** Current session token, or null when there is no active session. */
export function useAuthToken(): string | null {
  return useAuthStore(state => state.token)
}
