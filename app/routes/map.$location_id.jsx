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
  Heading,
  Container,
  Box,
  StackDivider,
  Center,
  Wrap,
  WrapItem,
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
          <ModalCloseButton />
          <ModalBody>
            <Container maxW="container.xl">
              <br />
              <Heading as="h1">{data.location.name}</Heading>
              <Text>{data.location.address}</Text>

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
              <br />
              <Button w="max-content" onClick={() => navigate('./add')}>
                Add New Review
              </Button>
              <br />
              <br />
              <Wrap spacing={10} overflow="inherit">
                {data.reviews
                  ? data.reviews.map((review, key) => {
                      return (
                        <WrapItem key={key}>
                          <Box
                            p={5}
                            borderWidth="1px"
                            borderRadius="7.5px"
                            shadow="md"
                            minW="300px"
                            maxW="640px"
                            height="250px"
                          >
                            <Heading size="lg" as="h1">
                              {review.heading.charAt(0).toUpperCase() +
                                review.heading.slice(1)}
                            </Heading>
                            <Text>
                              <Rating
                                className="rating-comment"
                                initialRating={review.rating}
                                readonly
                                fractions={2}
                                emptySymbol={
                                  <BsStarFill size="18px" color="#d6d6d6" />
                                }
                                fullSymbol={
                                  <BsStarFill size="18px" color="#ffd500" />
                                }
                              />
                              {'  '}
                              {review.rating} Stars
                            </Text>
                            {/** //TODO: This needs to lookup the user_id for each user and get their first name */}
                            <Text color={'gray.400'}>By {review.user_id}</Text>
                            <br />
                            <Text noOfLines={[1, 2, 3]}>
                              {review.comment.charAt(0).toUpperCase() +
                                review.comment.slice(1)}
                            </Text>
                          </Box>
                        </WrapItem>
                      )
                    })
                  : null}
              </Wrap>
            </Container>
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
  const categories = await supabase.from('categories').select()
  const { count } = await supabase
    .from('reviews')
    .select('*', { count: 'exact', head: true })
    .eq('location_id', `${params.location_id}`)

  const { data: average } = await supabase.rpc('average_reviews', {
    location_id_param: params.location_id,
  })

  const { data: reviews } = await supabase
    .from('reviews')
    .select('*')
    .eq('location_id', `${params.location_id}`)

  const data = {
    location: location.data,
    categories: categories.data,
    count: count,
    average: average,
    reviews: reviews,
  }
  return data
}
