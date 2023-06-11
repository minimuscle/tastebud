import styles from '~/styles/index.css'

export default function Signup() {
  return (
    <div>
      <h1>Signup</h1>
    </div>
  )
}

//add styles via remix links
export function links() {
  return [{ rel: 'stylesheet', href: styles }]
}
