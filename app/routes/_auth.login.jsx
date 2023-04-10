import { redirect } from '@remix-run/node'
import { useFetcher } from '@remix-run/react'
import { createServerClient } from '@supabase/auth-helpers-remix'

export default function Login() {
  const login = useFetcher()
  return (
    <div>
      Login Form
      <login.Form method="POST">
        <button type="submit">Get Session</button>
      </login.Form>
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
  const { data: user, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
  })

  console.log('error' + error)
  console.log('data', user)

  if (user) return redirect('/')
}
