import { Box, Heading } from '@chakra-ui/react'
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
    <>
      <Heading>Category: {selectedCategory[0].label}</Heading>
      {/* <LocationCard location={locations[0]} /> */}
    </>
  )
}
