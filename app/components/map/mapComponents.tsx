import { MarkerF, useGoogleMap } from "@react-google-maps/api"
import { useFetcher } from "@remix-run/react"
import { useEffect } from "react"
import PoiPopup from "~/components/map/mapItems/poiPopup"
import * as ReactDOMClient from "react-dom/client"

export default function MapComponents() {
  const map = useGoogleMap()
  const placeFetcher = useFetcher()

  useEffect(() => {
    const listener = map!.addListener("click", async (event: any) => {
      if (event.placeId) {
        console.log(event)
        event.stop()
        //Search for the place ID on supabase before attempting to render the popup
        const placeId = event.placeId
        placeFetcher.submit({ placeId: placeId }, { method: "post" })
      }
    })
    return () => {
      listener.remove()
    }
  }, [map, placeFetcher])

  // useEffect(() => {
  //     if (placeFetcher.state === 'idle' && placeFetcher.data) {
  //         console.log('placeFetcher.data', placeFetcher.data)
  //         const infowindow = new window.google.maps.InfoWindow()
  //         const popupNode = document.createElement('React.Fragment')
  //         const root = ReactDOMClient.createRoot(popupNode)
  //         root.render(<PoiPopup />)
  //         infowindow.setPosition(-37.8148, 144.9638)
  //         infowindow.setContent(popupNode)
  //         infowindow.open(map)
  //     }
  // }, [placeFetcher, map])

  return (
    <div>
      <MarkerF
        position={{ lat: -37.8148, lng: 144.9638 }}
        onClick={() => console.log("CLICKED")}
      />
    </div>
  )
}
