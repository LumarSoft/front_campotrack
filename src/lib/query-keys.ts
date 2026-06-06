/**
 * Centralized React Query keys. Every query/mutation key lives here so cache
 * invalidation stays consistent across the app (see data-fetching rules).
 */
export const queryKeys = {
  auth: {
    login: ['auth', 'login'] as const,
    register: ['auth', 'register'] as const,
  },
} as const
