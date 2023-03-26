import { Outlet, useLoaderData, useNavigate } from '@remix-run/react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  ModalHeader,
  VStack,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Button,
  FormHelperText,
  Flex,
  Image,
  Text,
  ModalFooter,
  Textarea,
  useToast,
  useDisclosure,
  HStack,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import Select from 'react-select'
import Rating from 'react-rating'
import { BsStarFill } from 'react-icons/bs'
import { createClient } from '@supabase/supabase-js'

export default function NewReview() {
  const data = useLoaderData()
  const navigate = useNavigate()
  const [category, setCategory] = useState([])
  const [rating, setRating] = useState([])
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  useEffect(() => {
    onOpen()
  }, [])

  return (
    <>
      <Modal isOpen={isOpen} onClose={() => navigate('/map')} size="full">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{data.location.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              {data.average ? data.average.toFixed(1) : null}
              <Rating
                initialRating={data.average ? data.average.toFixed(1) : 0}
                readonly
                fractions={2}
                emptySymbol={<BsStarFill size="18px" color="#d6d6d6" />}
                fullSymbol={<BsStarFill size="18px" color="#ffd500" />}
              />
              ({data.count})
            </Text>
            <Button onClick={() => navigate('./add')}>Add New Review</Button>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
      <Outlet />
    </>
  )
}

export async function loader({ params }) {
  const supabase = createClient(process.env.DATABASE, process.env.SUPABASE_KEY)
  const location = await supabase
    .from('locations')
    .select('*')
    .eq('id', params.location_id)
    .single()
  console.log(location.data.name)
  const categories = await supabase.from('categories').select()
  const { count } = await supabase
    .from('reviews')
    .select('*', { count: 'exact', head: true })
    .eq('location_id', `${params.location_id}`)

  const { data: average } = await supabase.rpc('average_reviews', {
    location_id_param: params.location_id,
  })

  const data = {
    location: location.data,
    categories: categories.data,
    count: count,
    average: average,
  }
  return data
}
