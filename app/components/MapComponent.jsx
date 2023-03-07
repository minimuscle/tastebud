import React, { useRef, useEffect, useState } from "react"
import mapboxgl from "mapbox-gl" // eslint-disable-line import/no-webpack-loader-syntax
import Sidebar from "~/components/Sidebar"

export default function MapComponent(props) {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const [lng, setLng] = useState(144.96)
  const [lat, setLat] = useState(-37.82)
  const [food, setFood] = useState("")
  const [zoom, setZoom] = useState(12)
  mapboxgl.accessToken = props.API

  useEffect(() => {
    if (map.current) return // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lng, lat],
      zoom: zoom,
    })

    document.addEventListener("DOMContentLoaded", () => map.resize())
  })

  //TODO: This needs to update the sidebar
  useEffect(() => {
    if (!map.current) return // wait for map to initialize
    map.current.on("move", () => {
      setLng(map.current.getCenter().lng.toFixed(4))
      setLat(map.current.getCenter().lat.toFixed(4))
      setZoom(map.current.getZoom().toFixed(2))
    })
    map.current.on("contextmenu", () => {
      console.log("CLICKED")
    })
    console.log(lat)
  })

  // ! This should contain the sidebar here so that any data can be passed to it via props, as it doesnt need to be a separate component
  // ? should it be named sidebar, or overlay? Separate component or part of the map - I think separate.
  return (
    <div id='map'>
      <div id='overlay'>
        <Sidebar setFood={setFood} food={food} />
        <div className='mapview overlay'>
          <h1>Hi</h1>
        </div>
      </div>

      <div ref={mapContainer} className='map-container' />
    </div>
  )
}
