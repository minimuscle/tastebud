import React, { useRef, useEffect, useState } from 'react'
import mapboxgl from 'mapbox-gl' // eslint-disable-line import/no-webpack-loader-syntax
import Sidebar from '~/components/Sidebar'
import { Center, Button } from '@chakra-ui/react'

export default function MapComponent(props) {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const [lng, setLng] = useState(144.96)
  const [lat, setLat] = useState(-37.82)
  const [food, setFood] = useState('')
  const [zoom, setZoom] = useState(13)
  const [marker, addMarker] = useState([])
  mapboxgl.accessToken = props.API

  useEffect(() => {
    if (map.current) return // initialize map only once
    navigator.geolocation.getCurrentPosition((pos) => {
      setLat(pos.coords.latitude)
      setLng(pos.coords.longitude)
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [pos.coords.longitude, pos.coords.latitude],
        zoom: zoom,
      })

      document.addEventListener('DOMContentLoaded', () => map.resize())
    })
  })

  //TODO: This needs to update the sidebar
  useEffect(() => {
    if (!map.current) return // wait for map to initialize
    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4))
      setLat(map.current.getCenter().lat.toFixed(4))
      setZoom(map.current.getZoom().toFixed(2))
    })
    map.current.on('contextmenu', () => {
      console.log('CLICKED')
    })
    console.log(lat)
  })

  const search = async () => {
    console.log('searching')
    const data = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/restaurant.json?proximity=${lng}%2C${lat}&limit=10&access_token=${props.API}`
    )
    const response = await data.json()
    console.log(response)

    marker.forEach((item) => {
      item.remove()
    })

    //Map locations for the area
    let locations = []
    response.features.map((location, key) => {
      locations.push(
        new mapboxgl.Marker()
          .setLngLat([location.center[0], location.center[1]])
          .addTo(map.current)
      )
      return console.log(locations)
    })
    addMarker(marker.concat(locations))
    console.log(marker)
  }

  // ! This should contain the sidebar here so that any data can be passed to it via props, as it doesnt need to be a separate component
  // ? should it be named sidebar, or overlay? Separate component or part of the map - I think separate.
  return (
    <div id='map'>
      <div ref={mapContainer} className='map-container' />
      <Sidebar food={food} setFood={setFood} search={search} />
      <Center id='overlay' className='map-area'>
        <Button
          size='sm'
          bg='white'
          mt={4}
          hidden={!food}
          className='clickable'
        >
          Search Area For {food.slice(-1) === 's' ? food : `${food}s`}
        </Button>
      </Center>
    </div>
  )
}
