import { MarkerF, useGoogleMap } from '@react-google-maps/api'
import { useFetcher, useSearchParams } from '@remix-run/react'
import { useEffect } from 'react'
import type { SearchParamTypes } from '~/ts/interfaces/maps_interfaces'

export default function MapComponents() {
  const [searchParams, setSearchParams] = useSearchParams()
  const map = useGoogleMap()!
  const placeFetcher = useFetcher()

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
      console.log(placeId)
      placeFetcher.submit({ placeId: placeId }, { method: 'post' })
    }
  }

  useEffect(() => {
    const draggedListener = map.addListener('dragend', handleMapMove)
    const zoomListener = map.addListener('zoom_changed', handleMapMove)
    const listener = map.addListener('click', handleClick)

    return () => {
      draggedListener.remove()
      listener.remove()
      zoomListener.remove()
    }
  }, [map, searchParams])

  return (
    <div>
      <MarkerF
        position={{ lat: -37.8148, lng: 144.9638 }}
        onClick={() => console.log('CLICKED')}
      />
    </div>
  )
}
