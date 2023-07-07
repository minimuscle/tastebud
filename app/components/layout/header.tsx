import {
  Avatar,
  Center,
  Flex,
  HStack,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  Spacer,
  SystemStyleObject,
  Text,
  VStack,
  useMediaQuery,
} from "@chakra-ui/react"
import { FaSearch } from "react-icons/fa"

export default function Header() {
  const [smallerThan768] = useMediaQuery("(max-width: 768px)")

  if (smallerThan768) {
    return (
      <Center>
        <VStack width='100%'>
          <Heading
            as='h1'
            size={["lg", "xl"]}
            paddingTop='10px'
          >
            <Link
              href='/'
              _hover={{}}
            >
              💋Tastebud Reviews
            </Link>
          </Heading>
          <InputGroup padding='0px 50px 0px 50px'>
            <Input
              size='lg'
              fontSize='md'
              placeholder='Search for food...'
              variant='filled'
              borderRadius='15px'
            />
            <InputRightElement>
              <IconButton
                margin='7.5px 115px 0 0'
                borderRadius={"15px"}
                aria-label='Search'
                icon={<FaSearch />}
                color={"red.600"}
                backgroundColor={"transparent"}
              />
            </InputRightElement>
          </InputGroup>
        </VStack>
      </Center>
    )
  }
  return (
    <Flex
      height='80px'
      p='15px 50px'
    >
      <Center position='relative'>
        <Heading as='h1'>
          <Link
            href='/'
            _hover={{}}
          >
            💋Tastebud Reviews
          </Link>
        </Heading>
        <Text
          position='absolute'
          bottom='7.5px'
          right='0'
          marginRight='-50px'
          color='red.600'
        >
          V0.4.0
        </Text>
      </Center>
      <Spacer />
      <InputGroup
        size='md'
        maxWidth='500px'
      >
        <Input
          size='lg'
          placeholder='Search...'
          variant='filled'
          borderRadius='15px'
        />
        <InputRightElement>
          <IconButton
            margin='7.5px 15px 0 0'
            borderRadius={"15px"}
            aria-label='Search'
            icon={<FaSearch />}
            color={"red.600"}
            backgroundColor={"transparent"}
          />
        </InputRightElement>
      </InputGroup>

      <Spacer />
      <HStack gap='10'>
        <Link
          fontSize='md'
          href='/about'
        >
          About
        </Link>
        <Link
          fontSize='md'
          href='/about'
        >
          Contact
        </Link>
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label='Profile Options'
            icon={<Avatar size='sm' />}
            variant='ghost'
          />
          <MenuList>
            <MenuGroup>
              <MenuItem>Sign Up</MenuItem>
              <MenuItem>Log In</MenuItem>
            </MenuGroup>
            <MenuDivider />
            <MenuGroup>
              <MenuItem>Help</MenuItem>
              <MenuItem>Terms & Conditions</MenuItem>
            </MenuGroup>
          </MenuList>
        </Menu>
      </HStack>
    </Flex>
  )
}
