import { Card, CardHeader } from '@chakra-ui/react'
import type { Location } from '~/ts/interfaces/supabase_interfaces'

export default function LocationCard({ location }: { location: Location }) {
  return (
    <Card>
      <CardHeader>{location.name}</CardHeader>
    </Card>
  )
}
