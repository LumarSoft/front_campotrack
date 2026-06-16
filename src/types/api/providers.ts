import type { UserRole } from './common'

/** Supplier / vendor of inputs and services (managed in the "Costos" section). */
export interface Provider {
  id: number
  name: string
  contact: string | null
  notes: string | null
  costCount: number
  creatorRole: UserRole
}

export interface CreateProviderRequest {
  name: string
  contact?: string
  notes?: string
}

export interface UpdateProviderRequest {
  name?: string
  contact?: string
  notes?: string
}
