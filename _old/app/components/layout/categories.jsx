import {
  Box,
  Button,
  Center,
  Flex,
  HStack,
  Heading,
  IconButton,
  Img,
  Link,
  Spacer,
  Text,
  VStack,
  createIcon,
  extendTheme,
} from '@chakra-ui/react'
import { Fragment } from 'react'
import { FaUser } from 'react-icons/fa'

export default function Categories({ categories }) {
  return (
    <Flex
      height="75px"
      p="10px 50px"
      borderTop="solid 1px"
      borderTopColor="gray.200"
      align="center"
    >
      {categories.map((category, key) => {
        const Icon = createIcon({
          viewBox: '0 0 512 512',
          d: category.svg,
        })
        return (
          <Fragment key={key}>
            <Button
              size="lg"
              variant="ghost"
              height="60px"
              color="gray.400"
              fontWeight="normal"
              _hover={{ color: 'red.600' }}
            >
              <VStack>
                <Icon boxSize={6} />
                <Text>{category.label}</Text>
              </VStack>
            </Button>
            {key < categories.length - 1 ? <Spacer /> : ''}
          </Fragment>
        )
      })}
    </Flex>
  )
}
