export const BotonAccion = ({
  onClick,
  icon,
  label,
  variant = "primary",
  disabled = false,
  isLoading = false,
  className = ""
}) => {
  const Icon = icon
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-gray-600 hover:bg-gray-700 text-white",
    danger: "bg-red-600 hover:bg-red-700 text-white",
    success: "bg-green-600 hover:bg-green-700 text-white"
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`flex items-center justify-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-300 hover:shadow-lg text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
    >
      {isLoading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
      ) : (
        <Icon size={18} />
      )}
      <span className="whitespace-nowrap">
        {isLoading ? 'Cargando...' : label}
      </span>
    </button>
  )
}