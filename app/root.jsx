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

export const meta = () => [
  { title: 'TasteBud | Your Favourite Food' },
  {
    name: 'description',
    content:
      'Search your favourite food by resturarant or cuisine, find those hidden gems in your city hiding behind those pesky reviews',
  },
  {
    name: 'keywords',
    content: 'food, restaurant, cuisine, taste, bud, reviews, search',
  },
  { httpEquiv: 'Content-Type', content: 'text/html; charset=utf-8' },
  { name: 'viewport', content: 'width=device-width,initial-scale=1' },
]

export default function App() {
  return (
    <html lang="en">
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
