import { motion, AnimatePresence } from "motion/react"
import { X, Package, User, Calendar, DollarSign, FileText, UserCheck, Tag } from "lucide-react"

const DetalleVentaModal = ({ venta, isOpen, onClose }) => {
  if (!isOpen || !venta) return null

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-BO', {
      style: 'currency',
      currency: 'BOB'
    }).format(parseFloat(amount))
  }

  const getEstadoColor = (estado) => {
    switch (estado) {
      case "PAGADA": return "bg-green-100 text-green-800 border border-green-200"
      case "REGISTRADA": return "bg-blue-100 text-blue-800 border border-blue-200"
      case "ANULADA": return "bg-red-100 text-red-800 border border-red-200"
      default: return "bg-gray-100 text-gray-800 border border-gray-200"
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <FileText size={24} />
                  <div>
                    <h2 className="text-xl font-bold">Detalles de Venta</h2>
                    <p className="text-green-100">Factura: {venta.nroFactura}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-white hover:text-green-200 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {/* Información general */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <User className="text-green-600" size={20} />
                  <div>
                    <div className="text-sm text-gray-600">Cliente</div>
                    <div className="font-semibold text-gray-800">{venta.cliente}</div>
                    {venta.ciCliente && (
                      <div className="text-xs text-gray-500">CI: {venta.ciCliente}</div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <UserCheck className="text-green-600" size={20} />
                  <div>
                    <div className="text-sm text-gray-600">Vendedor</div>
                    <div className="font-semibold text-gray-800">{venta.usuario}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="text-green-600" size={20} />
                  <div>
                    <div className="text-sm text-gray-600">Fecha y Hora</div>
                    <div className="font-semibold text-gray-800">
                      {venta.fechaVenta} {venta.horaVenta}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <DollarSign className="text-green-600" size={20} />
                  <div>
                    <div className="text-sm text-gray-600">Total</div>
                    <div className="font-semibold text-green-600 text-lg">
                      {formatCurrency(venta.total)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Resumen financiero */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="text-sm text-gray-600">Subtotal</div>
                  <div className="text-lg font-semibold text-gray-800">{formatCurrency(venta.subtotal)}</div>
                </div>
                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="text-sm text-gray-600">Descuento</div>
                  <div className="text-lg font-semibold text-red-600">{formatCurrency(venta.descuento)}</div>
                </div>
                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="text-sm text-gray-600">Estado</div>
                  <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getEstadoColor(venta.estado)}`}>
                    {venta.estado}
                  </span>
                </div>
              </div>

              {/* Detalles de productos */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Package className="text-green-600" />
                  Productos Vendidos ({venta.detalles?.length || 0})
                </h3>

                {venta.detalles && venta.detalles.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="text-left p-3 text-xs font-medium uppercase text-gray-600">Producto</th>
                          <th className="text-left p-3 text-xs font-medium uppercase text-gray-600">Marca</th>
                          <th className="text-left p-3 text-xs font-medium uppercase text-gray-600">Código</th>
                          <th className="text-left p-3 text-xs font-medium uppercase text-gray-600">Color</th>
                          <th className="text-left p-3 text-xs font-medium uppercase text-gray-600">Talla</th>
                          <th className="text-left p-3 text-xs font-medium uppercase text-gray-600">Cantidad</th>
                          <th className="text-left p-3 text-xs font-medium uppercase text-gray-600">Precio Unit.</th>
                          <th className="text-left p-3 text-xs font-medium uppercase text-gray-600">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {venta.detalles.map((detalle, index) => (
                          <tr key={detalle.id || index} className="hover:bg-gray-50">
                            <td className="p-3 text-sm text-gray-900">{detalle.producto}</td>
                            <td className="p-3 text-sm text-gray-600">{detalle.marca}</td>
                            <td className="p-3 text-sm text-gray-600 font-mono">{detalle.codigo}</td>
                            <td className="p-3 text-sm text-gray-600">{detalle.color}</td>
                            <td className="p-3 text-sm text-gray-600">{detalle.talla}</td>
                            <td className="p-3 text-sm text-gray-600 text-center">{detalle.cantidad}</td>
                            <td className="p-3 text-sm text-gray-600">{formatCurrency(detalle.precioUnitario)}</td>
                            <td className="p-3 text-sm font-semibold text-green-600">{formatCurrency(detalle.subtotal)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No hay detalles disponibles para esta venta
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <div className="flex justify-end">
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default DetalleVentaModal