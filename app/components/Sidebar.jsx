export default function Sidebar(props) {
  return (
    <div id='overlay' className='sidebar'>
      <h1>Food Review</h1>
      {props.latlng.map((coord, key) => {
        return <p key={key}>{coord}</p>
      })}
    </div>
  )
}
