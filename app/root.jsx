import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react'
import { ChakraProvider } from '@chakra-ui/react'
import AppTheme from '~/styles/AppTheme'

export const meta = () => ({
  charset: 'utf-8',
  title: 'TasteBud',
  viewport: 'width=device-width,initial-scale=1',
})

//TODO: Refactor code to use server-side code and to follow Remix best practices instead of the basic React ones.

export default function App() {
  return (
    <html lang='en'>
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <ChakraProvider theme={AppTheme}>
          <Outlet />
        </ChakraProvider>

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
