import { Link, useLoaderData } from '@remix-run/react'
import styles from '~/styles/index.css'

export default function Index() {
  return (
    <div>
      <h1>Hello World</h1>
      <Link to={'./map'}>Map</Link>
    </div>
  )
}

export function links() {
  return [{ rel: 'stylesheet', href: styles }]
}
