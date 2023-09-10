import {
  Button,
  Container,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react'
import {
  type ActionArgs,
  type ActionFunction,
  redirect,
  type LinksFunction,
  type LoaderArgs,
  type LoaderFunction,
  type V2_MetaFunction,
} from '@remix-run/node'
import { Form, useLoaderData, type V2_MetaArgs } from '@remix-run/react'
import Header from '~/components/layout/header'
import styles from '~/styles/global.css'
import { useState } from 'react'
import type { Category, Location } from '~/ts/interfaces/supabase_interfaces'
import ReactSelect from 'react-select'
import { supabaseInsert, supabaseSelectAll } from '~/util/database/supabase'

export const loader: LoaderFunction = async ({ params }: LoaderArgs) => {
  const placeId = params.locationId as string
  //search google maps for the placeId
  const googleResponse = await fetch(
    `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${process.env.GOOGLE_MAPS_API_KEY}`
  )
  const res = await googleResponse.json()
  const categories = (await supabaseSelectAll('categories')) as Category[]

  return {
    categories: categories,
    locationData: res.result,
  }
}

export const action: ActionFunction = async ({ request }: ActionArgs) => {
  const formData = await request.formData()
  const values = Object.fromEntries(formData)

  values['category'] = formData.getAll('category')
  console.log(values)

  //add the location to the database
  const response = await supabaseInsert('locations', values)
  console.log(response)
  if (response?.status == 200) {
    console.log('redirecting')
    return redirect(`/location/${values.id}`)
  }
  console.log('error')
  return null
}

export const meta: V2_MetaFunction = ({ data }: { data: V2_MetaArgs }) => {
  return [
    { title: `Add New Location - Tastebud Reviews` },
    { name: 'description', content: 'Welcome to Tastebud Reviews' },
  ]
}

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: styles }]
}

export default function AddNewReview() {
  const { categories, locationData } = useLoaderData()
  const [name, setName] = useState(locationData.name)
  const [address, setAddress] = useState(locationData.formatted_address)

  return (
    <>
      <Heading
        mt={['40px', null, '20px']}
        as="h1"
        fontSize={'3xl'}
      >
        Add New Review
      </Heading>
      <Text
        mt="20px"
        fontSize={'xl'}
      >
        Edit and change the details below in order to create a new location.
      </Text>
      <Text
        color={'gray.400'}
        fontStyle={'italic'}
      >
        Note: All locations must be approved before they will appear on the map,
        you will still be able to review it
      </Text>
      <Divider m="20px 0" />
      <Container>
        <Form method="POST">
          <input
            type="hidden"
            name="id"
            value={locationData.place_id}
          />
          <input
            type="hidden"
            name="lat"
            value={locationData.geometry.location.lat}
          />
          <input
            type="hidden"
            name="lng"
            value={locationData.geometry.location.lng}
          />
          <VStack gap={10}>
            <FormControl>
              <FormLabel>Location Name</FormLabel>
              <Input
                value={name}
                name="name"
                onChange={(e) => setName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Location Address</FormLabel>
              <Input
                value={address}
                name="address"
                onChange={(e) => setAddress(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Location Categories</FormLabel>
              <ReactSelect
                options={categories}
                isMulti
                name="category"
                placeholder="Search for categories..."
              />
              <FormHelperText>
                You can type to search for a specific category, or select from
                the list
                <br />
                Don't worry, we can add or remove these later
              </FormHelperText>
            </FormControl>
            <Stack width={'100%'}>
              <Button
                colorScheme="green"
                type="submit"
              >
                Submit Location
              </Button>
              <Button onClick={() => window.history.back()}>Cancel</Button>
            </Stack>
          </VStack>
        </Form>
      </Container>
    </>
  )
}
