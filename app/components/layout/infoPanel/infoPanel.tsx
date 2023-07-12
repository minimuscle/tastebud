import { Box, Heading, SimpleGrid } from '@chakra-ui/react'
import LocationCard from '~/components/locationCard/LocationCard'
import type { Category, Location } from '~/ts/interfaces/supabase_interfaces'

export default function InfoPanel({
  selectedCategory,
  locations,
}: {
  selectedCategory: Category[]
  locations: Location[]
}) {
  return (
    <SimpleGrid
      columns={[1, 1, 1, 2, null, 3]}
      spacing={'20px'}
      margin={'20px'}
    >
      {locations.map((location) => (
        <LocationCard
          key={location.id}
          location={location}
        />
      ))}
    </SimpleGrid>
  )
}
