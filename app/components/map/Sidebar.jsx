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
import { useEffect, useState } from 'react'
import { useFetcher, useNavigate } from '@remix-run/react'

export default function Sidebar(props) {
  const [category, setCategory] = useState({ value: '', label: '' })
  const navigate = useNavigate()
  const fetcher = useFetcher()

  useEffect(() => {
    props.locations.current = fetcher.data
  }, [fetcher, props.locations])

  const getBtnText = () => {
    if (!category.value)
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
      <fetcher.Form method="post">
        <input
          type="hidden"
          name="coords"
          value={[props.coords.lng, props.coords.lat]}
        />
        <Button
          colorScheme="blue"
          width="100%"
          className="searchBtn"
          name="category"
          value={category.value}
          type="submit"
          /*onClick={() => {
            props.search()
          }}*/
        >
          Search Area For{' '}
          {category.label.slice(-1) === 's' || category.label === 'all'
            ? category.label
            : `${category.label}s`}
        </Button>
      </fetcher.Form>
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
        <Text className="version" alignSelf="flex-end">
          v0.2.0
        </Text>
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
        onChange={(e) => setCategory({ value: e.value, label: e.label })}
      />
      {getBtnText()}
      <div className="sidebar-bottom">
        <Center>
          <Heading as="h4" size="md">
            Can't find what you're looking for?
          </Heading>
        </Center>
        <br />
        <Button
          colorScheme="green"
          width="100%"
          onClick={() =>
            navigate(`./add/${props.coords.lat},${props.coords.lng}`)
          }
        >
          Add Location
        </Button>
      </div>
    </Container>
  )
}
