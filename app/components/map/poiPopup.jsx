import { Box, Button, ChakraProvider, Text } from '@chakra-ui/react'
import { BsStarFill } from 'react-icons/bs'
import Rating from 'react-rating'
import AppTheme from '~/styles/AppTheme'

export default function PoiPopup() {
  return (
    <ChakraProvider theme={AppTheme}>
      <Box>
        <Button>Add Location</Button>
      </Box>
    </ChakraProvider>
  )
}
