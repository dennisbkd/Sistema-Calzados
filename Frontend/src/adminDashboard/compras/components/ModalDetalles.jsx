import { motion, AnimatePresence } from "motion/react"
import { X, FileText, Building, User, Calendar, Package, Download, Printer } from "lucide-react"
import { generarPDF } from "./../../../utils/servicePDF"

const ModalDetalles = ({
  showDetailsModal,
  closeDetailsModal,
  selectedCompraDetails,
  formatCurrency,
  getEstadoColor
}) => {
  // Generar factura PDF
  const generarFactura = (compra, opcion) => {
    try {
      generarPDF({
        titulo: "FACTURA DE COMPRA",
        metadata: {
          "Número de Factura": compra.nroFactura,
          "Fecha": compra.fechaCompra,
          "Hora": compra.horaCompra,
          "Proveedor": compra.proveedor,
          "Comprador": compra.usuario,
          "Total": `Bs. ${parseFloat(compra.total || 0).toFixed(2)}`
        },
        secciones: [
          {
            titulo: "Detalles de la Compra",
            tipo: "tabla",
            datos: compra.detalles || [],
            columnas: ['PRODUCTO', 'MARCA', 'CÓDIGO', 'COLOR', 'TALLA', 'CANTIDAD', 'PRECIO UNITARIO', 'SUBTOTAL'],
            color: [41, 128, 185]
          },
          {
            titulo: "Resumen de la Factura",
            tipo: "resumen", 
            datos: {
              "Subtotal": `Bs. ${parseFloat(compra.subtotal || compra.total || 0).toFixed(2)}`,
              "Descuentos": `Bs. ${parseFloat(compra.descuento || 0).toFixed(2)}`,
              "Total General": `Bs. ${parseFloat(compra.total || 0).toFixed(2)}`
            }
          }
        ],
        nombreArchivo: `factura_${compra.nroFactura}.pdf`,
        opcion: opcion
      })
    } catch (error) {
      console.error("Error al generar factura:", error)
    }
  }

  if (!selectedCompraDetails) return null

  return (
    <AnimatePresence>
      {showDetailsModal && selectedCompraDetails && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          className="fixed inset-0 flex items-center justify-center z-50 p-4" 
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            exit={{ scale: 0.95, opacity: 0 }} 
            className="bg-white rounded-xl shadow-2xl w-full max-w-6xl mx-auto border border-blue-200 max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <FileText className="text-blue-600" size={24} />
                  Detalles de Compra - {selectedCompraDetails.nroFactura}
                </h3>
                <button onClick={closeDetailsModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X size={24} />
                </button>
              </div>

              {/* Información general */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-3">
                  <Building size={18} className="text-blue-600" />
                  <div>
                    <div className="text-sm text-gray-600">Proveedor</div>
                    <div className="font-semibold text-gray-800">{selectedCompraDetails.proveedor}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <User size={18} className="text-blue-600" />
                  <div>
                    <div className="text-sm text-gray-600">Usuario</div>
                    <div className="font-semibold text-gray-800">{selectedCompraDetails.usuario}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar size={18} className="text-blue-600" />
                  <div>
                    <div className="text-sm text-gray-600">Fecha y Hora</div>
                    <div className="font-semibold text-gray-800">
                      {selectedCompraDetails.fechaCompra} {selectedCompraDetails.horaCompra}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${getEstadoColor(selectedCompraDetails.estado)}`}>
                    <FileText size={18} className={
                      selectedCompraDetails.estado === "PAGADA" ? "text-green-600" :
                      selectedCompraDetails.estado === "ANULADA" ? "text-red-600" : "text-blue-600"
                    } />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Estado</div>
                    <div className="font-semibold text-gray-800">{selectedCompraDetails.estado}</div>
                  </div>
                </div>

                <div className="md:col-span-2 flex items-center gap-3 p-3 bg-white rounded-lg border">
                  <div className="text-lg font-bold text-blue-600">
                    {formatCurrency(selectedCompraDetails.total)}
                  </div>
                  <div className="text-sm text-gray-600 ml-auto">Total de la compra</div>
                </div>
              </div>

              {/* Tabla de detalles */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                      <th className="text-left p-4 text-xs font-medium uppercase">Producto</th>
                      <th className="text-left p-4 text-xs font-medium uppercase">Marca</th>
                      <th className="text-left p-4 text-xs font-medium uppercase">Código</th>
                      <th className="text-left p-4 text-xs font-medium uppercase">Color</th>
                      <th className="text-left p-4 text-xs font-medium uppercase">Talla</th>
                      <th className="text-left p-4 text-xs font-medium uppercase">Cantidad</th>
                      <th className="text-left p-4 text-xs font-medium uppercase">Precio Unit.</th>
                      <th className="text-left p-4 text-xs font-medium uppercase">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {selectedCompraDetails.detalles?.map((detalle) => (
                      <tr key={detalle.id} className="hover:bg-blue-50 transition-colors">
                        <td className="p-4 text-sm text-gray-900">{detalle.producto}</td>
                        <td className="p-4 text-sm text-gray-600">{detalle.marca}</td>
                        <td className="p-4 text-sm text-gray-600 font-mono">{detalle.codigo}</td>
                        <td className="p-4 text-sm text-gray-600">{detalle.color}</td>
                        <td className="p-4 text-sm text-gray-600">{detalle.talla}</td>
                        <td className="p-4 text-sm text-gray-600 text-center">{detalle.cantidad}</td>
                        <td className="p-4 text-sm text-gray-600">{formatCurrency(detalle.precioUnitario)}</td>
                        <td className="p-4 text-sm font-semibold text-green-600">{formatCurrency(detalle.subtotal)}</td>
                      </tr>
                    ))}
                    {(!selectedCompraDetails.detalles || selectedCompraDetails.detalles.length === 0) && (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-gray-500">
                          <div className="flex flex-col items-center">
                            <Package size={48} className="text-gray-300 mb-4" />
                            No hay detalles disponibles para esta compra
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Botones de acción */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => generarFactura(selectedCompraDetails, "descargar")}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <Download size={16} />
                  Generar Reporte PDF
                </button>

                <button
                  onClick={() => generarFactura(selectedCompraDetails, "imprimir")}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2"
                  title="Imprimir factura"
                >
                  <Printer size={16} />
                  Imprimir Reporte PDF
                </button>

                <button onClick={closeDetailsModal} className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg transition-colors">
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

export default ModalDetalles