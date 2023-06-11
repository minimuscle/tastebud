import { GoogleMap, useLoadScript, MarkerF } from '@react-google-maps/api'
import { useMemo } from 'react'

export default function Map() {
  const center = useMemo(() => ({ lat: -37.8148, lng: 144.9638 }), [])
  return (
    <GoogleMap zoom={15} center={center} mapContainerClassName="map-container">
      <MarkerF position={{ lat: -37.8148, lng: 144.9638 }} />
    </GoogleMap>
  )
}
