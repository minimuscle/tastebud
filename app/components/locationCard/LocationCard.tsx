import { Card, CardBody, CardHeader, Heading, Text } from '@chakra-ui/react'
import type { Location } from '~/ts/interfaces/supabase_interfaces'

export default function LocationCard({ location }: { location: Location }) {
  return (
    <Card>
      <CardHeader>{/* This is going to be the tags */}</CardHeader>
      <CardBody>
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
      </CardBody>
    </Card>
  )
}
