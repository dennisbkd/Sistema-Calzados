"use client"

import { Filter, RotateCcw } from "lucide-react"

const FiltrosInventario = ({ 
  filtros, 
  onFiltrosChange, 
  onConsultar, 
  onLimpiar, 
  loading,
  esReporte = false,
  categorias = [], // Nuevo prop para categorías
  productos = [],  // Nuevo prop para productos
  categoriasLoading = false, // Loading state para categorías
  productosLoading = false   // Loading state para productos
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-gray-700 mb-4">
        <Filter size={18} />
        <span className="font-medium">{esReporte ? 'Filtros de Reporte' : 'Filtros de Estado'}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Select para Categoría */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Categoría
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            value={filtros.categoriaId || ''}
            onChange={(e) => onFiltrosChange({ ...filtros, categoriaId: e.target.value })}
            disabled={categoriasLoading}
          >
            <option value="">Todas las categorías</option>
            {categoriasLoading ? (
              <option disabled>Cargando categorías...</option>
            ) : (
              categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nombre}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Select para Producto */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Producto
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            value={filtros.productoId || ''}
            onChange={(e) => onFiltrosChange({ ...filtros, productoId: e.target.value })}
            disabled={productosLoading}
          >
            <option value="">Todos los productos</option>
            {productosLoading ? (
              <option disabled>Cargando productos...</option>
            ) : (
              productos.map((producto) => (
                <option key={producto.id} value={producto.id}>
                  {producto.nombre}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Filtros de fecha solo para reportes */}
        {esReporte && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Inicio
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                value={filtros.fechaInicio || ''}
                onChange={(e) => onFiltrosChange({ ...filtros, fechaInicio: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Fin
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                value={filtros.fechaFin || ''}
                onChange={(e) => onFiltrosChange({ ...filtros, fechaFin: e.target.value })}
              />
            </div>
          </>
        )}

        {/* Checkboxes - se muestran siempre */}
        {!esReporte && (
          <>
            <div className="flex items-center">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filtros.conStockBajo || false}
                  onChange={(e) => onFiltrosChange({ ...filtros, conStockBajo: e.target.checked })}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">Solo stock bajo</span>
              </label>
            </div>

            <div className="flex items-center">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filtros.activos !== undefined ? filtros.activos : true}
                  onChange={(e) => onFiltrosChange({ ...filtros, activos: e.target.checked })}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">Solo activos</span>
              </label>
            </div>
          </>
        )}
      </div>

      {/* Segunda fila solo para reportes - checkboxes */}
      {esReporte && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filtros.conStockBajo || false}
                onChange={(e) => onFiltrosChange({ ...filtros, conStockBajo: e.target.checked })}
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <span className="text-sm text-gray-700">Solo stock bajo</span>
            </label>
          </div>

          <div className="flex items-center">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filtros.activos !== undefined ? filtros.activos : true}
                onChange={(e) => onFiltrosChange({ ...filtros, activos: e.target.checked })}
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <span className="text-sm text-gray-700">Solo activos</span>
            </label>
          </div>
        </div>
      )}

      {/* Botones de acción */}
      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={onConsultar}
          disabled={loading}
          className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Procesando...' : (esReporte ? 'Generar Reporte' : 'Consultar Estado')}
        </button>

        <button
          onClick={onLimpiar}
          className="flex items-center gap-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
        >
          <RotateCcw size={16} />
          Limpiar
        </button>
      </div>
    </div>
  )
}

export default FiltrosInventario