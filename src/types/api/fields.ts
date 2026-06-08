import type { UserRole } from './common'
import type { ClientSummary } from './clients'
import type { Crop } from './crops'

export interface Subdivision {
  id: number
  name: string
  ha: number
  locationId: number
  creatorRole: UserRole
}

export interface FieldLocation {
  id: number
  locality: string
  lat: number | null
  lng: number | null
  ha: number
  subdivisions: Subdivision[]
}

/** Campaign as embedded in a field detail (dates arrive as ISO strings). */
export interface FieldCampaign {
  id: number
  cycle: string
  ha: number
  creatorRole: UserRole
  crop: Crop
  fieldId: number | null
  subdivisionId: number | null
  sowingDateEst: string | null
  harvestDateEst: string | null
}

export interface FieldListItem {
  id: number
  name: string
  totalHa: number
  creatorRole: UserRole
  clients: ClientSummary[]
  locationCount: number
  subdivisionCount: number
  campaignCount: number
  latestCampaign: { id: number; cycle: string; cropName: string } | null
}

export interface FieldDetail {
  id: number
  name: string
  totalHa: number
  creatorRole: UserRole
  clients: ClientSummary[]
  locations: FieldLocation[]
  subdivisions: Subdivision[]
  campaigns: FieldCampaign[]
}

export interface CreateFieldRequest {
  name: string
  totalHa: number
  clientIds?: number[]
}

export interface UpdateFieldRequest {
  name?: string
  totalHa?: number
  clientIds?: number[]
}

export interface CreateLocationRequest {
  locality: string
  lat?: number
  lng?: number
  ha: number
}

export interface CreateSubdivisionRequest {
  locationId: number
  name: string
  ha: number
}

export interface UpdateSubdivisionRequest {
  locationId?: number
  name?: string
  ha?: number
}
