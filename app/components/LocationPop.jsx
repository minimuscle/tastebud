import AppTheme from '~/styles/AppTheme'
import {
  Popover,
  PopoverTrigger,
  Button,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  Box,
  Text,
  Heading,
  ChakraProvider,
} from '@chakra-ui/react'

export default function LocationPop(props) {
  const location = props.location
  return (
    <ChakraProvider theme={AppTheme}>
      <Box>
        <Heading as='h2' size='md'>
          {location.name}
        </Heading>
        <Text>{location.address}</Text>
      </Box>
    </ChakraProvider>
  )
}
