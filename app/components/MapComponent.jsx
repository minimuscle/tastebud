import { useRef, useEffect, useState } from "react"
import mapboxgl from "mapbox-gl" // eslint-disable-line import/no-webpack-loader-syntax
import Sidebar from "~/components/Sidebar"
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
  Heading,
} from "@chakra-ui/react"
import geohash from "ngeohash"
import NewLocation from "~/components/NewLocation"

export default function MapComponent(props) {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const [lng, setLng] = useState(144.9638)
  const [lat, setLat] = useState(-37.8148)
  const [food, setFood] = useState("")
  const [zoom, setZoom] = useState(15)
  const [marker, addMarker] = useState([])
  const [chosen, setChosen] = useState(null)
  const [searchResults, setSearchResults] = useState([])
  const [results, setResults] = useState(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [locationModal, setLocationModal] = useState(false)
  const [coords, setCoords] = useState({ x: 0, y: 0 })
  mapboxgl.accessToken = props.API

  useEffect(() => {
    if (map.current) return // initialize map only once
    navigator.geolocation.getCurrentPosition((pos) => {
      setLat(pos.coords.latitude)
      setLng(pos.coords.longitude)
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [lng, lat],
        zoom: zoom,
      })

      document.addEventListener("DOMContentLoaded", () => map.resize())
    })
  })

  //TODO: This needs to update the sidebar
  useEffect(() => {
    if (!map.current) return // wait for map to initialize
    map.current.on("move", () => {
      setLng(map.current.getCenter().lng)
      setLat(map.current.getCenter().lat)
      setZoom(map.current.getZoom())
    })
    map.current.on("contextmenu", () => {
      console.log("CLICKED")
    })
  })

  const search = async () => {
    //Removes the markers before re-adding them via this search
    console.log(marker)
    marker.forEach((item) => {
      item.remove()
    })
    //This sets the size of the area to search by using significant figures for the geohash
    const precision = zoom >= 18 ? 7 : zoom >= 14 ? 6 : 5
    //! //FIXME: This needs to be dynamic
    //TODO: This should search a wider area but return less results. It should cache the geohash location(s) (to 5 precision) and then use that.
    const hash = geohash.encode(lat, lng, 5)
    const hashList = [...geohash.neighbors(hash), hash]
    console.log(hashList)
    console.log("searching " + hash)
    let responses = []

    for (let i = 0; i < hashList.length; i++) {
      try {
        const url = `https://wwi4q03ohh.execute-api.ap-southeast-2.amazonaws.com/${props.STAGE}/location/get`
        const data = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ hash: hashList[i] }),
        })
        const response = await data.json()
        responses = [...responses, ...response]
      } catch (e) {
        console.log(e)
      }
    }

    console.log(responses)
    //This should contain all results.
    //Here we refine to just what the selection is.
    let locations = []
    responses.forEach((item) => {
      console.log(item.category)
      if (item.category.includes(food) || food === "all") {
        const latlng = geohash.decode(item.hash)
        console.log(item)
        const point = new mapboxgl.Marker()
          .setLngLat([latlng.longitude, latlng.latitude])
          //The styling here will be temporary - this should probably be a custom popup
          .setPopup(
            new mapboxgl.Popup().setHTML(
              `<h1><b>${item.name}</b></h1><p>${item.address}</p>`
            )
          )
          .addTo(map.current)
        /*point.getElement().addEventListener('click', () => {
            window.alert('marker clicked')
          })*/
        locations.push(point)
      }
    })
    console.log("locations: ")
    addMarker(marker.concat(locations))
  }

  useEffect(() => {
    const items = (
      <VStack divider={<StackDivider borderColor='gray.200' />} align='stretch'>
        {searchResults.map((item, key) => {
          return (
            <Box
              key={key}
              _hover={{ background: "gray.200" }}
              p='2'
              borderRadius='7.5px'
              as='button'
              onClick={() => {
                closeSearch()
                setLocationModal(true)
                setChosen(item)
              }}
            >
              <Heading as='h4' size='md' align='left'>
                {item.text}
              </Heading>
              <Text color='gray.500' align='left'>
                {item.properties.address}, {item.context[1].text},{" "}
                {item.context[3].text}, {item.context[4].text}
              </Text>
            </Box>
          )
        })}
        <Box
          _hover={{ background: "gray.200" }}
          p='2'
          borderRadius='7.5px'
          as='button'
          onClick={() => {
            closeSearch()
            //TODO: Create a marker that can be clicked on via map
          }}
        >
          <Heading as='h4' size='md' color='red.500' align='center'>
            Can't find location?
          </Heading>
          <Text color='gray.500' align='center'>
            Click here to create a marker at the location
          </Text>
        </Box>
      </VStack>
    )
    setResults(items)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchResults])

  const suggest = async (e) => {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${e.target.value}.json?proximity=${lng}%2C${lat}&types=poi&country=au&limit=5&access_token=${props.API}`
    const response = await (await fetch(url)).json()
    console.log(response)
    setSearchResults(response.features)
  }

  const closeSearch = () => {
    onClose()
    setSearchResults([])
  }

  /*useEffect(() => {
    const handleWindowMouseMove = (event) => {
      setCoords({
        x: event.clientX,
        y: event.clientY,
      })
    }
    window.addEventListener("mousemove", handleWindowMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleWindowMouseMove)
    }
  }, [])*/

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

      <NewLocation
        isOpen={locationModal}
        onClose={() => setLocationModal(false)}
        result={chosen}
        STAGE={props.STAGE}
      />

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
          Search Area For {food.slice(-1) === "s" ? food : `${food}s`}
        </Button>
      </Center>
    </div>
  )
}
