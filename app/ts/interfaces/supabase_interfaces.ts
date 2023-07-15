export interface Category {
  id: number
  value: string
  label: string
  svg?: string
}

export interface Location {
  id: number
  name: string
  address: string
  hash: string
  category?: Array<string>
}

export interface Review {
  id: number
  created_at: string
  user_id: string
  location_id: string
  rating: number
  comment?: string
  category: Array<string>
  heading: string
}
