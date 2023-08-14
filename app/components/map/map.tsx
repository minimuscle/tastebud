import { GoogleMap } from '@react-google-maps/api'
import { useSearchParams } from '@remix-run/react/dist'
import { useMemo } from 'react'
import MapComponents from '~/components/map/mapComponents'
import type { LatLng } from '~/ts/interfaces/maps_interfaces'

export default function Map() {
  const [searchParams] = useSearchParams()
  const lat = searchParams.get('lat') || '-37.8148'
  const lng = searchParams.get('lng') || '144.9638'

  const center = useMemo<LatLng>(
    () => ({ lat: parseFloat(lat), lng: parseFloat(lng) }),
    [lat, lng]
  )

  return (
    <GoogleMap
      zoom={15}
      center={center}
      mapContainerClassName="map-container"
      options={{
        mapTypeControl: false,
        streetViewControl: false,
      }}
    >
      <MapComponents />
    </GoogleMap>
  )
}
