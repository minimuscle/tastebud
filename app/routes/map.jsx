import { Outlet, useLoaderData } from '@remix-run/react'
import { useEffect, useRef, useState } from 'react'
import styles from '~/styles/index.css'
import mapboxstyles from 'mapbox-gl/dist/mapbox-gl.css'
import mapboxgl from 'mapbox-gl' // eslint-disable-line import/no-webpack-loader-syntax
import { createClient } from '@supabase/supabase-js'
import Sidebar from '~/components/map/Sidebar'
import AddLocationModal from '~/routes/map/add'
import { useDisclosure } from '@chakra-ui/react'

export default function Map() {
  const data = useLoaderData()
  const mapContainer = useRef(null)
  const map = useRef(null)
  const [coords, setCoords] = useState({
    lat: 144.9638,
    lng: -37.8148,
    zoom: 15,
  })

  //Intialize the map
  useEffect(() => {
    //Initialize map only once.
    if (!map.current) {
      mapboxgl.accessToken = data.MAP_API
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const search = () => {}

  return (
    <div id="map">
      <div ref={mapContainer} className="map-container" />
      <Sidebar categories={data.categories} search={search} />
      {/* This code below is for adding items on top of the map, it is not needed now but left here to remind how to do so
      <Center id='overlay' className='map-area'>
      </Center>
      */}
      <Outlet />
    </div>
  )
}

export async function loader() {
  const MAP_API = process.env.MAPS_ACCESS_TOKEN
  const supabase = createClient(process.env.DATABASE, process.env.SUPABASE_KEY)
  const categories = await supabase.from('categories').select()
  const data = {
    MAP_API: MAP_API,
    categories: categories.data,
  }
  return data
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
