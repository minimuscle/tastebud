import AppTheme from '~/styles/AppTheme'
import { Button, Box, Text, ChakraProvider } from '@chakra-ui/react'
import Rating from 'react-rating'
import { BsStarFill } from 'react-icons/bs'

export default function LocationPop(props) {
  const { location, count, average } = props

  return (
    <ChakraProvider theme={AppTheme}>
      <Box>
        <Button
          colorScheme="teal"
          variant="link"
          onClick={() => props.togglePage(location.id)}
        >
          {location.name}
        </Button>

        <Text>{location.address}</Text>
        <Text>
          {average ? average.toFixed(1) : null}
          <Rating
            initialRating={average ? average.toFixed(1) : 0}
            readonly
            fractions={2}
            emptySymbol={<BsStarFill size="18px" color="#d6d6d6" />}
            fullSymbol={<BsStarFill size="18px" color="#ffd500" />}
          />
          ({count})
        </Text>
      </Box>
    </ChakraProvider>
  )
}
