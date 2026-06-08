import type { UserRole } from './common'

/** A client groups fields (info.md §6). Optional — a field may have none. */
export interface Client {
  id: number
  name: string
  contact: string | null
  notes: string | null
  fieldCount: number
  creatorRole: UserRole
}

/** Minimal client shape embedded in field responses. */
export interface ClientSummary {
  id: number
  name: string
}

export interface CreateClientRequest {
  name: string
  contact?: string
  notes?: string
}

export interface UpdateClientRequest {
  name?: string
  contact?: string
  notes?: string
}
