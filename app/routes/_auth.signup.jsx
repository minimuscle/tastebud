import { redirect } from '@remix-run/node'
import { useOutletContext } from '@remix-run/react'
import { createServerClient } from '@supabase/auth-helpers-remix'

export default function SignUp() {
  const { supabase } = useOutletContext()

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
    })
  }

  return (
    <div>
      <button onClick={handleGoogleLogin}>Sign in with Google</button>
    </div>
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
