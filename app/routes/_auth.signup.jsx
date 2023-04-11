import { Container } from '@chakra-ui/react'
import { redirect } from '@remix-run/node'
import { useOutletContext } from '@remix-run/react'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'

export default function SignUp() {
  const { supabase } = useOutletContext()

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
    })
  }

  return (
    <Container pt="20%">
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        providers={['facebook', 'google']}
      />
    </Container>

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
