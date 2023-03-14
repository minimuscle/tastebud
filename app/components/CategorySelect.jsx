import Select from 'react-select'

export default function CategorySelect({
  onChange,
  options,
  value,
  className,
}) {
  return (
    <div className={className}>
      <Select value={value} onChange={onChange} options={options}></Select>
    </div>
  )
}
