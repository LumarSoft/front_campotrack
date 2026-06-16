/** Crop catalog (info.md §13). Used as the campaign's crop. */
export interface Crop {
  id: number
  name: string
  /** Optional sowing window (months 1-12) — feeds recommendations and hints. */
  sowingFromMonth: number | null
  sowingToMonth: number | null
}

export interface CreateCropRequest {
  name: string
  sowingFromMonth?: number
  sowingToMonth?: number
}

export interface UpdateCropRequest {
  name?: string
  sowingFromMonth?: number
  sowingToMonth?: number
}
