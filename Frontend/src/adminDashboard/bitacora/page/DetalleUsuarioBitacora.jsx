import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  ArrowLeft,
  User,
  Calendar,
  Database,
  Edit,
  Plus,
  Trash2,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Eye,
  FileText,
  RefreshCw,
  AlertCircle
} from 'lucide-react'
import { useParams, useNavigate } from 'react-router'
import { useBitacora } from '../hooks/useBitacora'

const DetalleUsuarioBitacora = () => {
  const { usuarioId } = useParams()
  const navigate = useNavigate()
  const [detallesAbiertos, setDetallesAbiertos] = useState({})
  const [filtros, setFiltros] = useState({
    search: '',
    tabla: '',
    fechaInicio: '',
    fechaFin: ''
  })

  // Usar TanStack Query para obtener detalles del usuario
  const {
    data: respuesta,
    isLoading,
    error,
    refetch,
    isFetching
  } = useBitacora.useDetallesUsuario(usuarioId, filtros)

  const usuario = respuesta?.usuario
  const movimientos = respuesta?.movimientos || []
  const paginacion = respuesta?.paginacion

  const toggleDetalles = (movimientoId) => {
    setDetallesAbiertos(prev => ({
      ...prev,
      [movimientoId]: !prev[movimientoId]
    }))
  }

  const getColorAccion = (accion) => {
    const colores = {
      CREATE: 'bg-green-100 text-green-800 border-green-200',
      UPDATE: 'bg-blue-100 text-blue-800 border-blue-200',
      DELETE: 'bg-red-100 text-red-800 border-red-200'
    }
    return colores[accion] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const getIconoAccion = (accion) => {
    const iconos = {
      CREATE: Plus,
      UPDATE: Edit,
      DELETE: Trash2
    }
    return iconos[accion] || FileText
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

  const aplicarFiltros = () => {
    // Los filtros se aplican automáticamente porque están en el queryKey
    refetch()
  }

  const limpiarFiltros = () => {
    setFiltros({
      search: '',
      tabla: '',
      fechaInicio: '',
      fechaFin: ''
    })
  }

  // Función para formatear valores según su tipo
  const formatearValor = (key, value) => {
    if (value === null || value === undefined) return 'N/A'

    // Si es un número, formatear como moneda si la key lo sugiere
    if (typeof value === 'number') {
      const clavesMoneda = ['precio', 'costo', 'total', 'subtotal', 'descuento', 'monto']
      const esMoneda = clavesMoneda.some(clave => key.toLowerCase().includes(clave))
      return esMoneda ? `$${value.toFixed(2)}` : value.toString()
    }

    // Si es booleano
    if (typeof value === 'boolean') {
      return value ? 'Sí' : 'No'
    }

    // Si es fecha
    if (typeof value === 'string' && !isNaN(Date.parse(value))) {
      return new Date(value).toLocaleDateString('es-ES')
    }

    return value.toString()
  }

  const CardMovimiento = ({ movimiento }) => {
    const IconoAccion = getIconoAccion(movimiento.accion)

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-xl ${getColorAccion(movimiento.accion)}`}>
                <IconoAccion size={20} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg capitalize">
                  {movimiento.accion.toLowerCase()} en {movimiento.tablaAfectada}
                </h3>
                <p className="text-gray-600">
                  Registro ID: {movimiento.registroId} • {formatearFecha(movimiento.createdAt)}
                </p>
              </div>
            </div>
            <button
              onClick={() => toggleDetalles(movimiento.id)}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2"
            >
              {detallesAbiertos[movimiento.id] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>

          {/* Detalles Expandibles */}
          <AnimatePresence>
            {detallesAbiertos[movimiento.id] && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-gray-200"
              >
                {/* Vista de Comparación */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Columna Anterior */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                      <FileText size={16} />
                      <span>Valores Anteriores</span>
                    </h4>
                    {movimiento.datosAnteriores ? (
                      <div className="space-y-2">
                        {Object.entries(movimiento.datosAnteriores).map(([key, value]) => (
                          <div key={key} className="flex justify-between items-center p-2 bg-red-50 rounded-lg">
                            <span className="font-medium text-red-800 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                            </span>
                            <span className="text-red-700 font-semibold">
                              {formatearValor(key, value)}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-gray-500 bg-gray-50 rounded-lg">
                        <div className="text-sm">Sin datos anteriores</div>
                        <div className="text-xs">(Registro nuevo)</div>
                      </div>
                    )}
                  </div>

                  {/* Columna Nuevo */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                      <Edit size={16} />
                      <span>Valores Nuevos</span>
                    </h4>
                    {movimiento.datosNuevos ? (
                      <div className="space-y-2">
                        {Object.entries(movimiento.datosNuevos).map(([key, value]) => {
                          const valorAnterior = movimiento.datosAnteriores?.[key]
                          const cambio = valorAnterior !== value

                          return (
                            <div
                              key={key}
                              className={`flex justify-between items-center p-2 rounded-lg ${cambio ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                                }`}
                            >
                              <span className={`font-medium capitalize ${cambio ? 'text-green-800' : 'text-gray-700'
                                }`}>
                                {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                                {cambio && <span className="ml-1 text-xs text-green-600">●</span>}
                              </span>
                              <span className={`font-semibold ${cambio ? 'text-green-700' : 'text-gray-600'
                                }`}>
                                {formatearValor(key, value)}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-gray-500 bg-gray-50 rounded-lg">
                        <div className="text-sm">Registro eliminado</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Información Adicional */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Database size={14} className="text-gray-400" />
                      <span className="text-gray-600">IP: {movimiento.ip || 'No registrada'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar size={14} className="text-gray-400" />
                      <span className="text-gray-600">
                        {new Date(movimiento.createdAt).toLocaleDateString('es-ES', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    )
  }

  // Estado de carga
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando detalles del usuario...</p>
          </div>
        </div>
      </div>
    )
  }

  // Estado de error
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error al cargar los datos</h3>
            <p className="text-gray-600 mb-4">{error.message || 'No se pudieron cargar los detalles del usuario'}</p>
            <button
              onClick={() => refetch()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Si no se encuentra el usuario
  if (!usuario) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <User className="mx-auto mb-4 text-gray-400" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Usuario no encontrado</h3>
            <p className="text-gray-600 mb-4">El usuario solicitado no existe o no tiene permisos</p>
            <button
              onClick={() => navigate('/home/bitacora')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Volver a la bitácora
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/home/bitacora')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                  {usuario.avatar}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{usuario.nombre}</h1>
                  <p className="text-gray-600">{usuario.email} • {usuario.rol || 'Usuario'}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">
                  {paginacion?.total || movimientos.length}
                </div>
                <div className="text-sm text-gray-600">Movimientos</div>
              </div>
              <button
                onClick={() => refetch()}
                disabled={isFetching}
                className="p-3 text-gray-600 hover:text-blue-600 transition-colors disabled:opacity-50"
                title="Actualizar"
              >
                <RefreshCw size={20} className={isFetching ? 'animate-spin' : ''} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Filtros */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar en movimientos..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={filtros.search}
                  onChange={(e) => setFiltros(prev => ({ ...prev, search: e.target.value }))}
                />
              </div>
            </div>

            <select
              value={filtros.tabla}
              onChange={(e) => setFiltros(prev => ({ ...prev, tabla: e.target.value }))}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todas las tablas</option>
              <option value="Producto">Producto</option>
              <option value="ProductoVariante">ProductoVariante</option>
              <option value="Compra">Compra</option>
              <option value="Venta">Venta</option>
              <option value="Usuario">Usuario</option>
              <option value="Cliente">Cliente</option>
              <option value="Proveedor">Proveedor</option>
            </select>

            <div className="flex space-x-2">
              <button
                onClick={aplicarFiltros}
                disabled={isFetching}
                className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                <Filter size={16} />
                <span>{isFetching ? 'Buscando...' : 'Filtrar'}</span>
              </button>
              <button
                onClick={limpiarFiltros}
                className="px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Limpiar
              </button>
            </div>
          </div>

          {/* Filtros de fecha */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha desde
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={filtros.fechaInicio}
                onChange={(e) => setFiltros(prev => ({ ...prev, fechaInicio: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha hasta
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={filtros.fechaFin}
                onChange={(e) => setFiltros(prev => ({ ...prev, fechaFin: e.target.value }))}
              />
            </div>
          </div>
        </motion.div>

        {/* Lista de Movimientos */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {movimientos.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <Eye className="mx-auto mb-4 text-gray-400" size={48} />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay movimientos</h3>
              <p className="text-gray-600">
                {Object.values(filtros).some(val => val)
                  ? 'No se encontraron registros con los filtros aplicados'
                  : 'No se encontraron registros para este usuario'
                }
              </p>
              {Object.values(filtros).some(val => val) && (
                <button
                  onClick={limpiarFiltros}
                  className="mt-4 text-blue-600 hover:text-blue-800"
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          ) : (
            <>
              {movimientos.map((movimiento, index) => (
                <motion.div
                  key={movimiento.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <CardMovimiento movimiento={movimiento} />
                </motion.div>
              ))}

              {/* Información de paginación */}
              {paginacion && paginacion.paginas > 1 && (
                <div className="bg-white rounded-2xl shadow-lg p-4 text-center">
                  <p className="text-gray-600">
                    Mostrando {movimientos.length} de {paginacion.total} movimientos
                  </p>
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default DetalleUsuarioBitacora