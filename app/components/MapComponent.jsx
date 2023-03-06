import React, { useRef, useEffect, useState } from 'react'
import mapboxgl from 'mapbox-gl' // eslint-disable-line import/no-webpack-loader-syntax

export default function MapComponent(props) {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const [lng, setLng] = useState(-70.9)
  const [lat, setLat] = useState(42.35)
  const [zoom, setZoom] = useState(9)
  mapboxgl.accessToken = props.API

  useEffect(() => {
    if (map.current) return // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      attributionControl: true,
      center: [lng, lat],
      zoom: zoom,
    })

    document.addEventListener('DOMContentLoaded', () => map.resize())
  })

  return (
    <div>
      <div ref={mapContainer} className='map-container' />
    </div>
  )
}
