import { useToast } from '@chakra-ui/react'
import { useEffect } from 'react'

export default function LocationSuccess() {
  const toast = useToast()

  useEffect(() => {
    toast({
      title: 'Review Created.',
      description: 'Your Review has been successfully added',
      status: 'success',
      duration: 5000,
      isClosable: true,
    })
  }, [toast])

  return null
}
