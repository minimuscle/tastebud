export interface Category {
  id: number
  value: string
  label: string
  svg?: string
}

export interface Location {
  id: string
  name: string
  address: string
  category?: Array<string>
  lat: number
  lng: number
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
