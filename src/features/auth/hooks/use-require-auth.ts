'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/features/auth/store/use-auth-store'
import { useHydrated } from '@/hooks/use-hydrated'
import type { AuthUser } from '@/types/api/auth'

interface RequireAuthResult {
  /** True once the persisted store has hydrated and a session exists. */
  ready: boolean
  user: AuthUser | null
}

/**
 * Client-side route guard for the app shell. Waits for hydration before
 * deciding, then redirects to /login when there is no session. Session must
 * survive reloads/offline (info.md §15), hence the persisted localStorage store.
 */
export function useRequireAuth(): RequireAuthResult {
  const router = useRouter()
  const user = useAuthStore(state => state.user)
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  const hydrated = useHydrated()

  useEffect(() => {
    if (hydrated && !isAuthenticated) router.replace('/login')
  }, [hydrated, isAuthenticated, router])

  return { ready: hydrated && isAuthenticated && user !== null, user }
}
