import { AlertCircle } from "lucide-react"

export const ErrorMessage = ({
  titulo = "Error",
  mensaje = "Ha ocurrido un error",
  onRetry,
  className = ""
}) => {
  return (
    <div className={`bg-red-50 border border-red-200 rounded-lg p-6 text-center ${className}`}>
      <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
      <h3 className="text-lg font-semibold text-red-800 mb-2">{titulo}</h3>
      <p className="text-red-600 mb-4">{mensaje}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Reintentar
        </button>
      )}
    </div>
  )
}