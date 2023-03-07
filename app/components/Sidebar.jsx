import Select from 'react-select'
import { Container, Heading, Flex, Image, Text } from '@chakra-ui/react'

//TODO: This should probably be grabbed via some smart display not hard coded
const options = [
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

export default function Sidebar(props) {
  /*return (
    <div className='sidebar'>
      
    </div>
  )*/
  return (
    <Container bg='white' maxW='500px' minW='500px' className='sidebar'>
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
      <h2>Selected Category: {props.food.toString()}</h2>
    </Container>
  )
}
