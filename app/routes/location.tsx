import { Container, Divider } from '@chakra-ui/react'
import { Outlet } from '@remix-run/react'
import Header from '~/components/layout/header'

export default function Location() {
  return (
    <Container
      maxW="container.xl"
      //border="1px black solid"
    >
      <Header small />
      <Divider
        mt={['20px', null, 0]}
        position="absolute"
        left="0"
        w="100vw"
      />
      <Outlet />
    </Container>
  )
}
