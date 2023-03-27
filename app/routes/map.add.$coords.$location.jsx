import { useState, useEffect, useRef } from 'react'
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
import { useActionData, useLoaderData } from '@remix-run/react'
import { redirect } from '@remix-run/node'

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
  const data = useActionData()
  const isToast = useRef()

  useEffect(() => {
    onOpen()
  }, [])

  useEffect(() => {
    if (loader.address) {
      setDisabled(true)
      setAddress(loader.address)
      setName(loader.name)
      setId(objectHash.MD5(loader.coords.toString()))
      setHash(geohash.encode(loader.coords[1], loader.coords[0]))

      if (isToast.current !== data) {
        isToast.current = data
        toast({
          title: 'Location created.',
          description: 'Your Location has been successfully added',
          status: 'success',
          duration: 5000,
          isClosable: true,
        })
        onClose()
      }
    }
  }, [loader, onClose, isToast, data, toast])

  //TODO: Validate the form via yup

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add a new location!</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form method="POST">
              <VStack spacing={4} align="flex-start">
                <Input id="id" name="id" value={id} display="none" readOnly />
                <Input
                  id="address2"
                  name="address2"
                  value={address}
                  display="none"
                  readOnly
                />
                <Input
                  id="category2"
                  name="category2"
                  value={category}
                  display="none"
                  readOnly
                />
                <Input
                  id="hash"
                  name="hash"
                  value={hash}
                  display="none"
                  readOnly
                />
                <FormControl>
                  <FormLabel>Location Name</FormLabel>
                  <Input
                    autoFocus
                    id="name"
                    name="name"
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
                    defaultValue={address}
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
                      setCategory([x])
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

export async function action({ request }) {
  const body = await request.formData()
  const id = body.get('id')
  const name = body.get('name')
  const address = body.get('address2')
  console.log(address)
  const category = body.get('category2')
  const hash = body.get('hash')
  const supabase = createClient(process.env.DATABASE, process.env.SUPABASE_KEY)
  const info = {
    id,
    name,
    address,
    category,
    hash,
  }
  const { data } = await supabase.from('locations').upsert(info).select()
  console.log(data)

  //TODO: This should not redirect but use the popup locally using useFetcher
  return redirect(`/map/locationSuccess`)
}

export async function loader({ params }) {
  const [name, coords_bulk, address] = params.location.split('&')
  const coords = [...coords_bulk.split(',')]
  const supabase = createClient(process.env.DATABASE, process.env.SUPABASE_KEY)
  const options = await supabase.from('categories').select()
  const categories = options.data

  return {
    name,
    address,
    coords,
    categories,
  }
}
