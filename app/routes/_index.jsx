import { useLoadScript } from '@react-google-maps/api'
import { Outlet, useLoaderData } from '@remix-run/react'
import Map from '~/components/map/map'
import styles from '~/styles/index.css'

//This should provide the basic theming of the website, including a header and the map
export default function Index() {
  const loaderData = useLoaderData()

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: loaderData.GOOGLE_MAPS_API_KEY,
  })
  if (!isLoaded) return <div>Loading...</div>

  return (
    <div>
      <h1>index</h1>
      <Map />
      <Outlet />
    </div>
  )
}

export async function loader() {
  return { GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY }
}

//add styles via remix links
export function links() {
  return [{ rel: 'stylesheet', href: styles }]
}
