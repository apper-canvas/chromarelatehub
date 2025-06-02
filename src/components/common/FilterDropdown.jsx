import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

const FilterDropdown = ({ options, value, onChange, placeholder }) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map(option => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default FilterDropdown