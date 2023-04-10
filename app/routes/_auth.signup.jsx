import { redirect } from '@remix-run/node'
import { createServerClient } from '@supabase/auth-helpers-remix'

export default function SignUp() {
  return (
    <div>
      <form method="POST">
        <button type="submit">Sign in with Google</button>
      </form>
    </div>
  )
}

export async function action({ request }) {
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
}
