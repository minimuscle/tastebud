import Select from "react-select"
import {
  Container,
  Heading,
  Flex,
  Image,
  Text,
  Button,
  Spacer,
} from "@chakra-ui/react"

//TODO: This should probably be grabbed via some smart display not hard coded
const options = [
  {
    value: "all",
    label: "All",
    image: "/icons/infinity.svg",
  },
  {
    value: "burger",
    label: "Burger",
    image: "/icons/hamburger.svg",
  },
  {
    value: "milkshake",
    label: "Milkshake",
    image: "/icons/milkshake.svg",
  },
  {
    value: "fries",
    label: "Fries",
    image: "/icons/fries.svg",
  },
  {
    value: "hotchocolate",
    label: "Hot Chocolate",
    image: "/icons/hotchocolate.svg",
  },
]

export default function Sidebar(props) {
  const getBtnText = () => {
    if (!props.food)
      return (
        <Button
          isDisabled
          colorScheme='blue'
          width='100%'
          className='searchBtn'
        >
          Search Area
        </Button>
      )

    return (
      <Button
        colorScheme='blue'
        width='100%'
        className='searchBtn'
        onClick={props.search}
      >
        Search Area For{" "}
        {props.food.slice(-1) === "s" || props.food === "All"
          ? props.food
          : `${props.food}s`}
      </Button>
    )
  }

  return (
    <Container
      bg='white'
      maxW='500px'
      minW='500px'
      id='overlay'
      className='sidebar'
    >
      <Heading as='h1'>Food Review</Heading>
      <Select
        placeholder='Select A Food Category...'
        className='category-select'
        options={options}
        formatOptionLabel={(category) => (
          <Flex>
            <Image src={category.image} alt='category' />
            <Text fontSize='xl'>{category.label}</Text>
          </Flex>
        )}
        //Sets the food to the label only for display
        onChange={(food) => props.setFood(food.label)}
      />
      {getBtnText()}
      <Heading as='h4' size='md'>
        Can't find what you're looking for? {props.food}
      </Heading>
      <Button colorScheme='green' width='100%'>
        Add Location
      </Button>
    </Container>
  )
}
