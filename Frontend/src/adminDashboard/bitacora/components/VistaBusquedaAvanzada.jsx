import { useState } from 'react'
import { motion } from 'motion/react'
import { Search, FileText, User, Calendar } from 'lucide-react'
import { useBitacora } from '../hooks/useBitacora'

const VistaBusquedaAvanzada = ({ filtrosGlobales }) => {
  const [terminoBusqueda, setTerminoBusqueda] = useState('')

  const { data: datosBusqueda, isLoading, error, refetch } =
    useBitacora.useBusquedaBitacora(terminoBusqueda, filtrosGlobales)

  const realizarBusqueda = (termino) => {
    setTerminoBusqueda(termino)
  }

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getColorAccion = (accion) => {
    const colores = {
      CREATE: 'bg-green-100 text-green-800',
      UPDATE: 'bg-blue-100 text-blue-800',
      DELETE: 'bg-red-100 text-red-800'
    }
    return colores[accion] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900">Búsqueda Avanzada</h2>
        <p className="text-gray-600">Busca en todos los registros de la bitácora</p>
      </div>

      {/* Barra de Búsqueda */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar en toda la bitácora (tablas, acciones, datos específicos)..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            onChange={(e) => realizarBusqueda(e.target.value)}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Busca por nombre de tabla, tipo de acción, valores específicos o IDs de registro
        </p>
      </div>

      {/* Resultados de Búsqueda */}
      <div>
        {isLoading && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Buscando...</p>
          </div>
        )}

        {error && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="text-red-500 text-lg mb-4">Error en la búsqueda</div>
            <button
              onClick={() => refetch()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Reintentar
            </button>
          </div>
        )}

        {datosBusqueda && datosBusqueda.length === 0 && terminoBusqueda && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <Search className="mx-auto mb-4 text-gray-400" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron resultados</h3>
            <p className="text-gray-600">
              No hay registros que coincidan con "{terminoBusqueda}"
            </p>
          </div>
        )}

        {datosBusqueda && datosBusqueda.length > 0 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                {datosBusqueda.length} resultado(s) encontrado(s)
              </h3>
              <span className="text-sm text-gray-600">
                Para "{terminoBusqueda}"
              </span>
            </div>

            {datosBusqueda.map((resultado, index) => (
              <motion.div
                key={resultado.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-xl ${getColorAccion(resultado.accion)}`}>
                      <FileText size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 capitalize">
                        {resultado.accion.toLowerCase()} en {resultado.tablaAfectada}
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Registro ID: {resultado.registroId}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {formatearFecha(resultado.createdAt)}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <User size={14} className="text-gray-400" />
                    <span className="text-gray-600">{resultado.usuario?.nombre}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar size={14} className="text-gray-400" />
                    <span className="text-gray-600">{resultado.ip || 'IP no registrada'}</span>
                  </div>
                </div>

                {/* Preview de datos relevantes */}
                {(resultado.datosAnteriores || resultado.datosNuevos) && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-700 space-y-1">
                      {resultado.datosAnteriores && (
                        <div>
                          <strong>Anterior:</strong> {JSON.stringify(resultado.datosAnteriores)}
                        </div>
                      )}
                      {resultado.datosNuevos && (
                        <div>
                          <strong>Nuevo:</strong> {JSON.stringify(resultado.datosNuevos)}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {!terminoBusqueda && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <Search className="mx-auto mb-4 text-gray-400" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Búsqueda en Bitácora</h3>
            <p className="text-gray-600">
              Ingresa un término de búsqueda para encontrar registros específicos en la bitácora del sistema
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default VistaBusquedaAvanzada