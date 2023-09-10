/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  Box,
  Button,
  Center,
  Flex,
  IconButton,
  useMediaQuery,
} from '@chakra-ui/react'
import { useLoadScript } from '@react-google-maps/api'
import type {
  LinksFunction,
  V2_MetaFunction,
  LoaderFunction,
  LoaderArgs,
  ActionArgs,
} from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { useState } from 'react'
import Categories from '~/components/layout/categories'
import Header from '~/components/layout/header'
import Map from '~/components/map/map'
import styles from '~/styles/global.css'
import type { Category, Location } from '~/ts/interfaces/supabase_interfaces'
import { motion } from 'framer-motion'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import InfoPanel from '~/components/layout/infoPanel/infoPanel'
import {
  getAverageRatings,
  getClosestLocations,
  supabaseSelectAll,
  supabaseSelectContains,
  supabaseSelectWhereSingle,
} from '~/util/database/supabase'

export const meta: V2_MetaFunction = () => {
  return [
    { title: 'Map - Tastebud Reviews' },
    { name: 'description', content: 'Welcome to Tastebud Reviews' },
  ]
}

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: styles }]
}

export const ErrorBoundary = ({ error }: { error: any }) => {
  return (
    <Center>
      <Box>
        <h1>Oh no, something went wrong!</h1>
        <pre>{error}</pre>
      </Box>
    </Center>
  )
}

export const loader: LoaderFunction = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url)
  const category = url.searchParams.get('category') || 'all'

  //get categories from supabase
  const categories = (await supabaseSelectAll('categories')) as Category[]

  //get the locations based on the map - if no map, then the zoom should be set to 10
  //TODO: Fix this with locations based on zoom
  const test = await getClosestLocations(-37.8148, 144.9638, 10)

  console.log('results: ', test)
  //get locations based on category chosen (in search params)
  const locations =
    category === 'all'
      ? ((await supabaseSelectAll('locations')) as Location[])
      : ((await supabaseSelectContains(
          'locations',
          'category',
          category
        )) as Location[])

  //get the average rating for the each location then reduce to single array
  const ratings = await getAverageRatings(locations)

  const returnData = {
    GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY!,
    categories: categories,
    locations: locations,
    ratings: ratings,
  }
  return returnData
}

export const action = async ({ request }: ActionArgs) => {
  const body = await request.formData()
  const placeId = body.get('placeId')?.toString()
  if (placeId) {
    const location = await supabaseSelectWhereSingle('locations', 'id', placeId)
    if (!location) {
      //search google maps for the placeId
      const googleResponse = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${process.env.GOOGLE_MAPS_API_KEY}`
      )
      const res = await googleResponse.json()
      console.log(res.result)
      console.log('returning')
      return res.result
    }
    console.log(location)
  }
  return null
}

export default function Index() {
  const loaderData = useLoaderData<LoaderData>()
  const [drawerOpen, setDrawer] = useState<boolean>(true)
  const [isSmallerThan768] = useMediaQuery('(max-width: 768px)')

  interface LoaderData {
    error: unknown
    GOOGLE_MAPS_API_KEY: string
    categories: Category[]
    selected: Category[]
    locations: Location[]
    rating: Array<Number[]> | null
  }

  if (loaderData.error) {
    throw new Error(loaderData.error)
  }
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: loaderData.GOOGLE_MAPS_API_KEY,
  })
  return (
    <Flex
      flexDirection="column"
      height="100dvh"
    >
      <Header />
      <Categories categories={loaderData.categories} />
      {isSmallerThan768 ? (
        <Box flex="1">
          {!drawerOpen && <InfoPanel />}
          {isLoaded && drawerOpen && <Map />}
          <Center>
            <Button
              colorScheme="yellow"
              position="absolute"
              bottom="15px"
              onClick={() => setDrawer(!drawerOpen)}
            >
              {drawerOpen ? 'Hide' : 'Show'} Map
            </Button>
          </Center>
        </Box>
      ) : (
        <Box flex="1">
          <Flex
            height="100%"
            width="100%"
            position="relative"
            gap={0}
          >
            <motion.div>
              <Box
                width="45vw"
                height="100%"
                display={drawerOpen ? 'true' : 'none'}
              >
                <InfoPanel />
              </Box>
            </motion.div>
            {isLoaded && <Map />}
            <IconButton
              zIndex="-5px"
              position="absolute"
              colorScheme="red"
              top="10px"
              left={drawerOpen ? ['45.5vw'] : ['15px']}
              aria-label="Hide Menu"
              icon={drawerOpen ? <FaChevronLeft /> : <FaChevronRight />}
              onClick={() => setDrawer(!drawerOpen)}
            />
          </Flex>
        </Box>
      )}
    </Flex>
  )
}
