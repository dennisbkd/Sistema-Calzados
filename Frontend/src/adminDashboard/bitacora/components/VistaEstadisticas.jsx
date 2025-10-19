import {
  Database,
  Users,
  FileText,
  Activity,
  TrendingUp,
  RefreshCw,
  AlertCircle,
  BarChart3
} from 'lucide-react'
import { useBitacora } from '../hooks/useBitacora'

const VistaEstadisticas = ({ filtrosGlobales }) => {
  const { data: estadisticas, isLoading, error, refetch, isFetching } =
    useBitacora.useEstadisticasCompletas(filtrosGlobales)

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Cargando estadísticas...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error al cargar estadísticas</h3>
        <p className="text-gray-600 mb-4">{error.message || 'Error desconocido'}</p>
        <button
          onClick={() => refetch()}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Reintentar
        </button>
      </div>
    )
  }

  if (estadisticas?.error) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error en el servidor</h3>
        <p className="text-gray-600 mb-4">{estadisticas.error}</p>
        <button
          onClick={() => refetch()}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Reintentar
        </button>
      </div>
    )
  }

  // Helper para obtener color según acción
  const getColorAccion = (accion) => {
    const colores = {
      CREATE: 'bg-green-600',
      UPDATE: 'bg-blue-600',
      DELETE: 'bg-red-600'
    }
    return colores[accion] || 'bg-gray-600'
  }

  // Helper para obtener icono de tendencia
  const getIconoTendencia = (tendencia) => {
    return (
      <TrendingUp
        size={16}
        className={
          tendencia === 'up' ? 'text-green-500' :
            tendencia === 'down' ? 'text-red-500' : 'text-gray-400'
        }
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Estadísticas del Sistema</h2>
            <p className="text-gray-600">Métricas y análisis de la actividad en la bitácora</p>
          </div>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="mt-4 md:mt-0 flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={16} className={isFetching ? 'animate-spin' : ''} />
            <span>{isFetching ? 'Actualizando...' : 'Actualizar'}</span>
          </button>
        </div>
      </div>

      {/* Tarjetas de Estadísticas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Registros</p>
              <p className="text-3xl font-bold text-gray-900">
                {estadisticas?.totalRegistros?.toLocaleString() || '0'}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <Database className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Usuarios Activos</p>
              <p className="text-3xl font-bold text-gray-900">
                {estadisticas?.usuariosActivos?.toLocaleString() || '0'}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <Users className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tablas Afectadas</p>
              <p className="text-3xl font-bold text-gray-900">
                {estadisticas?.tablasAfectadas?.toLocaleString() || '0'}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-xl">
              <FileText className="text-purple-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Acciones Hoy</p>
              <p className="text-3xl font-bold text-gray-900">
                {estadisticas?.accionesHoy?.toLocaleString() || '0'}
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-xl">
              <Activity className="text-orange-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos y Estadísticas Detalladas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribución por Tipo de Acción - DINÁMICO */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <BarChart3 size={20} />
            <span>Distribución por Acción</span>
          </h3>
          <div className="space-y-3">
            {estadisticas?.distribucionAcciones?.length > 0 ? (
              estadisticas.distribucionAcciones.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 capitalize">
                    {item.accion.toLowerCase()} ({item.total})
                  </span>
                  <span className="font-semibold text-gray-700">{item.porcentaje}%</span>
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getColorAccion(item.accion)}`}
                      style={{ width: `${item.porcentaje}%` }}
                    ></div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                No hay datos de distribución
              </div>
            )}
          </div>
        </div>

        {/* Actividad por Hora del Día - DINÁMICO */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividad por Hora</h3>
          <div className="space-y-2">
            {estadisticas?.actividadPorHora?.length > 0 ? (
              estadisticas.actividadPorHora.map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600 w-24">{item.hora}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${item.porcentaje}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-700 w-12">
                    {item.actividad}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                No hay datos de actividad por hora
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tablas Más Activas - DINÁMICO */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tablas Más Activas</h3>
        <div className="space-y-3">
          {estadisticas?.tablasActivas?.length > 0 ? (
            estadisticas.tablasActivas.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText size={16} className="text-gray-400" />
                  <span className="font-medium text-gray-900">{item.tabla}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    {item.acciones?.toLocaleString()} acciones
                  </span>
                  {getIconoTendencia(item.tendencia)}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-gray-500">
              No hay datos de tablas activas
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default VistaEstadisticas