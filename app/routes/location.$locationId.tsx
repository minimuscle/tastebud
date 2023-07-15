import { Container } from '@chakra-ui/react'
import type {
  LinksFunction,
  LoaderFunction,
  V2_MetaFunction,
} from '@remix-run/node'
//import { useLoaderData } from '@remix-run/react'
import Header from '~/components/layout/header'
import styles from '~/styles/global.css'

export const loader: LoaderFunction = async () => {
  return null
}

export const meta: V2_MetaFunction = () => {
  return [
    { title: 'Location - Tastebud Reviews' },
    { name: 'description', content: 'Welcome to Tastebud Reviews' },
  ]
}

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: styles }]
}

export default function Location() {
  return (
    <Container
      maxW="container.xl"
      //border="1px black solid"
    >
      <Header />
    </Container>
  )
}
