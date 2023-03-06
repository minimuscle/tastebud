import { useLoaderData } from '@remix-run/react'
import { useState } from 'react'
import MapComponent from '~/components/MapComponent'
import Sidebar from '~/components/Sidebar'
import styles from '~/styles/index.css'

export default function Index() {
  const [latlng, setLatlng] = useState([0, 3])
  const API = useLoaderData()
  return (
    <div>
      <Sidebar latlng={latlng} />
      <MapComponent API={API} latlng={latlng} setLatlng={setLatlng} />
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
