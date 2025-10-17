export const FormSeleccionado = ({
  field,
  label,
  options,
  placeholder = "Seleccionar..."
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${field.state.meta.errors?.length > 0
          ? "border-red-400 focus:ring-red-300"
          : "border-gray-300 focus:ring-blue-400"
          }`}
      >
        <option value="">{placeholder}</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {field.state.meta.errors?.length > 0 && (
        <p className="text-red-500 text-sm mt-1">{field.state.meta.errors[0]}</p>
      )}
    </div>
  )
}