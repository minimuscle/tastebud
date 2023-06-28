import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useFetcher,
  useLoaderData,
} from '@remix-run/react'
import { ChakraProvider } from '@chakra-ui/react'
import AppTheme from '~/styles/AppTheme'
import {
  createBrowserClient,
  createServerClient,
} from '@supabase/auth-helpers-remix'
import { useEffect, useRef, useState } from 'react'
import { json } from '@remix-run/node'
import { SessionContext } from '~/contexts/SessionContext'

export const meta = () => ({
  charset: 'utf-8',
  title: 'TasteBud',
  viewport: 'width=device-width,initial-scale=1',
})

//TODO: convert "props" from 'props.x' to 'x' by changing the function from "function(props) {}" to "function({x, y}) {}"

export const loader = async ({ request }) => {
  const response = new Response()
  const env = {
    DATABASE: process.env.DATABASE,
    SUPABASE_KEY: process.env.SUPABASE_KEY,
  }
  const supabase = createServerClient(env.DATABASE, env.SUPABASE_KEY, {
    request,
    response,
  })
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return json({ session, env }, { headers: response.headers })
}

export const action = () => null

export default function App() {
  const { session, env } = useLoaderData()
  const [supabase] = useState(() =>
    createBrowserClient(env.DATABASE, env.SUPABASE_KEY)
  )
  const fetcher = useFetcher()
  const serverAccessToken = useRef(session?.access_token)

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        if (serverAccessToken.current) {
          serverAccessToken.current = undefined
          fetcher.submit(null, {
            method: 'post',
            action: '/handle-supabase-auth',
          })
        }
      }
      if (session?.access_token !== serverAccessToken.current) {
        // server and client are out of sync.
        // Remix recalls active loaders after actions complete
        serverAccessToken.current = session.access_token
        fetcher.submit(null, {
          method: 'post',
          action: '/handle-supabase-auth',
        })
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [serverAccessToken, supabase, fetcher])

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
        <script
          src="https://accounts.google.com/gsi/client"
          async
          defer
        ></script>
      </head>
      <body>
        <SessionContext.Provider value={session}>
          <ChakraProvider theme={AppTheme}>
            <Outlet context={{ supabase }} />
          </ChakraProvider>
        </SessionContext.Provider>

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
