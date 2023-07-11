import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  HStack,
  Heading,
  IconButton,
  Image,
  Img,
  Link,
  Spacer,
  Tab,
  TabIndicator,
  TabList,
  Tabs,
  Text,
  VStack,
  createIcon,
  extendTheme,
} from '@chakra-ui/react'
import { Fragment, useState } from 'react'
import { motion } from 'framer-motion'
import { FaUser } from 'react-icons/fa'
import { Category } from '~/ts/interfaces/supabase_interfaces'
import infinity from '~/public/icons/infinity-solid.svg'
import { useNavigate } from '@remix-run/react'

export default function Categories({ categories }: { categories: Category[] }) {
  const navigate = useNavigate()
  const Everything = createIcon({
    viewBox: '0 0 640 512',
    d: 'M0 241.1C0 161 65 96 145.1 96c38.5 0 75.4 15.3 102.6 42.5L320 210.7l72.2-72.2C419.5 111.3 456.4 96 494.9 96C575 96 640 161 640 241.1v29.7C640 351 575 416 494.9 416c-38.5 0-75.4-15.3-102.6-42.5L320 301.3l-72.2 72.2C220.5 400.7 183.6 416 145.1 416C65 416 0 351 0 270.9V241.1zM274.7 256l-72.2-72.2c-15.2-15.2-35.9-23.8-57.4-23.8C100.3 160 64 196.3 64 241.1v29.7c0 44.8 36.3 81.1 81.1 81.1c21.5 0 42.2-8.5 57.4-23.8L274.7 256zm90.5 0l72.2 72.2c15.2 15.2 35.9 23.8 57.4 23.8c44.8 0 81.1-36.3 81.1-81.1V241.1c0-44.8-36.3-81.1-81.1-81.1c-21.5 0-42.2 8.5-57.4 23.8L365.3 256z',
  })
  return (
    <Tabs isFitted>
      <Box overflow="auto">
        <TabList
          w="max-content"
          gap={4}
        >
          <Tab
            color="gray.400"
            _selected={{
              color: 'red.600',
              borderColor: 'red.600',
            }}
            _active={{
              backgroundColor: 'transparent',
            }}
            _hover={{
              _selected: { color: 'red.600', borderColor: 'red.600' },
              color: 'gray.700',
              marginBottom: '-2px',
              borderBottom: '2px solid',
              borderColor: 'gray.700',
            }}
            onClick={() => navigate('/all')}
          >
            <VStack>
              <Everything boxSize={5} />
              <Text
                as="p"
                fontSize="xs"
              >
                Everything
              </Text>
            </VStack>
          </Tab>
          {categories.map((category, key) => {
            const Icon = createIcon({
              viewBox: '0 0 512 512',
              d: category.svg,
            })
            return (
              <Tab
                w={['75px', null, '150px']}
                overflowX={['hidden', null, 'auto']}
                color="gray.400"
                _selected={{
                  color: 'red.600',
                  borderColor: 'red.600',
                }}
                _active={{
                  backgroundColor: 'transparent',
                }}
                _hover={{
                  _selected: { color: 'red.600', borderColor: 'red.600' },
                  color: 'gray.700',
                  marginBottom: '-2px',
                  borderBottom: '2px solid',
                  borderColor: 'gray.700',
                }}
                onClick={() => navigate(`/${category.value}`)}
                key={key}
              >
                <VStack>
                  <Icon boxSize={5} />
                  <Text
                    as="p"
                    fontSize="xs"
                  >
                    {category.label}
                  </Text>
                </VStack>
              </Tab>
            )
          })}
        </TabList>
      </Box>
    </Tabs>
  )
}
