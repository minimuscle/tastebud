import { useState, useEffect } from 'react'
import Select from 'react-select'
import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from '@chakra-ui/react'
import geohash from 'ngeohash'
import objectHash from 'object-hash'
import { createClient } from '@supabase/supabase-js'
import * as yup from 'yup'
import { useLoaderData } from '@remix-run/react'

export default function NewLocation() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [disabled, setDisabled] = useState(false)
  const [category, setCategory] = useState([])
  const [address, setAddress] = useState('')
  const [id, setId] = useState()
  const [hash, setHash] = useState()
  const [name, setName] = useState('')
  const toast = useToast()
  const loader = useLoaderData()

  useEffect(() => {
    onOpen()
    // if (props.result) {
    //   setDisabled(true)
    //   //Gets the address in a good format rather than using props.result.place_name which includes other data not strictly correct
    //   setAddress(
    //     `${props.result.properties.address}, ${
    //       props.result.context[1].text
    //     },${' '}${props.result.context[3].text}, ${
    //       props.result.context[4].text
    //     }`
    //   )
    //   setName(props.result.text)
    //   setId(objectHash.MD5(props.result.center))
    //   setHash(geohash.encode(props.result.center[1], props.result.center[0]))
    //   console.log(
    //     geohash.encode(props.result.center[1], props.result.center[0])
    //   )
    //   console.log(props.result.center[0], props.result.center[1])
    // }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    // console.log(id, name, address, category, hash)
    // const body = {
    //   id,
    //   name,
    //   address,
    //   category,
    //   hash,
    // }

    // //TODO: Put this in a try/catch loop and catch the exceptions to tell the user
    // // const url = `https://wwi4q03ohh.execute-api.ap-southeast-2.amazonaws.com/${props.STAGE}/location/add`
    // // const data = await fetch(url, {
    // //   method: 'POST',
    // //   headers: {
    // //     'Content-Type': 'application/json',
    // //   },

    // //   body: JSON.stringify(body),
    // // })
    // const { data } = await props.supabase
    //   .from('locations')
    //   .upsert(body)
    //   .select()
    // const response = await data
    // //TODO: Don't allow user ability to anon update location if it already esists.
    // if (data) {
    //   toast({
    //     title: 'Location created.',
    //     description: 'Your Location has been successfully added',
    //     status: 'success',
    //     duration: 5000,
    //     isClosable: true,
    //   })
    //   onClose()
    // }
    // console.log(response)
  }

  //TODO: Validate the form via yup
  //TODO: Send these values to the dynamoDB database.

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add a new location!</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit} action="POST">
              <VStack spacing={4} align="flex-start">
                <FormControl>
                  <FormLabel>Location Name</FormLabel>
                  <Input
                    id="name"
                    name="name"
                    variant="filled"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Address</FormLabel>
                  <Input
                    id="address"
                    name="address"
                    variant="filled"
                    isDisabled={disabled}
                    onChange={(e) => setAddress(e.target.value)}
                    value={address}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Food Types Sold</FormLabel>
                  <Select
                    instanceId="2"
                    id="category"
                    name="category"
                    className="category-select"
                    placeholder="Select A Food Category..."
                    isMulti
                    options={loader.categories}
                    formatOptionLabel={(category) => (
                      <Flex>
                        <Image src={category.image} alt="category" />
                        <Text fontSize="xl">{category.label}</Text>
                      </Flex>
                    )}
                    onChange={(e) => {
                      let x = []
                      e.forEach((a) => {
                        x.push(a.value)
                      })
                      setCategory(x)
                    }}
                  />
                  <FormHelperText>Choose at least 1 category.</FormHelperText>
                </FormControl>
                <Button mt={4} colorScheme="teal" type="submit" width="100%">
                  Submit Location
                </Button>
              </VStack>
            </form>
          </ModalBody>
          <ModalFooter />
        </ModalContent>
      </Modal>
    </>
  )
}

export async function loader({ params }) {
  const [name, address] = params.location.split('&')
  const supabase = createClient(process.env.DATABASE, process.env.SUPABASE_KEY)
  const options = await supabase.from('categories').select()
  const categories = options.data

  return {
    name,
    address,
    categories,
  }
}
