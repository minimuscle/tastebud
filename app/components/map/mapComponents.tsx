import {
  MarkerF,
  OverlayView,
  OverlayViewF,
  useGoogleMap,
} from '@react-google-maps/api'
import { useActionData, useFetcher, useSearchParams } from '@remix-run/react'
import { useEffect, useState } from 'react'
import type { SearchParamTypes } from '~/ts/interfaces/maps_interfaces'
import { useDisclosure } from '@chakra-ui/react'
import NoLocationPopup from './mapItems/NoLocationPopup'

export default function MapComponents() {
  const [searchParams, setSearchParams] = useSearchParams()
  const map = useGoogleMap()!
  const data = useActionData()
  const placeFetcher = useFetcher()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [latLng, setLatLng] = useState({ lat: -37.8148, lng: 144.9638 })

  const handleMapMove = async () => {
    console.log(map.getZoom())

    let newParams: SearchParamTypes = {}
    for (const [key, value] of searchParams.entries()) {
      newParams[key] = value
    }
    newParams['lat'] = map.getCenter()!.lat()
    newParams['lng'] = map.getCenter()!.lng()
    map.setCenter({ lat: newParams['lat'], lng: newParams['lng'] })
    // @ts-ignore
    setSearchParams(newParams)
  }

  const handleClick = async (event: any) => {
    if (event.placeId) {
      event.stop()
      //Search for the place ID on supabase before attempting to render the popup
      const placeId = event.placeId
      placeFetcher.submit({ placeId: placeId }, { method: 'post' })
      setLatLng({ lat: event.latLng.lat(), lng: event.latLng.lng() })
      onOpen()
    }
  }

  useEffect(() => {
    console.log(placeFetcher.data ? 'true' : 'none')
    const draggedListener = map.addListener('dragend', handleMapMove)
    const zoomListener = map.addListener('zoom_changed', handleMapMove)
    const listener = map.addListener('click', handleClick)

    return () => {
      draggedListener.remove()
      listener.remove()
      zoomListener.remove()
    }
  }, [map, searchParams, data])

  return (
    <>
      <OverlayViewF
        position={{ lat: latLng.lat, lng: latLng.lng }}
        mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
      >
        <NoLocationPopup
          isOpen={isOpen}
          onClose={onClose}
          fetchData={placeFetcher}
        />
      </OverlayViewF>
      <MarkerF
        visible={isOpen}
        position={{ lat: latLng.lat, lng: latLng.lng }}
        onClick={() => console.log('CLICKED')}
      />
    </>
  )
}
