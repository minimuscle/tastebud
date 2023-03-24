import Select from 'react-select'
import {
  Container,
  Heading,
  Flex,
  Image,
  Text,
  Button,
  Center,
} from '@chakra-ui/react'
import { useState } from 'react'

export default function Sidebar(props) {
  const [category, setCategory] = useState('')
  const getBtnText = () => {
    console.log(props.categories)
    if (!category)
      return (
        <Button
          isDisabled
          colorScheme="blue"
          width="100%"
          className="searchBtn"
        >
          Search area
        </Button>
      )

    return (
      <Button
        colorScheme="blue"
        width="100%"
        className="searchBtn"
        onClick={props.search}
      >
        Search area for{' '}
        {category.slice(-1) === 's' || category === 'all'
          ? category
          : `${category}s`}
      </Button>
    )
  }

  return (
    <Container
      bg="white"
      className="sidebar"
      minH="calc(100vh - 55px)"
      maxW="500px"
    >
      <Heading as="h1">TasteBud</Heading>
      <Center>
        <Text alignSelf="flex-end">v0.2.0</Text>
      </Center>

      <Select
        placeholder="Select A Food Category..."
        className="category-select"
        options={props.categories}
        formatOptionLabel={(category) => (
          <Flex>
            <Image src={category.image} alt="category" />
            <Text fontSize="xl">{category.label}</Text>
          </Flex>
        )}
        onChange={(e) => setCategory(e.value)}
      />
      {getBtnText()}
      <div className="sidebar-bottom">
        <Center>
          <Heading as="h4" size="md">
            Can't find what you're looking for?
          </Heading>
        </Center>
        <br />
        <Button colorScheme="green" width="100%" onClick={props.addLocation}>
          Add Location
        </Button>
      </div>
    </Container>
  )
}
