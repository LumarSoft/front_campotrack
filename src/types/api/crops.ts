/** Crop catalog (info.md §13). Used as the campaign's crop. */
export interface Crop {
  id: number
  name: string
}

export interface CreateCropRequest {
  name: string
}

export interface UpdateCropRequest {
  name: string
}
