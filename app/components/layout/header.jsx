import {
  Avatar,
  Center,
  Flex,
  HStack,
  Heading,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  Spacer,
  Text,
} from '@chakra-ui/react'

export default function Header() {
  return (
    <Flex height="80px" p="15px 50px">
      <Center position="relative">
        <Heading as="h1">
          <Link href="/" _hover="none">
            Tastebud Reviews
          </Link>
        </Heading>
        <Text
          position="absolute"
          bottom="7.5px"
          right="0"
          marginRight="-50px"
          color="red"
        >
          V0.4.0
        </Text>
      </Center>

      <Spacer />
      <HStack gap="10">
        <Link fontSize="xl" href="/about">
          About
        </Link>
        <Link fontSize="xl" href="/about">
          Contact
        </Link>
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="Profile Options"
            icon={<Avatar size="sm" />}
            variant="ghost"
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
