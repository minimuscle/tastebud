import { redirect } from '@remix-run/node'
import { createClient } from '@supabase/supabase-js'

export default function Login() {
  return (
    <div>
      Login Form
      <form method="POST">
        <button type="submit">Get Session</button>
      </form>
    </div>
  )
}

export async function action({ request }) {
  const supabase = createClient(process.env.DATABASE, process.env.SUPABASE_KEY)
  const { data, error } = await supabase.auth.getSession()
  console.log(error)
  console.log(data)
  return redirect('/')
}
