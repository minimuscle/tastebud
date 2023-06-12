import { Box, Flex, HStack } from '@chakra-ui/react'
import { useLoadScript } from '@react-google-maps/api'
import { Outlet, useLoaderData } from '@remix-run/react'
import { Suspense } from 'react'
import Header from '~/components/layout/header'
import Categories from '~/components/layout/categories'
import Map from '~/components/map/map'
import styles from '~/styles/index.css'
import { createClient } from '@supabase/supabase-js'
import { json } from '@remix-run/node'

//This should provide the basic theming of the website, including a header and the map
export default function Index() {
  const loaderData = useLoaderData()

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: loaderData.GOOGLE_MAPS_API_KEY,
  })
  //if (!isLoaded) return <div>Loading...</div>

  return (
    <Flex flexDirection="column" height="100vh">
      <Header />
      <Categories categories={loaderData.categories} />
      <Box flex="1">
        <HStack height="100%" width="100%">
          <Box width="1184px" height="100%"></Box>
          <Suspense fallback={<div>Loading...</div>}>
            {isLoaded && <Map />}
          </Suspense>
        </HStack>
      </Box>
      <Outlet />
    </Flex>
  )
}

export async function loader() {
  //setup supabase
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
  )
  //get categories from supabase
  const { data: categories, error } = await supabase
    .from('categories')
    .select('*')
  if (error) {
    console.log(error)
    return json({ error: 'Error fetching categories' }, { status: 500 })
  }

  return {
    GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
    categories: categories,
  }
}

//add styles via remix links
export function links() {
  return [{ rel: 'stylesheet', href: styles }]
}

export async function action({ request }) {
  const body = await request.formData()
  const placeId = body.get('placeId')
  console.log(placeId)

  //search supabase for the placeId
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
  )
  const { data: place, error } = await supabase
    .from('locations')
    .select('*')
    .eq('id', placeId)
    .single()
  if (error) {
    console.log(error)
    return json({ error: 'Error fetching place' }, { status: 500 })
  }

  return place
}
