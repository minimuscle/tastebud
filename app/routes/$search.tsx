/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  Box,
  Button,
  Center,
  Flex,
  HStack,
  IconButton,
  useMediaQuery,
} from '@chakra-ui/react'
import { useLoadScript } from '@react-google-maps/api'
import type {
  ActionArgs,
  LinksFunction,
  V2_MetaFunction,
  LoaderFunction,
  LoaderArgs,
} from '@remix-run/node'
import { json } from '@remix-run/node'
import { Outlet, useLoaderData } from '@remix-run/react'
import { createClient } from '@supabase/supabase-js'
import { useState } from 'react'
import Categories from '~/components/layout/categories'
import Header from '~/components/layout/header'
import Map from '~/components/map/map'
import styles from '~/styles/global.css'
import type { Category, Location } from '~/ts/interfaces/supabase_interfaces'
import { motion } from 'framer-motion'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import InfoPanel from '~/components/layout/infoPanel/infoPanel'

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

export const loader: LoaderFunction = async ({
  params,
  request,
}: LoaderArgs) => {
  const { search } = params
  const url = new URL(request.url)
  const category = url.searchParams.get('category')
  console.log(category)
  //setup supabase
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!
  )
  //get categories from supabase
  const { data: categories, error }: { data: Category[] | null; error: any } =
    await supabase.from('categories').select('*')
  if (error) {
    console.log(error)
    return json({ error: 'Error fetching categories' }, { status: 500 })
  }

  //get locations based on category chosen (in search params)
  const {
    data: locations,
    error: locations_error,
  }: { data: Location[] | null; error: unknown } = await supabase
    .from('locations')
    .select()
    .contains('category', [category])

  if (locations_error) {
    console.log(locations_error)
    return json({ error: 'Error fetching locations' }, { status: 500 })
  }
  const {
    data: selected,
    error: selected_error,
  }: { data: Category[] | null; error: unknown } =
    search === 'all'
      ? await supabase.from('categories').select('*')
      : await supabase.from('categories').select('*').eq('value', search)
  if (selected_error) {
    console.log(selected_error)
    return json({ error: 'Error fetching categories' }, { status: 500 })
  }
  console.log('locations: ', locations)
  return {
    GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY!,
    categories: categories,
    selected: selected,
    locations: locations,
  }
}

export const action = async ({ request }: ActionArgs) => {
  const body = await request.formData()
  const placeId = body.get('placeId')
  console.log(placeId)

  //search supabase for the placeId
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!
  )
  const { data: place, error }: { data: Location | null; error: any } =
    await supabase.from('locations').select('*').eq('id', placeId).single()
  if (error) {
    console.log(error)
    return json({ error: 'Error fetching place' }, { status: 500 })
  }

  return place
}

export default function Search() {
  const loaderData = useLoaderData<LoaderData>()
  const [drawerOpen, setDrawer] = useState<boolean>(true)
  const [isSmallerThan768] = useMediaQuery('(max-width: 768px)')

  interface LoaderData {
    error: unknown
    GOOGLE_MAPS_API_KEY: string
    categories: Category[]
    selected: Category[]
    locations: Location[]
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
        <Box
          flex="1"
          position="relative"
        >
          {!drawerOpen && (
            <InfoPanel
              selectedCategory={loaderData.selected}
              locations={loaderData.locations}
            />
          )}
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
                width={['800px']}
                height="100%"
                display={drawerOpen ? 'true' : 'none'}
              >
                <InfoPanel
                  selectedCategory={loaderData.selected}
                  locations={loaderData.locations}
                />
              </Box>
            </motion.div>
            {isLoaded && <Map />}
            <IconButton
              zIndex="-5px"
              position="absolute"
              colorScheme="red"
              top="10px"
              left={drawerOpen ? ['815px'] : ['15px']}
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
