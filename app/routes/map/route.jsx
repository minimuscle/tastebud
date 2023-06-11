import styles from '~/styles/index.css'

export default function map() {
  return (
    <div>
      <h1>Map Folder</h1>
    </div>
  )
}

//add styles via remix links
export function links() {
  return [{ rel: 'stylesheet', href: styles }]
}
