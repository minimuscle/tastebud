import {
  Container,
  Divider,
  Flex,
  HStack,
  Heading,
  Spacer,
  Text,
  Wrap,
  WrapItem,
} from '@chakra-ui/react'
import {
  type LinksFunction,
  type LoaderArgs,
  type LoaderFunction,
  type V2_MetaFunction,
} from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import type { V2_MetaArgs } from '@remix-run/react'
import { BsStarFill } from 'react-icons/bs'
import Rating from 'react-rating'
import SmallHeader from '~/components/layout/smallHeader'
import ReviewCard from '~/components/location/reviewCard'
import styles from '~/styles/global.css'
import type {
  Category,
  Location,
  Review,
} from '~/ts/interfaces/supabase_interfaces'
import {
  supabaseSelectAll,
  supabaseSelectWhere,
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
  //get only the categories that are in the location
  const selectedCategories = categories?.filter((category) => {
    return location.category?.includes(category.value)
  })

  //get all the reviews for the location
  const reviews = await supabaseSelectWhere(
    'reviews',
    'location_id',
    locationId
  )
  console.log(reviews)

  const returnData = {
    location: location,
    categories: selectedCategories,
    reviews: reviews,
  }
  return returnData
}

export const meta: V2_MetaFunction = ({ data }: { data: V2_MetaArgs }) => {
  return [
    { title: `${data.location.name} - Tastebud Reviews` },
    { name: 'description', content: 'Welcome to Tastebud Reviews' },
  ]
}

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: styles }]
}

export default function Location() {
  const { location, categories, reviews } = useLoaderData<{
    location: Location
    categories: Category[]
    reviews: Review[]
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
      <Heading
        as="h2"
        fontSize="2xl"
        mb="20px"
      >
        Reviews
      </Heading>
      <Wrap>
        {reviews.map((review, id) => {
          return (
            <WrapItem key={id}>
              <ReviewCard review={review} />
            </WrapItem>
          )
        })}
      </Wrap>
    </Container>
  )
}
