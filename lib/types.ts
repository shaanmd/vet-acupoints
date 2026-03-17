export type PointCategory =
  | 'Master Points'
  | 'Influential/Bone/Marrow'
  | 'Back-Shu & Front-Mu'
  | 'Five Shu Points'
  | 'Empirical & Distal'

export type Species = 'canine' | 'feline' | 'equine'

export interface Acupoint {
  id: string
  name: string
  alias?: string | null
  grouping: string
  tcm_indication: string
  western_indication: string
  category: PointCategory
  location_canine: string
  location_feline: string
  location_equine: string
}

export interface Favourite {
  id: string
  user_id: string
  acupoint_id: string
  created_at: string
}
