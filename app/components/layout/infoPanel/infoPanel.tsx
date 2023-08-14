import { SimpleGrid } from '@chakra-ui/react'
import { useLoaderData } from '@remix-run/react'
import LocationCard from '~/components/locationCard/LocationCard'
import type { Location } from '~/ts/interfaces/supabase_interfaces'

export default function InfoPanel() {
  const {
    locations,
    ratings,
  }: { locations: Location[]; ratings: Array<Number[]> } = useLoaderData()
  return (
    <SimpleGrid
      columns={[1, 1, 1, 2, null, 3]}
      spacing={'20px'}
      padding={'20px'}
      overflowY="scroll"
      height={'80dvh'}
    >
      {locations.map((location, id) => (
        <LocationCard
          key={id}
          location={location}
          rating={ratings[id]}
        />
      ))}
    </SimpleGrid>
  )
}
