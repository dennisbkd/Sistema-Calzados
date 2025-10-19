import { useState } from 'react'
import { motion } from 'motion/react'
import {
  Search,
  Filter,
  User,
  ChevronRight,
  Users,
  RefreshCw,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  MoreHorizontal
} from 'lucide-react'
import { useNavigate } from 'react-router'
import { useBitacora } from '../hooks/useBitacora'

const VistaUsuariosActivos = ({ filtrosGlobales }) => {
  const navigate = useNavigate()
  const [filtros, setFiltros] = useState({
    search: '',
    pagina: 1,
    limite: 9
  })
  const [mostrarFiltrosAvanzados, setMostrarFiltrosAvanzados] = useState(false)

  const { data: respuesta, isLoading, error, refetch, isFetching } =
    useBitacora.useUsuariosActivos({ ...filtros, ...filtrosGlobales })

  const usuarios = respuesta?.usuarios || []
  const paginacion = respuesta?.paginacion

  const verDetallesUsuario = (usuarioId) => {
    navigate(`/home/bitacora/usuario/${usuarioId}`)
  }

  const actualizarFiltro = (campo, valor) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor,
      ...(campo !== 'pagina' && { pagina: 1 })
    }))
  }

  const limpiarFiltros = () => {
    setFiltros({
      search: '',
      pagina: 1,
      limite: 9
    })
  }

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= paginacion?.paginas) {
      actualizarFiltro('pagina', nuevaPagina)
    }
  }

  const getColorAccion = (accion) => {
    const colores = {
      CREATE: 'bg-green-500',
      UPDATE: 'bg-blue-500',
      DELETE: 'bg-red-500'
    }
    return colores[accion] || 'bg-gray-500'
  }

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const CardUsuario = ({ usuarioData }) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden cursor-pointer group"
        onClick={() => verDetallesUsuario(usuarioData.usuario.id)}
      >
        <div className="p-6">
          {/* Header del Usuario */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                {usuarioData.usuario.avatar}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {usuarioData.usuario.nombre}
                </h3>
                <p className="text-gray-600 text-sm">{usuarioData.usuario.email}</p>
              </div>
            </div>
            <ChevronRight className="text-gray-400 group-hover:text-blue-600 transform group-hover:translate-x-1 transition-all" size={20} />
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="text-center p-2 bg-blue-50 rounded-lg">
              <div className="text-lg font-bold text-blue-600">{usuarioData.estadisticas.totalAcciones}</div>
              <div className="text-xs text-blue-800">Total</div>
            </div>
            <div className="text-center p-2 bg-green-50 rounded-lg">
              <div className="text-lg font-bold text-green-600">{usuarioData.estadisticas.accionesHoy}</div>
              <div className="text-xs text-green-800">Hoy</div>
            </div>
            <div className="text-center p-2 bg-purple-50 rounded-lg">
              <div className="text-lg font-bold text-purple-600">{usuarioData.estadisticas.tablasAfectadas}</div>
              <div className="text-xs text-purple-800">Tablas</div>
            </div>
          </div>

          {/* Acciones Recientes */}
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-900 text-sm mb-2">
              Acciones Recientes
            </h4>
            {usuarioData.accionesRecientes.length > 0 ? (
              usuarioData.accionesRecientes.map((accion, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${getColorAccion(accion.accion)}`} />
                    <span className="capitalize text-gray-700 text-xs">
                      {accion.accion.toLowerCase()} {accion.tabla}
                    </span>
                  </div>
                  <span className="text-gray-400 text-xs">
                    {formatearFecha(accion.timestamp)}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-2 text-gray-500 text-sm">
                Sin acciones recientes
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-4 pt-3 border-t border-gray-200">
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>
                {usuarioData.estadisticas.ultimaAccion
                  ? `Última: ${formatearFecha(usuarioData.estadisticas.ultimaAccion)}`
                  : 'Sin actividad'
                }
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  const Paginacion = () => {
    if (!paginacion || paginacion.paginas <= 1) return null

    const paginasVisibles = 5
    let inicio = Math.max(1, filtros.pagina - Math.floor(paginasVisibles / 2))
    let fin = Math.min(paginacion.paginas, inicio + paginasVisibles - 1)

    if (fin - inicio + 1 < paginasVisibles) {
      inicio = Math.max(1, fin - paginasVisibles + 1)
    }

    const paginas = []
    for (let i = inicio; i <= fin; i++) {
      paginas.push(i)
    }

    return (
      <div className="flex justify-center items-center space-x-2 mt-6">
        <button
          onClick={() => cambiarPagina(filtros.pagina - 1)}
          disabled={filtros.pagina === 1}
          className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          <ChevronLeft size={16} />
        </button>

        {inicio > 1 && (
          <>
            <button
              onClick={() => cambiarPagina(1)}
              className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
            >
              1
            </button>
            {inicio > 2 && <MoreHorizontal size={16} className="text-gray-400" />}
          </>
        )}

        {paginas.map(pagina => (
          <button
            key={pagina}
            onClick={() => cambiarPagina(pagina)}
            className={`px-3 py-2 rounded-lg border ${filtros.pagina === pagina
              ? 'bg-blue-600 text-white border-blue-600'
              : 'border-gray-300 hover:bg-gray-50'
              }`}
          >
            {pagina}
          </button>
        ))}

        {fin < paginacion.paginas && (
          <>
            {fin < paginacion.paginas - 1 && <MoreHorizontal size={16} className="text-gray-400" />}
            <button
              onClick={() => cambiarPagina(paginacion.paginas)}
              className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
            >
              {paginacion.paginas}
            </button>
          </>
        )}

        <button
          onClick={() => cambiarPagina(filtros.pagina + 1)}
          disabled={filtros.pagina === paginacion.paginas}
          className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          <ChevronRightIcon size={16} />
        </button>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: filtros.limite }).map((_, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="h-12 bg-gray-200 rounded-lg"></div>
              <div className="h-12 bg-gray-200 rounded-lg"></div>
              <div className="h-12 bg-gray-200 rounded-lg"></div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="text-red-500 text-lg mb-4">Error al cargar los datos</div>
        <button
          onClick={() => refetch()}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <div>
      {/* Header específico de usuarios */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Usuarios Activos</h2>
            <p className="text-gray-600">Resumen de actividad por usuario</p>
          </div>
          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                {paginacion?.total || 0}
              </div>
              <div className="text-sm text-gray-600">Usuarios activos</div>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <Users className="text-blue-600" size={24} />
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
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar usuarios por nombre o email..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filtros.search}
                onChange={(e) => actualizarFiltro('search', e.target.value)}
              />
            </div>
          </div>

          <button
            onClick={() => setMostrarFiltrosAvanzados(!mostrarFiltrosAvanzados)}
            className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <Filter size={16} />
            <span>Filtros</span>
          </button>

          <button
            onClick={limpiarFiltros}
            className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Limpiar
          </button>
        </div>
      </div>

      {/* Información de resultados */}
      {usuarios.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <p className="text-gray-600">
              Mostrando {usuarios.length} de {paginacion?.total} usuarios
              {filtros.search && ` para "${filtros.search}"`}
            </p>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Mostrar:</span>
              <select
                value={filtros.limite}
                onChange={(e) => actualizarFiltro('limite', parseInt(e.target.value))}
                className="border border-gray-300 rounded-lg px-2 py-1 text-sm"
              >
                <option value={6}>6</option>
                <option value={9}>9</option>
                <option value={12}>12</option>
                <option value={24}>24</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Grid de Usuarios */}
      <div>
        {usuarios.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <User className="mx-auto mb-4 text-gray-400" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filtros.search || Object.values(filtrosGlobales).some(val => val)
                ? 'No se encontraron usuarios'
                : 'No hay usuarios activos'
              }
            </h3>
            <p className="text-gray-600 mb-4">
              {filtros.search || Object.values(filtrosGlobales).some(val => val)
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'No se encontraron registros de actividad de usuarios'
              }
            </p>
            {(filtros.search || Object.values(filtrosGlobales).some(val => val)) && (
              <button
                onClick={limpiarFiltros}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {usuarios.map((usuario, index) => (
                <motion.div
                  key={usuario.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <CardUsuario usuarioData={usuario} />
                </motion.div>
              ))}
            </div>

            {/* Paginación */}
            <Paginacion />
          </>
        )}
      </div>
    </div>
  )
}

export default VistaUsuariosActivos