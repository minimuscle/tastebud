import Select from "react-select"

//TODO: This should probably be grabbed via some smart display not hard coded
const options = [
  {
    value: "hamburger",
    label: "Hamburger",
    image: "/icons/hamburger.svg",
  },
  {
    value: "milkshake",
    label: "Milkshake",
    image: "/icons/milkshake.svg",
  },
  {
    value: "fries",
    label: "Fries",
    image: "/icons/fries.svg",
  },
  {
    value: "hotchocolate",
    label: "Hot Chocolate",
    image: "/icons/hotchocolate.svg",
  },
]

export default function Sidebar(props) {
  return (
    <div className='sidebar'>
      <h1>Food Review</h1>
      <Select
        placeholder='Select A Food Category...'
        className='category-select'
        options={options}
        formatOptionLabel={(category) => (
          <div className='country-option'>
            <img src={category.image} alt='category' />
            <span>{category.label}</span>
          </div>
        )}
        //Sets the food to the label only for display
        onChange={(food) => props.setFood(food.label)}
      />
      <h2>Selected Category: {props.food.toString()}</h2>
    </div>
  )
}
