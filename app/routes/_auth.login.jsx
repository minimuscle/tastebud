import {
  Button,
  Center,
  Container,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  VStack,
} from '@chakra-ui/react'
import { Link, useFetcher, useOutletContext } from '@remix-run/react'
import { FaFacebook } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
import styles from '~/styles/index.css'

export default function Login() {
  const { supabase } = useOutletContext()
  const login = useFetcher()

  const handleFacebookLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'facebook',
    })
  }

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
    })
  }

  return (
    <Flex minH="100vh" alignContent="center" justifyContent="center">
      <Center>
        <Container
          border="1px solid"
          borderColor="gray.300"
          shadow="md"
          borderRadius="7.5px"
          padding="25px"
          minW="450px"
        >
          <VStack spacing="15px">
            <Heading as="h2" size="lg" alignItems="left">
              Tastebud
            </Heading>
            <Text color="gray.400">Sign up with one of our below options</Text>
            <br />
            <Button
              minWidth="300px"
              variant={'outline'}
              textColor="gray.500"
              leftIcon={<FcGoogle />}
              onClick={() => handleGoogleLogin()}
            >
              Continue with Google
            </Button>
            <Button
              colorScheme="facebook"
              minWidth="300px"
              leftIcon={<FaFacebook />}
              onClick={() => handleFacebookLogin()}
            >
              Continue with Facebook
            </Button>
            <br />
            <Divider maxW="350px" />
            <br />
            <login.Form className="google">
              <FormControl>
                <FormLabel>Email address</FormLabel>
                <Input type="email" name="email" id="email" />
              </FormControl>
              <br />
              <FormControl>
                <FormLabel>Password</FormLabel>
                <Input type="password" name="password" id="password" />
              </FormControl>
              <br />
              <Button width="100%" colorScheme="red" type="submit">
                Login
              </Button>
              <br />
              <br />
              <VStack>
                <Text
                  as="span"
                  textColor="red.400"
                  _hover={{ color: 'red.800', textDecoration: 'underline' }}
                >
                  <Link to="/login"> Forgot your password?</Link>
                </Text>
                <Text as="h4" size="xs">
                  Don't have an account?{' '}
                  <Text
                    as="span"
                    textColor="red.400"
                    _hover={{ color: 'red.800', textDecoration: 'underline' }}
                  >
                    <Link to="/signup">Sign up here</Link>
                  </Text>
                </Text>
              </VStack>
              <br />
            </login.Form>
          </VStack>
        </Container>
      </Center>
    </Flex>
  )
}

export function links() {
  return [{ rel: 'stylesheet', href: styles }]
}
