import {
  Container,
  Divider,
  Flex,
  HStack,
  Heading,
  SimpleGrid,
  Spacer,
  Text,
} from '@chakra-ui/react'
import {
  type LinksFunction,
  type LoaderArgs,
  type LoaderFunction,
  type V2_MetaFunction,
} from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { BsStarFill } from 'react-icons/bs'
import Rating from 'react-rating'
import SmallHeader from '~/components/layout/smallHeader'
import ReviewCard from '~/components/location/reviewCard'
import styles from '~/styles/global.css'
import type { Category, Location } from '~/ts/interfaces/supabase_interfaces'
import {
  supabaseSelectAll,
  supabaseSelectWhereSingle,
} from '~/util/database/supabase'

export const loader: LoaderFunction = async ({ params }: LoaderArgs) => {
  const locationId = params.locationId as string
  const location: Location = await supabaseSelectWhereSingle(
    'locations',
    'id',
    locationId
  )
  const categories = (await supabaseSelectAll('categories')) as Category[]

  //console.log(categories)
  //get only the categories that are in the location
  const selectedCategories = categories?.filter((category) => {
    return location.category?.includes(category.value)
  })

  const returnData = {
    location: location,
    categories: selectedCategories,
  }
  return returnData
}

export const meta: V2_MetaFunction = () => {
  return [
    { title: 'Location - Tastebud Reviews' },
    { name: 'description', content: 'Welcome to Tastebud Reviews' },
  ]
}

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: styles }]
}

export default function Location() {
  const { location, categories } = useLoaderData<{
    location: Location
    categories: Category[]
  }>()

  return (
    <Container
      maxW="container.xl"
      //border="1px black solid"
    >
      <SmallHeader />
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
        {location.name}
      </Heading>
      <HStack mt="10px">
        <Text>
          {/** Disable Typescript for component below
           * @ts-ignore */}
          <Rating
            initialRating={3}
            readonly
            fractions={2}
            emptySymbol={
              <BsStarFill
                size="18px"
                color="#d6d6d6"
              />
            }
            fullSymbol={
              <BsStarFill
                size="18px"
                color="#ffd500"
              />
            }
          />{' '}
          (0) 123 Reviews
        </Text>
        <Text color="gray.400">{location.address}</Text>
      </HStack>
      <Divider m="20px 0" />
      <Flex>
        {categories.map((category, id) => {
          return (
            <>
              <Text
                fontSize="lg"
                key={id}
              >
                {category.label}: {id}
                {/* @ts-ignore */}
                <Rating
                  initialRating={3}
                  readonly
                  fractions={2}
                  emptySymbol={
                    <BsStarFill
                      size="18px"
                      color="#d6d6d6"
                    />
                  }
                  fullSymbol={
                    <BsStarFill
                      size="18px"
                      color="#ffd500"
                    />
                  }
                />
                (0)
              </Text>
              <Spacer />
            </>
          )
        })}
      </Flex>
      <Divider m="20px 0" />
      <ReviewCard />
    </Container>
  )
}
