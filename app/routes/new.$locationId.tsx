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
  type LinksFunction,
  type LoaderArgs,
  type LoaderFunction,
  type V2_MetaFunction,
} from '@remix-run/node'
import { useLoaderData, type V2_MetaArgs } from '@remix-run/react'
import Header from '~/components/layout/header'
import styles from '~/styles/global.css'
import { useState } from 'react'
import type { Location } from '~/ts/interfaces/supabase_interfaces'

export const loader: LoaderFunction = async ({ params }: LoaderArgs) => {
  const placeId = params.locationId as string
  //search google maps for the placeId
  const googleResponse = await fetch(
    `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${process.env.GOOGLE_MAPS_API_KEY}`
  )
  const res = await googleResponse.json()
  console.log(res.result)
  console.log('returning')
  return res.result
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

export default function Location() {
  const loaderData = useLoaderData()
  const [name, setName] = useState(loaderData.name)
  const [address, setAddress] = useState(loaderData.formatted_address)

  return (
    <Container maxW="container.xl">
      <Header small />
      <Divider
        mt={['20px', null, 0]}
        position="absolute"
        left="0"
        w="100vw"
      />
      <Heading
        mt={['40px', null, '20px']}
        as="h1"
        fontSize={'3xl'}
      >
        Add New Location
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
        <form method="POST">
          <VStack gap={10}>
            <FormControl>
              <FormLabel>Location Name</FormLabel>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Location Address</FormLabel>
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Location Categories</FormLabel>
              <Input />
              <FormHelperText>
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
        </form>
      </Container>
    </Container>
  )
}
