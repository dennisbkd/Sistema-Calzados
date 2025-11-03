import { useState } from "react"
import { ChevronLeft, ChevronRight, Package, User } from "lucide-react"

const TablaVentas = ({ ventas, loading }) => {
  const [paginaActual, setPaginaActual] = useState(1)
  const [itemsPorPagina, setItemsPorPagina] = useState(10)

  // Calcular items para la página actual
  const indiceInicial = (paginaActual - 1) * itemsPorPagina
  const indiceFinal = indiceInicial + itemsPorPagina
  const ventasPagina = ventas.slice(indiceInicial, indiceFinal)
  const totalPaginas = Math.ceil(ventas.length / itemsPorPagina)

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-BO', {
      style: 'currency',
      currency: 'BOB'
    }).format(amount)
  }

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'PAGADA': return 'bg-green-100 text-green-800'
      case 'REGISTRADA': return 'bg-blue-100 text-blue-800'
      case 'ANULADA': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* Header unificado */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        {/* Título y estadísticas */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Ventas del Periodo</h3>
          <p className="text-sm text-gray-600">
            Mostrando {ventasPagina.length} de {ventas.length} ventas
          </p>
        </div>

        {/* Selector de items por página */}
        <div className="flex items-center gap-2"> 
          <span className="text-sm text-gray-600">Mostrar:</span>
          <select 
            value={itemsPorPagina}
            onChange={(e) => {
              setItemsPorPagina(Number(e.target.value))
              setPaginaActual(1)
            }}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-blue-600">
              <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                Factura
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                Hora
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                Estado
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                Subtotal
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                Descuento
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                Total
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                Items
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {ventasPagina.map((venta) => (
              <tr key={venta.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{venta.nroFactura}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-900">{venta.cliente}</div>
                      {venta.ciCliente && (
                        <div className="text-xs text-gray-500">CI: {venta.ciCliente}</div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{venta.fechaVenta}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{venta.horaVenta}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEstadoColor(venta.estado)}`}>
                    {venta.estado}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600">
                    {formatCurrency(venta.subtotal)}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-red-600">
                    {formatCurrency(venta.descuento)}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-green-600">
                    {formatCurrency(venta.total)}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600">
                    {venta.detalles?.length || 0} productos
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {totalPaginas > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 pt-6 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Página {paginaActual} de {totalPaginas}
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPaginaActual(paginaActual - 1)}
              disabled={paginaActual === 1}
              className="flex items-center gap-1 px-3 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronLeft size={16} />
              Anterior
            </button>
            
            {/* Números de página */}
            <div className="flex gap-1">
              {[...Array(totalPaginas)].map((_, index) => {
                const pagina = index + 1
                return (
                  <button
                    key={pagina}
                    onClick={() => setPaginaActual(pagina)}
                    className={`w-10 h-10 text-sm border rounded-lg ${
                      pagina === paginaActual
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {pagina}
                  </button>
                )
              })}
            </div>
            
            <button
              onClick={() => setPaginaActual(paginaActual + 1)}
              disabled={paginaActual === totalPaginas}
              className="flex items-center gap-1 px-3 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Siguiente
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Estado vacío */}
      {ventas.length === 0 && !loading && (
        <div className="text-center py-8">
          <Package className="mx-auto text-gray-300 mb-3" size={48} />
          <p className="text-gray-500">No hay ventas en el periodo seleccionado</p>
        </div>
      )}
    </div>
  )
}

export default TablaVentas