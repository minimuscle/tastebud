import {
    Box,
    Button,
    Center,
    Flex,
    HStack,
    Heading,
    IconButton,
    Image,
    Img,
    Link,
    Spacer,
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


export default function Categories({ categories }: { categories: Category[] }) {
    const Everything = createIcon({
        viewBox: '0 0 640 512',
        d: "M0 241.1C0 161 65 96 145.1 96c38.5 0 75.4 15.3 102.6 42.5L320 210.7l72.2-72.2C419.5 111.3 456.4 96 494.9 96C575 96 640 161 640 241.1v29.7C640 351 575 416 494.9 416c-38.5 0-75.4-15.3-102.6-42.5L320 301.3l-72.2 72.2C220.5 400.7 183.6 416 145.1 416C65 416 0 351 0 270.9V241.1zM274.7 256l-72.2-72.2c-15.2-15.2-35.9-23.8-57.4-23.8C100.3 160 64 196.3 64 241.1v29.7c0 44.8 36.3 81.1 81.1 81.1c21.5 0 42.2-8.5 57.4-23.8L274.7 256zm90.5 0l72.2 72.2c15.2 15.2 35.9 23.8 57.4 23.8c44.8 0 81.1-36.3 81.1-81.1V241.1c0-44.8-36.3-81.1-81.1-81.1c-21.5 0-42.2 8.5-57.4 23.8L365.3 256z",
    })
    return (
        <Flex
            height="60px"
            p="10px 50px"
            borderTop="solid 1px"
            borderTopColor="gray.200"
            borderBottom="solid 1px"
            borderBottomColor="gray.200"
            align="center"
        >
            <motion.div
                whileTap={{ scale: 0.95 }}
            >
                <Button
                    size="lg"
                    variant="ghost"
                    height="70px"
                    padding="0 10px"
                    color="gray.400"
                    fontWeight="normal"
                    _hover={{ color: 'red.600', backgroundColor: 'transparent' }}
                >
                    <VStack>
                        <Everything boxSize={5} />
                        <Text as='p' fontSize='xs'>Everything</Text>
                    </VStack>
                </Button>
            </motion.div>
            <Spacer />
            {categories.map((category, key) => {
                const Icon = createIcon({
                    viewBox: '0 0 512 512',
                    d: category.svg,
                })
                return (
                    <Fragment key={key}>
                        <motion.div
                            whileTap={{ scale: 0.95 }}
                        >
                            <Button
                                size="lg"
                                variant="ghost"
                                height="70px"
                                padding="0 10px"
                                color="gray.400"
                                fontWeight="normal"
                                _hover={{ color: 'red.600', backgroundColor: 'transparent' }}
                            >
                                <VStack>
                                    <Icon boxSize={5} />
                                    <Text as='p' fontSize='xs'>{category.label}</Text>
                                </VStack>
                            </Button>
                        </motion.div>

                        {key < categories.length - 1 ? <Spacer /> : ''}
                    </Fragment>
                )
            })}
        </Flex>
    )
}
