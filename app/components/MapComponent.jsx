import React, { useRef, useEffect, useState } from 'react'
import mapboxgl from 'mapbox-gl' // eslint-disable-line import/no-webpack-loader-syntax
import Sidebar from '~/components/Sidebar'
import {
  Center,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Text,
  Input,
  Box,
  Container,
  VStack,
  StackDivider,
} from '@chakra-ui/react'
import NewLocation from '~/routes/NewLocation'

export default function MapComponent(props) {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const [lng, setLng] = useState(144.96)
  const [lat, setLat] = useState(-37.82)
  const [food, setFood] = useState('')
  const [zoom, setZoom] = useState(13)
  const [marker, addMarker] = useState([])
  const [searchResults, setSearchResults] = useState([])
  const [results, setResults] = useState(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [locationModal, setLocationModal] = useState(false)
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
  })

  const search = async () => {
    console.log('searching')
    const data = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/restaurant.json?proximity=${lng}%2C${lat}&limit=10&access_token=${props.API}`
    )
    const response = await data.json()

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

  useEffect(() => {
    console.log(searchResults)
    const items = (
      <VStack divider={<StackDivider borderColor='gray.200' />} align='stretch'>
        {searchResults.map((item, key) => {
          return (
            <Box
              key={key}
              _hover={{ background: 'gray.200' }}
              p='2'
              borderRadius='7.5px'
            >
              <Text
                align='left'
                as='button'
                onClick={() => {
                  closeSearch()
                  setLocationModal(true)
                }}
              >
                {item.place_name}
              </Text>
            </Box>
          )
        })}
      </VStack>
    )
    setResults(items)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchResults])

  const suggest = async (e) => {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${e.target.value}.json?proximity=${lng}%2C${lat}&country=au&limit=10&access_token=${props.API}`
    const response = await (await fetch(url)).json()
    setSearchResults(response.features)
  }

  const closeSearch = () => {
    onClose()
    setSearchResults([])
  }

  // ! This should contain the sidebar here so that any data can be passed to it via props, as it doesnt need to be a separate component
  // ? should it be named sidebar, or overlay? Separate component or part of the map - I think separate.
  return (
    <div id='map'>
      <div ref={mapContainer} className='map-container' />
      <Modal isOpen={isOpen} onClose={closeSearch}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add new location</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              autoFocus
              placeholder='Search for location...'
              onChange={suggest}
            />
            <Container
              borderWidth='1px'
              borderRadius='lg'
              boxShadow='2xl'
              bg='white'
              className='search-results'
              hidden={searchResults.length > 0 ? false : true}
            >
              {results}
            </Container>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={locationModal} onClose={() => setLocationModal(false)}>
        <NewLocation />
      </Modal>

      <Sidebar
        food={food}
        setFood={setFood}
        search={search}
        addLocation={onOpen}
      />
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
