import React from 'react'

export const SeleccionarFiltros = ({
  value,
  onChange,
  options = [],
  placeholder = "Seleccionar...",
  className = ""
}) => {
  return (
    <select
      value={value}
      onChange={onChange}
      className={`px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${className}`}
    >
      <option value="todos">{placeholder}</option>
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}
