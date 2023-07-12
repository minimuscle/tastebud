import {
  Badge,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Heading,
  Text,
} from '@chakra-ui/react'
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
        <Text>* * * * 3 / 5 (Reviews)</Text>
        <br />
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
        <Divider pt="2" />
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
