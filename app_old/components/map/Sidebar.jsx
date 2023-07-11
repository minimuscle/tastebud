import Select from 'react-select'
import {
  Container,
  Heading,
  Flex,
  Image,
  Text,
  Button,
  Center,
  Collapse,
  useDisclosure,
  IconButton,
  Box,
  HStack,
  useMediaQuery,
} from '@chakra-ui/react'
import { useEffect, useState, Suspense, useRef } from 'react'
import { useFetcher, useNavigate } from '@remix-run/react'
import { TbMenu2 } from 'react-icons/tb'

export default function Sidebar(props) {
  const [category, setCategory] = useState({ value: '', label: '' })
  const navigate = useNavigate()
  const fetcher = useFetcher()
  const [isOpen, setOpen] = useState()
  const sidebarOpen = useRef()
  const [isSmallerThan600] = useMediaQuery('(max-width: 600px)')

  useEffect(() => {
    props.locations.current = fetcher.data
  }, [fetcher, props.locations])

  useEffect(() => {
    if (!isSmallerThan600) {
      setOpen(true)
    }
  }, [])

  const getBtnText = () => {
    if (!category.value) return 'Search Area'
    if (category.label.slice(-1) === 's') {
      return 'Search Area For ' + category.label
    }
    return 'Search Area For ' + category.label + 's'
  }

  return (
    <>
      <IconButton
        className="burger-menu"
        onClick={() => {
          setOpen(!isOpen)
          sidebarOpen.current = isOpen
        }}
        icon={<TbMenu2 />}
        colorScheme="gray"
        size="lg"
      />
      <Suspense>
        <HStack hidden={isOpen} className="absolute-menu">
          <Select
            placeholder="Select..."
            className="category-select absolute"
            options={props.categories}
            formatOptionLabel={(category) => (
              <Flex>
                <Image src={category.image} alt="category" />
                <Text fontSize="xl">{category.label}</Text>
              </Flex>
            )}
            onChange={(e) => setCategory({ value: e.value, label: e.label })}
          />
          <fetcher.Form method="post">
            <input
              type="hidden"
              name="coords"
              value={[props.coords.lng, props.coords.lat]}
            />
            <input type="hidden" name="intent" value={'search'} />
            <Button
              colorScheme="blue"
              width="100%"
              className="searchBtn absolute"
              name="category"
              value={category.value}
              isDisabled={!category.value}
              isLoading={fetcher.submission}
              loadingText="Loading"
              type="submit"
            >
              Search Area
            </Button>
          </fetcher.Form>
        </HStack>
      </Suspense>

      <Collapse in={isOpen} animateOpacity>
        <Container
          bg="white"
          className="sidebar"
          minH="calc(100vh - 55px)"
          maxW="500px"
        >
          <Heading as="h1">TasteBud</Heading>
          <Center>
            <Text className="version" alignSelf="flex-end">
              v0.3.0
            </Text>
          </Center>

          <Select
            placeholder="Select A Food Category..."
            className="category-select"
            options={props.categories}
            formatOptionLabel={(category) => (
              <Flex>
                <Image src={category.image} alt="category" />
                <Text fontSize="xl">{category.label}</Text>
              </Flex>
            )}
            onChange={(e) => setCategory({ value: e.value, label: e.label })}
          />
          <fetcher.Form method="post">
            <input
              type="hidden"
              name="coords"
              value={[props.coords.lng, props.coords.lat]}
            />
            <input type="hidden" name="intent" value={'search'} />
            <Button
              colorScheme="blue"
              width="100%"
              className="searchBtn"
              name="category"
              value={category.value}
              isDisabled={!category.value}
              isLoading={fetcher.submission}
              loadingText="Loading"
              type="submit"
              onClick={() => {
                if (isSmallerThan600) {
                  setOpen(false)
                }
              }}
            >
              {getBtnText()}
            </Button>
          </fetcher.Form>

          <div className="sidebar-bottom">
            <Center>
              <Heading as="h4" size="md">
                Can't find what you're looking for?
              </Heading>
            </Center>
            <br />
            <Button
              colorScheme="green"
              width="100%"
              onClick={() =>
                navigate(`./add/${props.coords.lat},${props.coords.lng}`)
              }
            >
              Add Location
            </Button>
          </div>
        </Container>
      </Collapse>
    </>
  )
}
