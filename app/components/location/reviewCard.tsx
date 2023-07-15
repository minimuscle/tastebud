import {
  //  Badge,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  HStack,
  Heading,
  Link,
  Text,
} from '@chakra-ui/react'
import { Link as remixLink } from '@remix-run/react'
import { BsStarFill } from 'react-icons/bs'
import Rating from 'react-rating'
import type { Review } from '~/ts/interfaces/supabase_interfaces'

export default function ReviewCard({ review }: { review: Review }) {
  return (
    <Card>
      <CardHeader>
        <Heading
          as="h3"
          fontSize={'xl'}
        >
          {review.heading}
        </Heading>
        <HStack>
          <Heading
            size="xs"
            textTransform="uppercase"
            color={'gray.400'}
          >
            {review.user_id}
          </Heading>
          <Divider
            orientation="vertical"
            h="10px"
            color={'gray.900'}
          />
          <Text>
            {/** Disable Typescript for component below
             * @ts-ignore */}
            <Rating
              initialRating={review.rating}
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
            - {review.rating} {review.rating === 1 ? 'Star' : 'Stars'}
          </Text>
        </HStack>
      </CardHeader>
      <CardBody>
        <Text
          pt="2"
          fontSize="sm"
          color={'gray.400'}
        >
          {review.comment}
        </Text>
        {/* {location.category?.map((category, key) => {
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
        })} */}
        {/* <Text color={'blue.500'}>See More...</Text> */}
      </CardBody>
      <CardFooter justify={'right'}>
        <Link
          as={remixLink}
          //to={`/location/}`}
          target="_blank"
          color={'red.600'}
        >
          Read More
        </Link>
      </CardFooter>
    </Card>
  )
}
