import { IconButton } from "@chakra-ui/react"
import {
  GoogleMap,
  MarkerF,
  InfoBox,
  InfoWindow,
  useGoogleMap,
} from "@react-google-maps/api"
import { useFetcher, useSearchParams } from "@remix-run/react/dist"
import { useEffect, useMemo } from "react"
import MapComponents from "~/components/map/mapComponents"
import { LatLng } from "~/ts/interfaces/maps_interfaces"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"
import type { Dispatch, SetStateAction } from "react"

export default function Map() {
  const [searchParams, setSearchParams] = useSearchParams()
  const lat = searchParams.get("lat") || -37.8148
  const lng = searchParams.get("lng") || 144.9638

  const center = useMemo<LatLng>(() => ({ lat: -37.8148, lng: 144.9638 }), [])
  return (
    <GoogleMap
      zoom={15}
      center={center}
      mapContainerClassName='map-container'
      options={{
        mapTypeControl: false,
        streetViewControl: false,
      }}
    >
      <MapComponents />
    </GoogleMap>
  )
}
