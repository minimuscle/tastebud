import styles from '~/styles/index.css'

export default function Login() {
  return (
    <div>
      <h1>Login</h1>
    </div>
  )
}

//add styles via remix links
export function links() {
  return [{ rel: 'stylesheet', href: styles }]
}
