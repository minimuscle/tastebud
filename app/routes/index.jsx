import { useLoaderData } from "@remix-run/react"
import { useState } from "react"
import MapComponent from "~/components/MapComponent"
import styles from "~/styles/index.css"
import mapboxstyles from "mapbox-gl/dist/mapbox-gl.css"

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
  return [
    { rel: "stylesheet", href: styles },
    {
      rel: "stylesheet",
      href: mapboxstyles,
    },
  ]
}