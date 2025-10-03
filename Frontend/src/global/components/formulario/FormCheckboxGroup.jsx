import { Check } from "lucide-react"

export const FormCheckboxGroup = ({
  field,
  label,
  options
}) => {
  const toggleOption = (value) => {
    const currentValues = field.state.value || []
    const newValues = currentValues.includes(value.toLowerCase())
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value]

    field.handleChange(newValues)
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="space-y-2">
        {options.map((option) => {
          const isChecked = (field.state.value || []).includes(option.value.toLowerCase())
          const inputId = `checkbox-${option.value}-${field.name}`
          
          return (
            <label
              key={option.value}
              htmlFor={inputId}
              className="flex items-center gap-3 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => toggleOption(option.value.toLowerCase())}
                className="hidden"
              />
              <div
                className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-all
                   ${isChecked
                    ? 'bg-blue-600 border-blue-600'
                    : 'border-gray-300'
                  }`}
                onClick={() => toggleOption(option.value.toLowerCase())}
              >
                {isChecked && <Check size={14} className="text-white" />}
              </div>
              <span className="text-sm text-gray-700">{option.label}</span>
            </label>
          )
        })}
      </div>
      {field.state.meta.errors && (
        <p className="text-red-500 text-xs mt-1">{field.state.meta.errors}</p>
      )}
    </div>
  )
}