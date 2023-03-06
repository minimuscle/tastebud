import { useLoaderData } from '@remix-run/react'
import MapComponent from '~/components/MapComponent'
import Sidebar from '~/components/Sidebar'
import styles from '~/styles/index.css'

export default function Index() {
  const API = useLoaderData()
  return (
    <div>
      <Sidebar />
      <MapComponent API={API} />
    </div>
  )
}

export function loader() {
  const API = process.env.MAPS_ACCESS_TOKEN
  return API || null
}

export function links() {
  return [{ rel: 'stylesheet', href: styles }]
}
