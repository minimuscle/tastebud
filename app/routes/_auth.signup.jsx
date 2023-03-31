import { redirect } from '@remix-run/node'
import { createClient } from '@supabase/supabase-js'

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
  const supabase = createClient(process.env.DATABASE, process.env.SUPABASE_KEY)
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
  })
  console.log(error)
  console.log(data)
  return redirect(data.url)
}
