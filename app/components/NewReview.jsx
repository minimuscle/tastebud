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
  toast,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import Select from 'react-select'
import Rating from 'react-rating'
import { BsStarFill } from 'react-icons/bs'

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

export default function NewReview(props) {
  const { isOpen, onClose, address, supabase, location_id } = props
  const [name, setName] = useState('')
  const [heading, setHeading] = useState('')
  const [comment, setComment] = useState('')
  const [rating, setRating] = useState(0)
  const [category, setCategory] = useState()

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('submitting review')
    const body = {
      user_id: name,
      heading: heading,
      rating: rating,
      comment: comment,
      category: category,
      location_id: location_id,
    }
    console.log(body)

    const { data, error } = await props.supabase
      .from('reviews')
      .insert(body)
      .select()
    if (error) console.log(error)
    if (data) {
      toast({
        title: 'Account created.',
        description: "We've created your account for you.",
        status: 'success',
        duration: 9000,
        isClosable: true,
      })
    }
    const response = await data
    console.log(response)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add a new review!</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit} action="POST">
            <VStack spacing={4} align="flex-start">
              <FormControl>
                <FormLabel>Address</FormLabel>
                <Input
                  id="address"
                  name="address"
                  variant="filled"
                  isDisabled
                  value={address}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Category</FormLabel>
                <FormHelperText>
                  Select the category that you want to review
                </FormHelperText>
                <Select
                  instanceId="1"
                  placeholder="Select A Food Category..."
                  className="select"
                  options={options}
                  formatOptionLabel={(category) => (
                    <Flex>
                      <Image src={category.image} alt="category" />
                      <Text fontSize="xl">{category.label}</Text>
                    </Flex>
                  )}
                  onChange={(food) => setCategory(food.value)}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Rating</FormLabel>
                <Rating
                  initialRating={rating}
                  onChange={(e) => setRating(e)}
                  fractions={2}
                  emptySymbol={<BsStarFill size="30px" color="#d6d6d6" />}
                  fullSymbol={<BsStarFill size="30px" color="#ffd500" />}
                />
                <Text>{rating}/5 Stars</Text>
              </FormControl>
              <FormControl>
                <FormLabel>First Name</FormLabel>
                <FormHelperText>
                  Enter Your First Name (This will be assigned to your account
                  later)
                </FormHelperText>
                <Input
                  id="name"
                  name="name"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Title (Optional)</FormLabel>
                <Input
                  id="heading"
                  name="heading"
                  onChange={(e) => setHeading(e.target.value)}
                  value={heading}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Comment (Optional)</FormLabel>
                <Textarea
                  id="comment"
                  name="comment"
                  onChange={(e) => setComment(e.target.value)}
                  value={comment}
                />
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
