import { ChakraProvider } from '@chakra-ui/react'
import { cssBundleHref } from '@remix-run/css-bundle'
import type { LinksFunction } from '@remix-run/node'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react'
import AppTheme from './styles/AppTheme'

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: 'stylesheet', href: cssBundleHref }] : []),
]

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1"
        />
        <script
          async
          src={`https://maps.googleapis.com/maps/api/js?key=AIzaSyBJBt4l8DOJmt6ACvXMR1el8oesCVDSImI&libraries=places`}
        ></script>
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
