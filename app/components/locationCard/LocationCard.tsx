import {
  Badge,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Heading,
  Text,
} from '@chakra-ui/react'
import { BsStarFill } from 'react-icons/bs'
import Rating from 'react-rating'
import type { Category, Location } from '~/ts/interfaces/supabase_interfaces'

export default function LocationCard({
  location,
  categories,
}: {
  location: Location
  categories: Category[]
}) {
  return (
    <Card>
      <CardBody>
        <Text>
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
            <>
              <Badge
                key={key}
                variant="subtle"
                //colorScheme="teal"
                marginRight={'10px'}
              >
                {badge?.label}
              </Badge>
            </>
          )
        })}
        {/* <Text color={'blue.500'}>See More...</Text> */}
      </CardBody>
    </Card>
  )
}
