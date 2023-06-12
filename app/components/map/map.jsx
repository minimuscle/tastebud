import { GoogleMap, MarkerF, InfoBox, InfoWindow } from '@react-google-maps/api'
import { useSearchParams } from '@remix-run/react/dist'
import { useMemo } from 'react'
import PoiPopup from '~/components/map/poiPopup'
import * as ReactDOMClient from 'react-dom/client'

export default function Map() {
  const [searchParams, setSearchParams] = useSearchParams()
  const lat = searchParams.get('lat') || -37.8148
  const lng = searchParams.get('lng') || 144.9638

  const mapLoad = (map) => {
    map.addListener('click', (event) => {
      if (event.placeId) {
        event.stop()

        // Create a new InfoWindow object
        const infowindow = new window.google.maps.InfoWindow()

        // Create a new React.Fragment element to hold the React component
        const popupNode = document.createElement('React.Fragment')

        // Create a new React root and render the PoiPopup component into it
        const root = ReactDOMClient.createRoot(popupNode)
        root.render(<PoiPopup />)

        // Set the position and content of the InfoWindow object
        infowindow.setPosition(event.latLng)
        infowindow.setContent(popupNode)

        // Open the InfoWindow object on the map
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
