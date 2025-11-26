import { motion } from "motion/react"

const colores = {
  verde: 'from-green-500 to-green-600',
  rojo: 'from-red-500 to-red-600',
  azul: 'from-blue-500 to-blue-600',
  naranja: 'from-orange-500 to-orange-600',
  purpura: 'from-purple-500 to-purple-600'
}

export const TarjetaResumen = ({
  titulo,
  valor,
  icono: Icon,
  variacion,
  color = 'azul',
  formato = 'moneda'
}) => {
  const formatearValor = (valor) => {
    if (formato === 'moneda') {
      return new Intl.NumberFormat('es-PY', {
        style: 'currency',
        currency: 'PYG'
      }).format(valor)
    }
    return valor.toLocaleString()
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border-l-4 border-blue-500"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{titulo}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {formatearValor(valor)}
          </p>
          {variacion && (
            <p className={`text-sm mt-1 ${variacion.includes('+') || variacion === 'positivo'
              ? 'text-green-600'
              : 'text-red-600'
              }`}>
              {variacion}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full bg-gradient-to-br ${colores[color]} text-white`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </motion.div>
  )
}