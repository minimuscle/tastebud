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
import { useEffect } from 'react'

export default function AddLocationModal(props) {
  const { isOpen, onClose } = props
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add new location</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input
            autoFocus
            placeholder="Search for location..."
            //onChange={suggest}
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
