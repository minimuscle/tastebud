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

  const toggleModal = () => {
    props.setLocationId(location.id)
    props.setAddress(location.address)
    props.toggleModal()
  }

  return (
    <ChakraProvider theme={AppTheme}>
      <Box>
        <Heading as='h2' size='md'>
          {location.name}
        </Heading>
        <Text>{location.address}</Text>
        <Button onClick={toggleModal}>Add New Review</Button>
      </Box>
    </ChakraProvider>
  )
}
