import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react'
import { ChakraProvider } from '@chakra-ui/react'
import AppTheme from '~/styles/AppTheme'
import {
  createBrowserClient,
  createServerClient,
} from '@supabase/auth-helpers-remix'
import { useState } from 'react'
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
  const supabase = createServerClient(
    process.env.DATABASE,
    process.env.SUPABASE_KEY,
    { request, response }
  )
  const { data: session } = await supabase.auth.getSession()
  console.log(session)
  return json({ session }, { headers: response.headers })
}

export default function App() {
  const { session } = useLoaderData()
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <SessionContext.Provider value={session}>
          <ChakraProvider theme={AppTheme}>
            <Outlet />
          </ChakraProvider>
        </SessionContext.Provider>

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
