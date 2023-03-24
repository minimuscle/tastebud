import {
  Container,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react'
import { useNavigate, useSubmit } from '@remix-run/react'
import { useEffect } from 'react'

export default function AddLocationModal() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const submit = useSubmit()
  const navigate = useNavigate()

  const handleChange = (e) => {
    //This submits data as if it was being submitted via a form POST method, in the same way.
    submit(e.target.value, { replace: true })
  }

  useEffect(() => {
    onOpen()
  }, [onOpen])

  return (
    <Modal isOpen={isOpen} onClose={() => navigate('/map')}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add new location</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input
            autoFocus
            placeholder="Search for location..."
            onChange={handleChange}
          />
          <Container
            borderWidth="1px"
            borderRadius="lg"
            boxShadow="2xl"
            bg="white"
            className="search-results"
            //hidden={searchResults.length > 0 ? false : true}
          ></Container>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  )
}
