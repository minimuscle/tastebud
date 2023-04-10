import {
  Outlet,
  useLoaderData,
  useNavigate,
  useOutletContext,
} from '@remix-run/react'
import { json } from '@remix-run/node'
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
import { createServerClient } from '@supabase/auth-helpers-remix'
import Profile from '~/components/map/Profile'

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
  const navigate = useNavigate()
  const supabase = useOutletContext().supabase

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
    console.log(locations.current)
    let locationsList = []
    locations.current.forEach((item) => {
      const latlng = geohash.decode(item.location.hash)
      const popupNode = document.createElement('React.Fragment')
      const root = ReactDOMClient.createRoot(popupNode)
      root.render(
        <LocationPop
          location={item.location}
          count={item.count}
          average={item.data}
          togglePage={togglePage}
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
        //fetcher.submit({ intent: 'popup' }, { method: 'POST' })
      })
    })
    addMarker(marker.concat(locationsList))

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locations.current])

  const togglePage = (location_id) => {
    navigate(`./${location_id}`)
  }

  return (
    <div id="map">
      <div ref={mapContainer} className="map-container" />
      <Sidebar
        categories={data.categories}
        coords={coords}
        locations={locations}
      />
      <Profile supabase={supabase} />
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

  const queries = hashList.map((hash) => {
    return supabase
      .from('locations')
      .select('*')
      .like('hash', `${hash}%`)
      .like('category', `%${category}%`)
      .limit(50)
      .then((response) => response.data)
      .catch((e) => {
        console.log(e)
        return []
      })
  })

  const responses = await Promise.all(queries).then((results) => {
    return results.reduce((acc, val) => [...acc, ...val], [])
  })

  console.log(responses)
  const reply = await Promise.all(
    responses.map(async (location) => {
      try {
        const { count } = await supabase
          .from('reviews')
          .select('*', { count: 'exact', head: true })
          .eq('location_id', `${location.id}`)

        const { data } = await supabase.rpc('average_reviews', {
          location_id_param: location.id,
        })

        return {
          location,
          count,
          data,
        }
      } catch (e) {
        console.log(e)
        return null
      }
    })
  ).then((responses) => responses.filter(Boolean))
  console.log(reply)
  return reply
}

export async function loader({ request }) {
  const response = new Response()
  const supabase = createServerClient(
    process.env.DATABASE,
    process.env.SUPABASE_KEY,
    {
      request,
      response,
    }
  )
  const categories = await supabase.from('categories').select()
  const data = {
    MAP_API: process.env.MAPS_ACCESS_TOKEN,
    categories: categories.data,
    supabase: {
      DATABASE: process.env.DATABASE,
      SUPABASE_KEY: process.env.SUPABASE_KEY,
    },
  }

  return json(data, { headers: response.headers })
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
