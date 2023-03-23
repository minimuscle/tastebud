import { useLoaderData } from '@remix-run/react'
import MapComponent from '~/components/MapComponent'
import styles from '~/styles/index.css'
import mapboxstyles from 'mapbox-gl/dist/mapbox-gl.css'
import { createClient } from '@supabase/supabase-js'

export default function Index() {
  const API = useLoaderData()
  return (
    <div>
      <MapComponent
        API={API.MAP_API}
        SUPABASE={API.SUPABASE}
        SUPABASE_KEY={API.SUPABASE_KEY}
      />
    </div>
  )
}

export function loader() {
  const MAP_API = process.env.MAPS_ACCESS_TOKEN
  const supabaseUrl = process.env.DATABASE
  const supabaseKey = process.env.SUPABASE_KEY

  console.log()
  const API = {
    MAP_API: MAP_API,
    SUPABASE: supabaseUrl,
    SUPABASE_KEY: supabaseKey,
  }
  return API
}

export function links() {
  return [
    { rel: 'stylesheet', href: styles },
    {
      rel: 'stylesheet',
      href: mapboxstyles,
    },
  ]
}
