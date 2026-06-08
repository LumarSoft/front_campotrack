import type { UserRole } from './common'
import type { Crop } from './crops'

/** Annual agricultural cycle (info.md §6). Dates arrive as ISO strings. */
export interface Campaign {
  id: number
  cycle: string
  ha: number
  creatorRole: UserRole
  crop: Crop
  fieldId: number | null
  subdivisionId: number | null
  fieldName: string
  subdivisionName: string | null
  sowingDateEst: string | null
  harvestDateEst: string | null
}

export interface CreateCampaignRequest {
  fieldId?: number
  subdivisionId?: number
  cycle: string
  cropId: number
  sowingDateEst?: string
  harvestDateEst?: string
  ha: number
}

export interface UpdateCampaignRequest {
  cycle?: string
  cropId?: number
  sowingDateEst?: string
  harvestDateEst?: string
  ha?: number
}
