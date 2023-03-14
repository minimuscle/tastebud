import { useLoaderData } from '@remix-run/react'
import MapComponent from '~/components/MapComponent'
import styles from '~/styles/index.css'
import mapboxstyles from 'mapbox-gl/dist/mapbox-gl.css'

export default function Index() {
  const API = useLoaderData()
  return (
    <div>
      <MapComponent API={API.MAP_API} STAGE={API.STAGE} />
    </div>
  )
}

export function loader() {
  const MAP_API = process.env.MAPS_ACCESS_TOKEN
  const STAGE = process.env.STAGE

  console.log(STAGE)
  const API = {
    MAP_API: MAP_API,
    STAGE: STAGE,
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
