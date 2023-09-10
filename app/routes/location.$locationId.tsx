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
import Header from '~/components/layout/header'
import ReviewCard from '~/components/location/reviewCard'
import styles from '~/styles/global.css'
import type {
  Category,
  Location,
  Review,
} from '~/ts/interfaces/supabase_interfaces'
import {
  getAverageRatings,
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

  const ratings = (await getAverageRatings([location]))[0]

  //get all the reviews for the location
  const reviews = (await supabaseSelectWhere(
    'reviews',
    'location_id',
    locationId
  )) as Review[]
  //console.log(reviews)

  const returnData = {
    location: location,
    categories: selectedCategories,
    reviews: reviews,
    rating: ratings,
  }
  console.log(returnData)
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
  const { location, categories, reviews, rating } = useLoaderData<{
    location: Location
    categories: Category[]
    reviews: Review[]
    rating: [number, number]
  }>()

  return (
    <Container
      maxW="container.xl"
      //border="1px black solid"
    >
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
        {location.name}
      </Heading>
      <HStack mt="10px">
        <Flex mt="1px">
          {/** Disable Typescript for component below
           * @ts-ignore */}
          <Rating
            initialRating={rating[0]}
            readonly
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
          <Text
            as="p"
            fontSize="sm"
            ml="5px"
            mt="1px"
          >
            {rating[0]} ({rating[1]})
          </Text>
        </Flex>
        <Text color="gray.400">{location.address}</Text>
      </HStack>
      <Divider m="20px 0" />
      <Flex>
        {categories.map((category, id) => {
          return (
            <React.Fragment key={id}>
              <Text fontSize="lg">
                {category.label}: {/* @ts-ignore */}
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
            </React.Fragment>
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
