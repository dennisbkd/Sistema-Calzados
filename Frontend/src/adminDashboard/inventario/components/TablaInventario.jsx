"use client"

import { motion } from "motion/react"
import { Search, Filter, AlertTriangle, CheckCircle, XCircle } from "lucide-react"
import { useState, useMemo } from "react"

const TablaInventario = ({ inventario, loading }) => {
  const [filtroTexto, setFiltroTexto] = useState("")
  const [filtroEstado, setFiltroEstado] = useState("TODOS")

  const inventarioFiltrado = useMemo(() => {
    return inventario.filter(item => {
      const productoNombre = item.producto?.nombre || item.producto || ''
      const marca = item.marca || ''
      const categoria = item.categoria?.nombre || item.categoria || ''
      const color = item.color || ''

      const coincideTexto = 
        productoNombre.toLowerCase().includes(filtroTexto.toLowerCase()) ||
        marca.toLowerCase().includes(filtroTexto.toLowerCase()) ||
        categoria.toLowerCase().includes(filtroTexto.toLowerCase()) ||
        color.toLowerCase().includes(filtroTexto.toLowerCase())

      const estadoStock = item.estadoStock || 'STOCK_NORMAL'
      
      const coincideEstado = 
        filtroEstado === "TODOS" ||
        (filtroEstado === "STOCK_BAJO" && estadoStock === "STOCK_BAJO") ||
        (filtroEstado === "SIN_STOCK" && estadoStock === "SIN_STOCK") ||
        (filtroEstado === "ACTIVOS" && item.activo) ||
        (filtroEstado === "INACTIVOS" && !item.activo)

      return coincideTexto && coincideEstado
    })
  }, [inventario, filtroTexto, filtroEstado])

  const getColorEstado = (estado) => {
    const estadoValido = estado || 'STOCK_NORMAL'
    switch (estadoValido) {
      case 'STOCK_NORMAL':
        return 'bg-green-100 text-green-800'
      case 'STOCK_BAJO':
        return 'bg-orange-100 text-orange-800'
      case 'SIN_STOCK':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getIconoEstado = (estado) => {
    const estadoValido = estado || 'STOCK_NORMAL'
    switch (estadoValido) {
      case 'STOCK_NORMAL':
        return <CheckCircle size={14} />
      case 'STOCK_BAJO':
        return <AlertTriangle size={14} />
      case 'SIN_STOCK':
        return <XCircle size={14} />
      default:
        return null
    }
  }

  const getTextoEstado = (estado) => {
    const estadoValido = estado || 'STOCK_NORMAL'
    return estadoValido.replace('_', ' ')
  }

  const formatearNumero = (valor, decimales = 2) => {
    if (valor === null || valor === undefined) return '0.00'
    const numero = Number(valor)
    return isNaN(numero) ? '0.00' : numero.toFixed(decimales)
  }

  const formatearPrecio = (precio) => {
    if (precio === null || precio === undefined) return '0.00'
    const numero = Number(precio)
    return isNaN(numero) ? '0.00' : `Bs. ${numero.toFixed(2)}`
  }

  const getProductoNombre = (item) => {
    return item.producto?.nombre || item.producto || ''
  }

  const getCategoriaNombre = (item) => {
    return item.categoria?.nombre || item.categoria || ''
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Cargando inventario...</p>
      </div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden"
    >
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Detalle del Inventario</h3>
            <p className="text-gray-600 text-sm">
              {inventarioFiltrado.length} de {inventario.length} productos mostrados
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Buscar productos..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-full sm:w-64"
                value={filtroTexto}
                onChange={(e) => setFiltroTexto(e.target.value)}
              />
            </div>

            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
            >
              <option value="TODOS">Todos los estados</option>
              <option value="STOCK_BAJO">Stock Bajo</option>
              <option value="SIN_STOCK">Sin Stock</option>
              <option value="ACTIVOS">Solo Activos</option>
              <option value="INACTIVOS">Solo Inactivos</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Producto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoría
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Talla/Color
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Precio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valor Total
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {inventarioFiltrado.map((item, index) => {
              const estadoStock = item.estadoStock || 'STOCK_NORMAL'
              return (
                <motion.tr 
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{getProductoNombre(item)}</div>
                      <div className="text-sm text-gray-500">{item.marca} - {item.modelo}</div>
                      <div className="text-xs text-gray-400">{item.codigo}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {getCategoriaNombre(item)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <span className="font-medium">T {formatearNumero(item.talla, 1)}</span>
                      <span className="mx-1">•</span>
                      <span>{item.color}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <span className={item.stockActual <= item.stockMinimo ? 'text-red-600 font-semibold' : ''}>
                        {formatearNumero(item.stockActual, 0)}
                      </span>
                      <span className="text-gray-400 text-xs ml-1">
                        / {formatearNumero(item.stockMinimo, 0)} mín.
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getColorEstado(estadoStock)}`}>
                      {getIconoEstado(estadoStock)}
                      {getTextoEstado(estadoStock)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatearPrecio(item.precioVenta)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      {formatearPrecio(item.valorTotal)}
                    </div>
                  </td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {inventarioFiltrado.length === 0 && (
        <div className="text-center py-12">
          <Filter size={48} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No se encontraron productos</h3>
          <p className="text-gray-600">Intenta ajustar los filtros de búsqueda</p>
        </div>
      )}
    </motion.div>
  )
}

export default TablaInventario