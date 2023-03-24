import { Outlet, useLoaderData } from '@remix-run/react'
import styles from '~/styles/index.css'
import mapboxstyles from 'mapbox-gl/dist/mapbox-gl.css'
import mapboxgl from 'mapbox-gl' // eslint-disable-line import/no-webpack-loader-syntax
import { createClient } from '@supabase/supabase-js'
import Sidebar from '~/components/map/Sidebar'
import { useEffect, useRef, useState } from 'react'

export default function Map() {
  const API = useLoaderData()
  const mapContainer = useRef(null)
  const map = useRef(null)
  const [coords, setCoords] = useState({
    lat: 144.9638,
    lng: -37.8148,
    zoom: 15,
  })
  mapboxgl.accessToken = API

  //Intialize the map
  useEffect(() => {
    //Initialize map only once.
    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12?optimize=true',
        center: [coords.lat, coords.lng],
        zoom: coords.zoom,
      })
      map.current.resize()
    }
    map.current.on('move', () => {
      setCoords({
        lat: map.current.getCenter().lng,
        lng: map.current.getCenter().lat,
        zoom: map.current.getZoom(),
      })
    })
  }, [])

  return (
    <div id="map">
      <div ref={mapContainer} className="map-container" />
      {/*<Sidebar
        food={food}
        setFood={setFood}
        search={search}
        addLocation={onOpen}
      />*/}
      {/* This code below is for adding items on top of the map, it is not needed now but left here to remind how to do so
      <Center id='overlay' className='map-area'>
      </Center>
      */}
      {/*<div>
      <h2>map</h2>
       <MapComponent
        API={API.MAP_API}
        SUPABASE={API.SUPABASE}
        SUPABASE_KEY={API.SUPABASE_KEY}
      /> 
    </div>*/}
      <Outlet />
    </div>
  )
}

export function loader() {
  const MAP_API = process.env.MAPS_ACCESS_TOKEN
  // const supabaseUrl = process.env.DATABASE
  // const supabaseKey = process.env.SUPABASE_KEY
  // console.log()
  // const API = {
  //   MAP_API: MAP_API,
  //   SUPABASE: supabaseUrl,
  //   SUPABASE_KEY: supabaseKey,
  // }
  // return API
  return MAP_API
}

export function links() {
  return [
    { rel: 'stylesheet', href: styles },
    {
      rel: 'stylesheet',
      href: mapboxstyles,
    },
  ]
}
