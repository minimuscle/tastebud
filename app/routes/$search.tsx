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
import { Category } from '~/ts/interfaces/supabase_interfaces'
import { motion } from 'framer-motion'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

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
  console.log(params.search)
  console.log(request.url)
  //setup supabase
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!
  )
  //get categories from supabase
  const { data: categories, error }: { data: Category[] | null; error: any } =
    search === 'all'
      ? await supabase.from('categories').select('*')
      : await supabase.from('categories').select('*').eq('value', search)
  if (error) {
    console.log(error)
    return json({ error: 'Error fetching categories' }, { status: 500 })
  }
  console.log(categories)
  return {
    GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY!,
    categories: categories,
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
    error: any
    GOOGLE_MAPS_API_KEY: string
    categories: Category[]
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
      {/* <Categories categories={loaderData.categories} /> */}
      {isSmallerThan768 ? (
        <Box
          flex="1"
          position="relative"
          paddingTop="20px"
        >
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
          <HStack
            height="100%"
            width="100%"
            position="relative"
          >
            <motion.div>
              <Box
                width={['800px']}
                height="100%"
                display={drawerOpen ? 'true' : 'none'}
              >
                <Outlet />
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
          </HStack>
        </Box>
      )}
    </Flex>
  )
}
