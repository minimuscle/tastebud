import {
  Button,
  Center,
  Container,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Input,
  Text,
  VStack,
} from '@chakra-ui/react'
import { redirect } from '@remix-run/node'
import { Form, Link, useFetcher, useOutletContext } from '@remix-run/react'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useEffect } from 'react'
import { FaFacebook, FaTimes } from 'react-icons/fa'
import styles from '~/styles/index.css'

export default function SignUp() {
  const { supabase } = useOutletContext()
  const signup = useFetcher()

  const handleFacebookLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'facebook',
    })
  }

  const handleCallbackResponse = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
    })
  }

  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id:
        '1050556443118-vc6rt32saaaknojr9smeqo9hgp8ed4vo.apps.googleusercontent.com',
      callback: handleCallbackResponse,
    })

    google.accounts.id.renderButton(document.getElementById('signInDiv'), {
      theme: 'outline',
      size: 'large',
      text: 'signup_with',
      width: '300px', //TODO: Make this the correct size
    })
  }, [])

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
            <div id="signInDiv" className="google"></div>
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
            <signup.Form className="google">
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
                Sign Up
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
                  Already have an account?{' '}
                  <Text
                    as="span"
                    textColor="red.400"
                    _hover={{ color: 'red.800', textDecoration: 'underline' }}
                  >
                    <Link to="/login">Login here</Link>
                  </Text>
                </Text>
              </VStack>
              <br />
            </signup.Form>
          </VStack>
        </Container>
      </Center>
    </Flex>

    //TODO: Create proper CSS for these boxes.
  )
}

/*export async function action({ request }) {
  const response = new Response()
  const supabase = createServerClient(
    process.env.DATABASE,
    process.env.SUPABASE_KEY,
    { request, response }
  )
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  })
  console.log('data')
  console.log(data)
  console.log('error')
  console.log(error)
  return redirect(data.url)
}*/

export function links() {
  return [{ rel: 'stylesheet', href: styles }]
}
