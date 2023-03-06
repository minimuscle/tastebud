import { useLoaderData } from '@remix-run/react'
import MapComponent from '~/components/MapComponent'

export default function Index() {
  const API = useLoaderData()
  return (
    <div>
      <MapComponent API={API} />
    </div>
  )
}

export function loader() {
  const API = process.env.MAPS_ACCESS_TOKEN
  return API || null
}

export function links() {
  return [{ rel: 'stylesheet', href: '../styles/index.css' }]
}
