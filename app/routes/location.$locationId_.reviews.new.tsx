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
  Textarea,
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
import {
  supabaseInsert,
  supabaseSelectAll,
  supabaseSelectWhereSingle,
} from '~/util/database/supabase'

export const loader: LoaderFunction = async ({ params }: LoaderArgs) => {
  const placeId = params.locationId as string

  //get list of all categories
  const categories = (await supabaseSelectAll('categories')) as Category[]

  //get location based on placeId
  const location = (await supabaseSelectWhereSingle(
    'locations',
    'id',
    placeId
  )) as Location

  return {
    categories: categories,
    location: location,
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
    { title: `Add New Review - Tastebud Reviews` },
    { name: 'description', content: 'Welcome to Tastebud Reviews' },
  ]
}

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: styles }]
}

export default function AddNewReview() {
  const { categories, location } = useLoaderData()
  const [name, setName] = useState('')
  const [comment, setComment] = useState('')

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
        Write a review for {location.name}
      </Text>
      <Divider m="20px 0" />
      <Container>
        <Form method="POST">
          <input
            type="hidden"
            name="id"
            value={location.id}
          />
          <VStack gap={10}>
            <FormControl>
              <FormLabel>Location</FormLabel>
              <Input
                disabled
                value={location.name}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input
                value={name}
                name="name"
                onChange={(e) => setName(e.target.value)}
              />
              <FormHelperText>
                This will be replaced by user names once that section is up and
                running, so please use an easy-to-recognise name for now
              </FormHelperText>
            </FormControl>

            <FormControl>
              <FormLabel>Select Categories for Review</FormLabel>
              <ReactSelect
                options={location.category?.map((category: string) => {
                  const matched = categories.find(
                    (cat: { value: string; label: string }) =>
                      cat.value === category
                  )
                  return {
                    value: matched?.value,
                    label: matched?.label,
                  }
                })}
                isMulti
                name="category"
                placeholder="Search for categories..."
              />
              <FormHelperText>
                Select the items you wish to review
              </FormHelperText>
            </FormControl>
            <FormControl>
              <FormLabel>Review</FormLabel>
              <Input
                value={name}
                name="name"
                //onChange={(e) => setName(e.target.value)}
              />
              <FormHelperText>
                This will be replaced by user names once that section is up and
                running, so please use an easy-to-recognise name for now
              </FormHelperText>
            </FormControl>
            <FormControl>
              <FormLabel>Comment</FormLabel>
              <Textarea
                value={comment}
                name="comment"
                height="200px"
                onChange={(e) => setComment(e.target.value)}
              />
            </FormControl>
            <Stack width={'100%'}>
              <Button
                colorScheme="green"
                type="submit"
              >
                Submit Review
              </Button>
              <Button onClick={() => window.history.back()}>Cancel</Button>
            </Stack>
          </VStack>
        </Form>
      </Container>
    </>
  )
}
