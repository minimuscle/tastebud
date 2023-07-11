import { Box, Heading } from '@chakra-ui/react'
import type { Category } from '~/ts/interfaces/supabase_interfaces'

export default function InfoPanel({
  selectedCategory,
}: {
  selectedCategory: Category[]
}) {
  return (
    <Box>
      <Heading>
        {selectedCategory.map((category) => {
          return category.label
        })}
      </Heading>
    </Box>
  )
}
