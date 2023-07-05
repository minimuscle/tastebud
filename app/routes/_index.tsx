import { Box, Flex, HStack } from "@chakra-ui/react"
import { useLoadScript } from "@react-google-maps/api"
import type { ActionArgs, LinksFunction, LoaderFunction, V2_MetaFunction } from "@remix-run/node"
import { json } from "@remix-run/node"
import { Outlet, useLoaderData } from "@remix-run/react"
import { createClient } from "@supabase/supabase-js"
import { Suspense, useState } from "react"
import Categories from "~/components/layout/categories"
import Header from "~/components/layout/header"
import Map from "~/components/map/map"
import styles from '~/styles/global.css'
import { Category } from "~/ts/interfaces/supabase_interfaces"
import { motion } from "framer-motion"

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Map - Tastebud Reviews" },
    { name: "description", content: "Welcome to Tastebud Reviews" },
  ]
}

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }]
}

export const loader: LoaderFunction = async () => {
  //setup supabase
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!
  )
  //get categories from supabase
  const { data: categories, error }: { data: Category[] | null, error: any } = await supabase
    .from('categories')
    .select('*')
  if (error) {
    console.log(error)
    return json({ error: 'Error fetching categories' }, { status: 500 })
  }
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
  const { data: place, error }: { data: Location | null, error: any } = await supabase
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

export default function Index() {
  const loaderData = useLoaderData<LoaderData>()
  const [drawerOpen, setDrawer] = useState<boolean>(true)

  interface LoaderData {
    GOOGLE_MAPS_API_KEY: string
    categories: Category[]
  }
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: loaderData.GOOGLE_MAPS_API_KEY,
  })

  return (
    <Flex flexDirection="column" height="100vh">
      <Header />
      <Categories categories={loaderData.categories} />
      <Box flex="1">
        <HStack height="100%" width="100%">
          <motion.div>
            <Box width="1184px" height="100%" display={drawerOpen ? 'true' : 'none'}><Outlet /></Box>
          </motion.div>
          <Suspense fallback={<div>Loading...</div>}>
            {isLoaded && <Map drawer={{ drawerOpen, setDrawer }} />}
          </Suspense>
        </HStack>
      </Box>

    </Flex>
  )
}
