export const FormInput = ({
  field,
  label,
  type = "text",
  placeholder = "",
  icon: Icon
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
        )}
        <input
          type={type}
          name={field.name}
          value={field.state.value || ''}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          className={`w-full ${Icon ? 'pl-10' : 'pl-3'} pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${field.state.meta.errors?.length > 0
              ? "border-red-400 focus:ring-red-300"
              : "border-gray-300 focus:ring-blue-400"
            }`}

          placeholder={placeholder}
        />
      </div>
      {/* ✅ ESTE ES EL QUE MUESTRA LOS ERRORES */}
      {field.state.meta.errors?.length > 0 && (
        <p className="text-red-500 text-sm mt-1">{field.state.meta.errors[0]}</p>
      )}

    </div>
  )
}