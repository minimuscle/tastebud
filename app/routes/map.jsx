import { Outlet, useLoaderData } from '@remix-run/react'
import * as ReactDOMClient from 'react-dom/client'
import { useEffect, useRef, useState } from 'react'
import styles from '~/styles/index.css'
import mapboxstyles from 'mapbox-gl/dist/mapbox-gl.css'
import mapboxgl from 'mapbox-gl' // eslint-disable-line import/no-webpack-loader-syntax
import { createClient } from '@supabase/supabase-js'
import Sidebar from '~/components/map/Sidebar'
import geohash from 'ngeohash'
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import LocationPop from '~/components/map/LocationPop'

export default function Map() {
  const data = useLoaderData()
  const mapContainer = useRef(null)
  const map = useRef(null)
  const [coords, setCoords] = useState({
    lat: 144.9638,
    lng: -37.8148,
    zoom: 15,
  })
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [marker, addMarker] = useState([])
  const locations = useRef()

  //Intialize the map
  useEffect(() => {
    //onOpen()
    //Initialize map only once.
    if (!map.current) {
      //TODO: Add a spinner here and then remove in on "map.on load"
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

  //Set the markers
  useEffect(() => {
    if (!locations.current) return
    marker.forEach((item) => {
      item.remove()
    })
    let locationsList = []
    locations.current.forEach((item) => {
      const latlng = geohash.decode(item.hash)
      const popupNode = document.createElement('React.Fragment')
      const root = ReactDOMClient.createRoot(popupNode)
      root.render(
        <LocationPop
          location={item}
          // toggleModal={toggleModal}
          // setAddress={setAddress}
          // setLocationId={setLocationId}
        />
      )
      const point = new mapboxgl.Marker()
        .setLngLat([latlng.longitude, latlng.latitude])
        //The styling here will be temporary - this should probably be a custom popup
        .setPopup(new mapboxgl.Popup().setDOMContent(popupNode))
        .addTo(map.current)
      locationsList.push(point)

      point.getElement().addEventListener('mouseenter', (event) => {
        point.togglePopup()
      })
    })
    addMarker(marker.concat(locationsList))

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locations.current])

  return (
    <div id="map">
      <div ref={mapContainer} className="map-container" />
      <Sidebar
        categories={data.categories}
        coords={coords}
        locations={locations}
      />
      <Outlet />

      {/* This is only for the now. This should not stay here forever */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Attention</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              This is an early-access version of TasteBud. <br /> You may find
              many issues, or lack of feedback. <br />
              <br /> Forms may not work, or might not tell you they are. <br />
              <br /> Please submit any issues to:{' '}
              <a
                className="link"
                href="https://github.com/minimuscle/tastebud/issues"
                target="_blank"
                rel="noreferrer"
              >
                GitHub Issues
              </a>
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Ok</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}

export async function action({ request }) {
  const body = await request.formData()
  const [lat, lng] = body.get('coords').split(',')
  const category = body.get('category')

  const hash = geohash.encode(lat, lng, 5)
  const hashList = [hash, ...geohash.neighbors(hash)]
  const supabase = createClient(process.env.DATABASE, process.env.SUPABASE_KEY)
  let responses = []

  for (let i = 0; i < hashList.length; i++) {
    try {
      let { data } = await supabase
        .from('locations')
        .select('*')
        .like('hash', `${hashList[i]}%`)
        .like('category', `%${category}%`)
        .limit(50)
      const response = data
      responses = [...responses, ...response]
    } catch (e) {
      console.log(e)
    }
  }
  console.log(responses)

  responses.forEach(async (location) => {
    console.log(location.id)
    try {
      let { count } = await supabase
        .from('reviews')
        .select('*', { count: 'exact', head: true })
        .eq('location_id', `${location.id}`)
      const response = count
      console.log(`Number of reviews for ${location.name}: ${response}`)
      //responses = [...responses, ...response]
    } catch (e) {
      console.log(e)
    }
    try {
      let { data } = await supabase.rpc('average_reviews', {
        location_id_param: location.id,
      })
      //.eq('location_id', `${location.id}`)
      const response = data
      console.log(`Average review for ${location.name}: ${response}`)
      //responses = [...responses, ...response]
    } catch (e) {
      console.log(e)
    }
  })

  return responses
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
