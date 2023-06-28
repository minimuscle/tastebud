import { redirect } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import { createServerClient } from '@supabase/auth-helpers-remix'
import { useContext, useEffect } from 'react'
import { SessionContext } from '~/contexts/SessionContext'
import styles from '~/styles/index.css'

export default function Index() {
  const session = useContext(SessionContext)

  useEffect(() => {
    //On load, check for session, if exists, redirect to /map, or else redirect to /signup for now
  }, [session])

  return (
    <div>
      <h1>Hello World</h1>
      <Link to={'./map'}>Map</Link>
    </div>
  )
}

//remix loader function
export async function loader({ request }) {
  //get session from supabase server and redirect to /map if session exists
  const response = new Response()
  const supabase = createServerClient(
    process.env.DATABASE,
    process.env.SUPABASE_KEY,
    { request, response }
  )
  const {
    data: { session },
  } = await supabase.auth.getSession()
  console.log(session)
  if (session) {
    return redirect('/map')
  } else {
    return redirect('/login')
  }
}

export function links() {
  return [{ rel: 'stylesheet', href: styles }]
}
