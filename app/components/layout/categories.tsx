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
import { Fragment, useState } from 'react'
import { motion } from 'framer-motion'
import { FaUser } from 'react-icons/fa'
import { Category } from '~/ts/interfaces/supabase_interfaces'


export default function Categories({ categories }: { categories: Category[] }) {
    return (
        <Flex
            height="75px"
            p="10px 50px"
            borderTop="solid 1px"
            borderTopColor="gray.200"
            borderBottom="solid 1px"
            borderBottomColor="gray.200"
            align="center"
        >
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
                                    <Icon boxSize={6} />
                                    <Text>{category.label}</Text>
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
