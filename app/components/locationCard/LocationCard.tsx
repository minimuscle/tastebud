import {
  Badge,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Heading,
  Link,
  Text,
} from '@chakra-ui/react'
import { useLoaderData, Link as remixLink } from '@remix-run/react'
import { BsStarFill } from 'react-icons/bs'
import Rating from 'react-rating'
import type { Category, Location } from '~/ts/interfaces/supabase_interfaces'

export default function LocationCard({
  location,
  rating,
}: {
  location: Location
  rating: any
}) {
  //console.log(rating[0])
  const { categories } = useLoaderData<{ categories: Category[] }>()
  return (
    <Card>
      <CardBody>
        <Text>
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
          />{' '}
          ({rating[0]}) {rating[1]} Review{rating[1] === 1 ? '' : 's'}
        </Text>
        <Heading
          size="xs"
          textTransform="uppercase"
        >
          {location.name}
        </Heading>
        <Text
          pt="2"
          fontSize="sm"
          color={'gray.400'}
        >
          {location.address}
        </Text>
        <Divider
          pt="2"
          mb="2"
        />
        {location.category?.map((category, key) => {
          const badge = categories.find((cat) => cat.value === category)
          return (
            <Badge
              key={key}
              variant="subtle"
              //colorScheme="teal"
              marginRight={'10px'}
            >
              {badge?.label}
            </Badge>
          )
        })}
        {/* <Text color={'blue.500'}>See More...</Text> */}
      </CardBody>
      <CardFooter justify={'right'}>
        <Link
          as={remixLink}
          to={`/location/${location.id}`}
          target="_blank"
          color={'red.600'}
        >
          Read More
        </Link>
      </CardFooter>
    </Card>
  )
}
