import { Box, Button, ChakraProvider, Text } from '@chakra-ui/react'
import { BsStarFill } from 'react-icons/bs'
import Rating from 'react-rating'
import AppTheme from '~/styles/AppTheme'

export default function PoiPopup() {
  return (
    <ChakraProvider theme={AppTheme}>
      <Box>
        <Button
          colorScheme="teal"
          variant="link"
          //onClick={() => props.togglePage(location.id)}
        >
          Name{location.name}
        </Button>

        <Text>Address{location.address}</Text>
        <Text>
          0
          <Rating
            initialRating={0}
            readonly
            fractions={2}
            emptySymbol={<BsStarFill size="18px" color="#d6d6d6" />}
            fullSymbol={<BsStarFill size="18px" color="#ffd500" />}
          />
          (0)
        </Text>
      </Box>
    </ChakraProvider>
  )
}
