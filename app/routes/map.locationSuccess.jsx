import { useToast } from '@chakra-ui/react'
import { useEffect } from 'react'

export default function LocationSuccess() {
  const toast = useToast()

  useEffect(() => {
    toast({
      title: 'Location created.',
      description: 'Your Location has been successfully added',
      status: 'success',
      duration: 5000,
      isClosable: true,
    })
  }, [toast])

  return null
}
