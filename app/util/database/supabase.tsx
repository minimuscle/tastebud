import { createClient } from '@supabase/supabase-js'
import type { Location } from '~/ts/interfaces/supabase_interfaces'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
)

export const supabaseSelectAll = async (table: string) => {
  const { data, error } = await supabase.from(table).select('*')
  if (error) {
    console.log(error)
    return null
  }
  return data
}

export const supabaseSelectSingle = async (table: string) => {
  //await getClosestLocations(lat, lng, zoom)
  const { data, error } = await supabase.from(table).select('*').single()
  if (error) {
    console.log(error)
    return null
  }
  return data
}

export const supabaseSelectWhere = async (
  table: string,
  column: string,
  value: string
) => {
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .eq(column, value)
  if (error) {
    console.log(error)
    return null
  }
  return data
}

export const supabaseSelectWhereSingle = async (
  table: string,
  column: string,
  value: string
) => {
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .eq(column, value)
    .single()
  if (error) {
    console.log(error)
    return null
  }
  return data
}

export const supabaseSelectContains = async (
  table: string,
  column: string,
  value: string
) => {
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .contains(column, [value])
  if (error) {
    console.log(error)
    return null
  }
  return data
}

export const supabaseAverageReviews = async (location: string) => {
  const { data, error } = await supabase.rpc('average_reviews', {
    location_id_param: location,
  })
  if (error) {
    console.log(error)
    return null
  }
  return data
}

export const supabaseCountReviews = async (location: string) => {
  const { count, error } = await supabase
    .from('reviews')
    .select('*', { count: 'exact', head: true })
    .eq('location_id', location)
  if (error) {
    console.log(error)
    return null
  }
  return count
}

export const getAverageRatings = async (locations: Location[]) => {
  const averageRating = await Promise.all(
    locations.map(async (location) => {
      const average = await supabaseAverageReviews(location.id)
      return average || 0
    })
  )

  //get the count of reviews for each location
  const ratingsCount = await Promise.all(
    locations.map(async (location) => {
      const count = await supabaseCountReviews(location.id)
      return count || 0
    })
  )

  //combine ratingscount and averageRatings into an array of arrays
  const ratings = averageRating.map((rating: number, index) => {
    return [rating, ratingsCount[index]]
  })

  return ratings
}

export const getClosestLocations = async (
  lat: number,
  lng: number,
  zoom: number
) => {
  const { data, error } = await supabase.rpc('get_closest_locations', {
    current_lat: lat,
    current_lng: lng,
    distance_km: zoom,
  })
  if (error) {
    console.log(error)
    return null
  }
  return data
}

export const supabaseInsert = async (table: string, data: any) => {
  const { error } = await supabase.from(table).insert(data)
  if (error) {
    console.log(error)
    return null
  }
  return { status: 200 }
}
