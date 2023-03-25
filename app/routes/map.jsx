import { Outlet, useFetcher, useLoaderData, useSubmit } from '@remix-run/react'
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
  const fetcher = useFetcher()

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

  const search = (category) => {
    console.log(marker)
    marker.forEach((item) => {
      item.remove()
    })

    const hash = geohash.encode(coords.lng, coords.lat, 5)
    const hashList = [hash, ...geohash.neighbors(hash)]
    console.log('searching ' + hash)
    fetcher.submit({ hashList: hashList }, { method: 'post' })
  }

  return (
    <div id="map">
      <div ref={mapContainer} className="map-container" />
      <Sidebar
        categories={data.categories}
        search={() => search}
        coords={coords}
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
  const hashList = body.get('hashList')
  console.log(hashList)
  const supabase = createClient(process.env.DATABASE, process.env.SUPABASE_KEY)
  // let responses = []

  //   for (let i = 0; i < hashList.length; i++) {
  //     try {
  //       let { data } = await supabase
  //         .from('locations')
  //         .select('*')
  //         .like('hash', `${hashList[i]}%`)
  //       console.log(data)
  //       const response = data
  //       responses = [...responses, ...response]
  //     } catch (e) {
  //       console.log(e)
  //     }
  //   }
  return null
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
