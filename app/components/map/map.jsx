import { GoogleMap, MarkerF, InfoBox, InfoWindow } from '@react-google-maps/api'
import { useFetcher, useSearchParams } from '@remix-run/react/dist'
import { useEffect, useMemo } from 'react'
import PoiPopup from '~/components/map/poiPopup'
import * as ReactDOMClient from 'react-dom/client'

export default function Map() {
  const [searchParams, setSearchParams] = useSearchParams()
  const lat = searchParams.get('lat') || -37.8148
  const lng = searchParams.get('lng') || 144.9638
  const placeFetcher = useFetcher()

  useEffect(() => {
    console.log(placeFetcher.state)
  }, [placeFetcher.state])

  const mapLoad = (map) => {
    map.addListener('click', (event) => {
      if (event.placeId) {
        event.stop()
        //Search for the place ID on supabase before attempting to render the popup
        const placeId = event.placeId
        placeFetcher.submit({ placeId: placeId }, { method: 'post' })

        //FIXME: This doesn't actually wait yet. It needs to await the fetcher
        placeFetcher.state === 'idle' &&
          placeFetcher.data &&
          console.log(placeFetcher.data)

        // Create a new React.Fragment element to hold the React component
        // Create a new React root and render the PoiPopup component into it
        const infowindow = new window.google.maps.InfoWindow()
        const popupNode = document.createElement('React.Fragment')
        const root = ReactDOMClient.createRoot(popupNode)
        root.render(<PoiPopup />)
        infowindow.setPosition(event.latLng)
        infowindow.setContent(popupNode)
        infowindow.open(map)
      }
    })
  }

  const center = useMemo(() => ({ lat: -37.8148, lng: 144.9638 }), [])
  return (
    <GoogleMap
      zoom={15}
      center={center}
      mapContainerClassName="map-container"
      onLoad={(map) => {
        mapLoad(map)
      }}
    >
      <InfoWindow position={center}>
        <PoiPopup />
      </InfoWindow>
      <MarkerF position={{ lat: -37.8148, lng: 144.9638 }} />
    </GoogleMap>
  )
}
