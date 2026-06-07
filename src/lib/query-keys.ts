/**
 * Centralized React Query keys. Every query/mutation key lives here so cache
 * invalidation stays consistent across the app (see data-fetching rules).
 */
export const queryKeys = {
  auth: {
    login: ['auth', 'login'] as const,
    register: ['auth', 'register'] as const,
  },
  crops: {
    all: ['crops'] as const,
  },
  clients: {
    all: ['clients'] as const,
  },
  fields: {
    all: ['fields'] as const,
    detail: (id: number) => ['fields', id] as const,
  },
  campaigns: {
    all: ['campaigns'] as const,
  },
  events: {
    all: ['events'] as const,
  },
  records: {
    all: ['records'] as const,
  },
  team: {
    members: ['team', 'members'] as const,
    invitations: ['team', 'invitations'] as const,
  },
  audit: {
    all: ['audit'] as const,
  },
  finance: {
    costs: ['finance', 'costs'] as const,
    incomes: ['finance', 'incomes'] as const,
    quotes: ['finance', 'quotes'] as const,
  },
} as const
