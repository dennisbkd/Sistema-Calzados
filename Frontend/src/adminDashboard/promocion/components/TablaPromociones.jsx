// components/TablaPromociones.jsx
import { motion } from "motion/react"
import { Tag, Edit3, Trash2, ToggleLeft, ToggleRight, Calendar } from "lucide-react"

const getEstadoBadge = (estado) => {
  const config = {
    ACTIVA: { color: 'green', label: 'Activa' },
    PENDIENTE: { color: 'blue', label: 'Pendiente' },
    EXPIRADA: { color: 'red', label: 'Expirada' },
    INACTIVA: { color: 'gray', label: 'Inactiva' }
  }

  const { color, label } = config[estado] || config.INACTIVA

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${color}-100 text-${color}-800`}>
      {label}
    </span>
  )
}

const getTipoBadge = (tipo) => {
  const config = {
    PORCENTAJE: { color: 'purple', label: '%' },
    MONTO_FIJO: { color: 'indigo', label: 'Monto Fijo' },
    '2X1': { color: 'pink', label: '2x1' },
    '3X2': { color: 'yellow', label: '3x2' }
  }

  const { color, label } = config[tipo] || config.PORCENTAJE

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${color}-100 text-${color}-800`}>
      {label}
    </span>
  )
}

export const TablaPromociones = ({
  promociones,
  onEditar,
  onEliminar,
  onToggleEstado,
  isLoading = false,
  isChangingState = false
}) => {
  if (isLoading) {
    return (
      <div className="animate-pulse">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-gray-200 h-16 rounded-lg mb-2"></div>
        ))}
      </div>
    )
  }

  if (promociones.length === 0) {
    return (
      <div className="text-center py-12">
        <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay promociones</h3>
        <p className="text-gray-500">Crea tu primera promoción para comenzar</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Promoción
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aplicación
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fechas
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {promociones.map((promocion) => (
              <motion.tr
                key={promocion.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {promocion.nombre}
                    </div>
                    <div className="text-sm text-gray-500">
                      {promocion.descripcion || 'Sin descripción'}
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {getTipoBadge(promocion.tipo)}
                    <span className="text-sm text-gray-900">
                      {promocion.tipo === 'PORCENTAJE' && `${promocion.valorDescuento}%`}
                      {promocion.tipo === 'MONTO_FIJO' && `$${promocion.valorDescuento}`}
                      {(promocion.tipo === '2X1' || promocion.tipo === '3X2') && promocion.tipo}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {promocion.aplicaTodo && 'Todos los productos'}
                  {promocion.aplicaCategoria && `Categoría: ${promocion.categoria?.nombre}`}
                  {promocion.aplicaProducto && `Producto: ${promocion.producto?.nombre}`}
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(promocion.fechaInicio).toLocaleDateString()} - {new Date(promocion.fechaFin).toLocaleDateString()}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  {getEstadoBadge(promocion.estado)}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end items-center gap-2">
                    <button
                      onClick={() => onToggleEstado(promocion.id)}
                      disabled={isChangingState}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                      title={promocion.activa ? 'Desactivar' : 'Activar'}
                    >
                      {promocion.activa ? (
                        <ToggleRight className="w-5 h-5 text-green-500" />
                      ) : (
                        <ToggleLeft className="w-5 h-5 text-gray-400" />
                      )}
                    </button>

                    <button
                      onClick={() => onEditar(promocion)}
                      className="text-blue-600 hover:text-blue-900 transition-colors"
                      title="Editar"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onEliminar(promocion.id)}
                      className="text-red-600 hover:text-red-900 transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}