"use client"

import { motion } from "motion/react"
import { Search, Filter, ArrowUpCircle, ArrowDownCircle, Package } from "lucide-react"
import { useState, useMemo } from "react"

const TablaMovimientos = ({ movimientos, loading }) => {
  const [filtroTexto, setFiltroTexto] = useState("")
  const [filtroTipo, setFiltroTipo] = useState("TODOS")

  const movimientosFiltrados = useMemo(() => {
    return movimientos.filter(mov => {
      const coincideTexto = 
        mov.producto?.toLowerCase().includes(filtroTexto.toLowerCase()) ||
        mov.motivo?.toLowerCase().includes(filtroTexto.toLowerCase()) ||
        mov.documento?.toLowerCase().includes(filtroTexto.toLowerCase())

      const coincideTipo = 
        filtroTipo === "TODOS" || mov.tipo === filtroTipo

      return coincideTexto && coincideTipo
    })
  }, [movimientos, filtroTexto, filtroTipo])

  const getColorTipo = (tipo) => {
    if (tipo.includes('ENTRADA')) {
      return 'bg-green-100 text-green-800'
    } else if (tipo.includes('SALIDA')) {
      return 'bg-red-100 text-red-800'
    } else {
      return 'bg-gray-100 text-gray-800'
    }
  }

  const getIconoTipo = (tipo) => {
    if (tipo.includes('ENTRADA')) {
      return <ArrowUpCircle size={14} />
    } else if (tipo.includes('SALIDA')) {
      return <ArrowDownCircle size={14} />
    } else {
      return <Package size={14} />
    }
  }

  // Función segura para formatear fecha
  const formatearFecha = (fecha) => {
    if (!fecha) return 'Fecha no disponible'
    try {
      return new Date(fecha).toLocaleDateString('es-BO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch (error) {
      console.error("Error formateando fecha:", error)
      return 'Fecha inválida'
    }
  }

  // Función segura para formatear texto
  const formatearTexto = (texto) => {
    return texto || 'No especificado'
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Cargando movimientos...</p>
      </div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden"
    >
      {/* Header de la tabla */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Movimientos de Inventario</h3>
            <p className="text-gray-600 text-sm">
              {movimientosFiltrados.length} de {movimientos.length} movimientos mostrados
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {/* Buscador */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Buscar movimientos..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
                value={filtroTexto}
                onChange={(e) => setFiltroTexto(e.target.value)}
              />
            </div>

            {/* Filtro por tipo */}
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
            >
              <option value="TODOS">Todos los tipos</option>
              <option value="ENTRADA_COMPRA">Entradas por Compra</option>
              <option value="SALIDA_VENTA">Salidas por Venta</option>
              <option value="ENTRADA_DEVOLUCION">Entradas por Devolución</option>
              <option value="SALIDA_AJUSTE">Salidas por Ajuste</option>
              <option value="ENTRADA_AJUSTE">Entradas por Ajuste</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha y Hora
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Producto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Talla/Color
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cantidad
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Motivo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Documento
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {movimientosFiltrados.map((mov, index) => (
              <motion.tr 
                key={mov.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {formatearFecha(mov.fecha)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getColorTipo(mov.tipo)}`}>
                    {getIconoTipo(mov.tipo)}
                    {mov.tipo ? mov.tipo.replace('_', ' ') : 'Tipo no especificado'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{formatearTexto(mov.producto)}</div>
                  <div className="text-sm text-gray-500">{formatearTexto(mov.categoria)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    <span className="font-medium">T {mov.talla || 'N/A'}</span>
                    <span className="mx-1">•</span>
                    <span>{formatearTexto(mov.color)}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm font-semibold ${
                    mov.tipo?.includes('ENTRADA') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {mov.tipo?.includes('ENTRADA') ? '+' : '-'}{mov.cantidad || 0}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 max-w-xs truncate">
                    {formatearTexto(mov.motivo)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 font-mono">
                    {formatearTexto(mov.documento)}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Estado vacío */}
      {movimientosFiltrados.length === 0 && (
        <div className="text-center py-12">
          <Filter size={48} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No se encontraron movimientos</h3>
          <p className="text-gray-600">Intenta ajustar los filtros de búsqueda</p>
        </div>
      )}
    </motion.div>
  )
}

export default TablaMovimientos