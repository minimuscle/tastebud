import { useLoaderData } from '@remix-run/react'
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
import { redirect } from '@remix-run/node'

export default function NewReview() {
  const data = useLoaderData()
  const [category, setCategory] = useState([])
  const [rating, setRating] = useState([])
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  useEffect(() => {
    onOpen()
  }, [])

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add a new review!</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form method="POST">
            <VStack spacing={4} align="flex-start">
              <Input
                type="hidden"
                name="location_id"
                value={data.location_id}
              />
              <Input type="hidden" name="rating" value={rating} />
              <FormControl>
                <FormLabel>Category</FormLabel>
                <FormHelperText>
                  Select the category that you want to review
                </FormHelperText>
                <Select
                  placeholder="Select A Food Category..."
                  className="category-select"
                  name="category"
                  options={data.categories}
                  formatOptionLabel={(category) => (
                    <Flex>
                      <Image src={category.image} alt="category" />
                      <Text fontSize="xl">{category.label}</Text>
                    </Flex>
                  )}
                  onChange={(e) => setCategory(e.value)}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Rating</FormLabel>
                <HStack>
                  <Rating
                    onChange={(e) => setRating(e)}
                    fractions={2}
                    value={rating}
                    emptySymbol={<BsStarFill size="30px" color="#d6d6d6" />}
                    fullSymbol={<BsStarFill size="30px" color="#ffd500" />}
                  />
                  <Text>{rating > 0 ? rating + ' Stars' : null}</Text>
                </HStack>
              </FormControl>
              <FormControl>
                <FormLabel>First Name</FormLabel>
                <FormHelperText>
                  Enter Your First Name (This will be assigned to your account
                  later)
                </FormHelperText>
                <Input id="name" name="name" required />
              </FormControl>
              <FormControl>
                <FormLabel>Title (Optional)</FormLabel>
                <Input id="heading" name="heading" />
              </FormControl>
              <FormControl>
                <FormLabel>Comment (Optional)</FormLabel>
                <Textarea id="comment" name="comment" />
              </FormControl>
              <Button mt={4} colorScheme="teal" type="submit" width="100%">
                Submit Review
              </Button>
            </VStack>
          </form>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export async function action({ request }) {
  const body = await request.formData()
  const name = body.get('name')
  const heading = body.get('heading')
  const rating = body.get('rating')
  const comment = body.get('comment')
  const category = body.get('category')
  const location_id = body.get('location_id')
  const supabase = createClient(process.env.DATABASE, process.env.SUPABASE_KEY)
  const info = {
    user_id: name,
    heading: heading,
    rating: rating,
    comment: comment,
    category: category,
    location_id: location_id,
  }
  const { data } = await supabase.from('reviews').insert(info).select()
  console.log(data)

  //TODO: This should not redirect but use the popup locally using useFetcher
  return redirect(`/map/reviewSuccess`)
}

export async function loader({ params }) {
  const location_id = params.location_id
  const supabase = createClient(process.env.DATABASE, process.env.SUPABASE_KEY)
  const categories = await supabase.from('categories').select()
  const data = {
    location_id: location_id,
    categories: categories.data,
  }
  return data
}
