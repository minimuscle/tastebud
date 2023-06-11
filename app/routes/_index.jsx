import styles from '~/styles/index.css'

export default function index() {
  return (
    <div>
      <h1>index</h1>
    </div>
  )
}

//add styles via remix links
export function links() {
  return [{ rel: 'stylesheet', href: styles }]
}
