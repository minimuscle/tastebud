import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react'
import { ChakraProvider } from '@chakra-ui/react'
import AppTheme from './styles/AppTheme'

export const meta = () => ({
  charset: 'utf-8',
  title: 'TasteBud',
  viewport: 'width=device-width,initial-scale=1',
})

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
