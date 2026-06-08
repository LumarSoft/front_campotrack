import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthUser } from '@/types/api/auth'

/**
 * Shared auth client state: the current session token and user. Holds data
 * only — no API calls or business logic live here (see state-management rules).
 * Persisted to localStorage so the session survives reloads.
 */
interface AuthState {
  token: string | null
  user: AuthUser | null
  isAuthenticated: boolean
  setSession: (token: string, user: AuthUser) => void
  /** Updates the current user (e.g. after editing the profile) keeping the token. */
  updateUser: (user: AuthUser) => void
  clearSession: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      token: null,
      user: null,
      isAuthenticated: false,
      setSession: (token, user) => set({ token, user, isAuthenticated: true }),
      updateUser: user => set({ user }),
      clearSession: () => set({ token: null, user: null, isAuthenticated: false }),
    }),
    {
      name: 'campotrack-auth',
      partialize: state => ({ token: state.token, user: state.user, isAuthenticated: state.isAuthenticated }),
    },
  ),
)
