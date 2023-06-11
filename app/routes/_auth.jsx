import { Outlet } from '@remix-run/react'
import styles from '~/styles/index.css'

export default function Auth() {
  return (
    <>
      <Outlet />
    </>
  )
}

//add styles via remix links
export function links() {
  return [{ rel: 'stylesheet', href: styles }]
}
