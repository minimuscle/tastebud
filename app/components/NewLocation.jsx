import { useState, useEffect } from 'react'
import Select from 'react-select'
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  VStack,
} from '@chakra-ui/react'
import geohash from 'ngeohash'
import objectHash from 'object-hash'
import * as yup from 'yup'

//TODO: This should probably be grabbed via some smart display not hard coded - from a dynamoDB table for sure
const options = [
  {
    value: 'all',
    label: 'All',
    image: '/icons/infinity.svg',
  },
  {
    value: 'burger',
    label: 'Burger',
    image: '/icons/hamburger.svg',
  },
  {
    value: 'milkshake',
    label: 'Milkshake',
    image: '/icons/milkshake.svg',
  },
  {
    value: 'fries',
    label: 'Fries',
    image: '/icons/fries.svg',
  },
  {
    value: 'hotchocolate',
    label: 'Hot Chocolate',
    image: '/icons/hotchocolate.svg',
  },
]

export default function NewLocation(props) {
  const [disabled, setDisabled] = useState(false)
  const [category, setCategory] = useState([])
  const [address, setAddress] = useState('')
  const [id, setId] = useState()
  const [hash, setHash] = useState()
  const [name, setName] = useState('')
  let errors = {
    name: {
      error: false,
      message: '',
    },
    address: {
      error: false,
      message: '',
    },
    category: {
      error: false,
      message: '',
    },
  }

  useEffect(() => {
    if (props.result) {
      setDisabled(true)
      //Gets the address in a good format rather than using props.result.place_name which includes other data not strictly correct
      setAddress(
        `${props.result.properties.address}, ${
          props.result.context[1].text
        },${' '}${props.result.context[3].text}, ${
          props.result.context[4].text
        }`
      )
      setName(props.result.text)
      setId(objectHash.MD5(props.result.center))
      setHash(geohash.encode(props.result.center[1], props.result.center[0]))
      console.log(
        geohash.encode(props.result.center[1], props.result.center[0])
      )
      console.log(props.result.center[0], props.result.center[1])
    }
  }, [props.result, address, hash])

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log(id, name, address, category, hash)
    const body = {
      id,
      name,
      address,
      category,
      hash,
    }

    //TODO: Put this in a try/catch loop and catch the exceptions to tell the user
    // const url = `https://wwi4q03ohh.execute-api.ap-southeast-2.amazonaws.com/${props.STAGE}/location/add`
    // const data = await fetch(url, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },

    //   body: JSON.stringify(body),
    // })
    const { data } = await props.supabase
      .from('locations')
      .upsert(body)
      .select()
    const response = await data
    console.log(response)
  }

  //TODO: Validate the form via yup
  //TODO: Send these values to the dynamoDB database.

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose} size='xl'>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add a new location!</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit} action='POST'>
            <VStack spacing={4} align='flex-start'>
              <FormControl>
                <FormLabel>Location Name</FormLabel>
                <Input
                  id='name'
                  name='name'
                  variant='filled'
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                />
                <FormErrorMessage>{errors.name.message}</FormErrorMessage>
              </FormControl>
              <FormControl>
                <FormLabel>Address</FormLabel>
                <Input
                  id='address'
                  name='address'
                  variant='filled'
                  isDisabled={disabled}
                  onChange={(e) => setAddress(e.target.value)}
                  value={address}
                />
                <FormErrorMessage>{errors.address.message}</FormErrorMessage>
              </FormControl>
              <FormControl>
                <FormLabel>Food Types Sold</FormLabel>
                <Select
                  instanceId='2'
                  id='category'
                  name='category'
                  placeholder='Select A Food Category...'
                  isMulti
                  options={options}
                  onChange={(e) => {
                    let x = []
                    e.forEach((a) => {
                      x.push(a.value)
                    })
                    setCategory(x)
                  }}
                />
                <FormErrorMessage>{errors.category.message}</FormErrorMessage>
                <FormHelperText>Choose at least 1 category.</FormHelperText>
              </FormControl>
              <Button mt={4} colorScheme='teal' type='submit' width='100%'>
                Submit Location
              </Button>
            </VStack>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

//Form to add
/*
input - Name - done
input - Address - done

the above inputs will be disabled if choosing one from the dropdown, but the name should be editable if you are using the map
s
multiselect for food items

add location button
*/
