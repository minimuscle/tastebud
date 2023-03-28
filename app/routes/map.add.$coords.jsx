import {
  Box,
  Container,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  StackDivider,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react'
import {
  Outlet,
  useActionData,
  useLoaderData,
  useNavigate,
  useSubmit,
} from '@remix-run/react'
import { useEffect } from 'react'

export default function AddLocationModal() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const submit = useSubmit()
  const navigate = useNavigate()
  const data = useActionData()
  const coords = useLoaderData()

  useEffect(() => {
    onOpen()
  }, [onOpen])

  const loadData = () => {
    if (!data) return
    return (
      <VStack divider={<StackDivider borderColor="gray.200" />} align="stretch">
        {data.map((item, key) => {
          try {
            return (
              <Box
                key={key}
                _hover={{ background: 'gray.200' }}
                p="2"
                borderRadius="7.5px"
                as="button"
                onClick={() => {
                  onClose()
                  navigateItem(item)
                  // setLocationModal(true)
                  // setChosen(item)
                }}
              >
                <Heading as="h4" size="md" align="left">
                  {item.text}
                </Heading>
                <Text color="gray.500" align="left">
                  {getType(item)}
                </Text>
              </Box>
            )
          } catch (e) {
            return null
          }
        })}
        <Box
          _hover={{ background: 'gray.200' }}
          p="2"
          borderRadius="7.5px"
          as="button"
          onClick={() => {
            //TODO: Create a marker that can be clicked on via map
          }}
        >
          <Heading as="h4" size="md" color="red.500" align="center">
            Can't find location?
          </Heading>
          <Text color="gray.500" align="center">
            Click here to create a marker at the location
          </Text>
        </Box>
      </VStack>
    )
  }

  const getType = (item) => {
    switch (item.place_type[0]) {
      case 'poi':
        return (
          <>
            {item.properties.address ? item.properties.address + ', ' : null}{' '}
            {item.context[1].text}, {item.context[3].text},{' '}
            {item.context[4].text}
          </>
        )
      case 'address':
        return <>{item.place_name}</>
    }
  }

  const navigateItem = (item) => {
    console.log(item)
    let url
    switch (item.place_type[0]) {
      case 'poi':
        url = `./${item.text}&${item.center}&${
          item.properties.address ? item.properties.address + ', ' : ''
        }${item.context[1].text}, ${item.context[3].text}, ${
          item.context[4].text
        }`
        break
      case 'address':
        url = `./${item.text}&${item.center}&${item.place_name}`
        break
    }
    console.log(url)
    navigate(url)
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={() => navigate('/map')}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add new location</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form
              method="post"
              onChange={(event) =>
                submit(event.currentTarget, { replace: true })
              }
            >
              <Input
                autoFocus
                autoComplete="off"
                name="location-search"
                placeholder="Search for location..."
              />
              <Input name="coords" display="none" value={coords} readOnly />
            </form>

            <Container
              borderWidth="1px"
              borderRadius="lg"
              boxShadow="2xl"
              bg="white"
              className="search-results"
              hidden={data ? (data.length > 0 ? false : true) : true}
            >
              {loadData()}
            </Container>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
      <Outlet />
    </>
  )
}

export async function action({ request }) {
  const body = await request.formData()
  const [lng, lat] = body.get('coords').split(',')
  const search = body.get('location-search')
  const response = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${search}.json?proximity=${lng}%2C${lat}&country=au&types=poi%2Caddress&limit=5&access_token=${process.env.MAPS_ACCESS_TOKEN}`
  )
  return response.json().then((data) => data.features)
}

export async function loader({ params }) {
  return params.coords
}
