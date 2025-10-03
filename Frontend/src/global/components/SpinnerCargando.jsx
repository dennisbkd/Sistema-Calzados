export const SpinnerCargando = ({
  tamaño = "md",
  texto = "Cargando...",
  className = ""
}) => {
  const sizes = {
    sm: "h-6 w-6",
    md: "h-12 w-12",
    lg: "h-16 w-16"
  }

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={`animate-spin rounded-full border-b-2 border-blue-600 ${sizes[tamaño]}`}></div>
      {texto && <p className="mt-4 text-gray-600">{texto}</p>}
    </div>
  )
}