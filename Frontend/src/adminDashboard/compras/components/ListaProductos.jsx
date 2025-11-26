import { Package, Trash2 } from "lucide-react"

const ListaProductos = ({ detallesInput, eliminarDetalle, editingCompra, formatCurrency }) => {
  if (detallesInput.length === 0) {
    return (
      <div className="mb-6">
        <h4 className="text-md font-semibold mb-3 text-gray-800">
          Productos en la Compra (0)
        </h4>
        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
          <Package size={48} className="text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">No hay productos agregados a la compra</p>
          <p className="text-sm text-gray-400 mt-1">Agregue productos usando el formulario superior</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mb-6">
      <h4 className="text-md font-semibold mb-3 text-gray-800">
        Productos en la Compra ({detallesInput.length})
      </h4>

      <div className="space-y-3 max-h-60 overflow-y-auto">
        {detallesInput.map((detalle, index) => (
          <div key={detalle.id || index} className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 text-sm">
                  <div>
                    <label className="font-medium text-gray-700 text-xs">Producto</label>
                    <div className="text-sm text-gray-900 p-1">
                      {detalle.producto} - {detalle.color} - {detalle.talla}
                    </div>
                  </div>

                  <div>
                    <label className="font-medium text-gray-700 text-xs">Cantidad</label>
                    <div className="text-sm text-gray-900 p-1">{detalle.cantidad}</div>
                  </div>

                  <div>
                    <label className="font-medium text-gray-700 text-xs">Precio Unit.</label>
                    <div className="text-sm text-gray-900 p-1">{formatCurrency(detalle.precioUnitario)}</div>
                  </div>

                  <div className="md:col-span-2">
                    <div className="text-xs text-gray-600">
                      <div><strong>Marca:</strong> {detalle.marca}</div>
                      <div><strong>Variante:</strong> {detalle.color} - {detalle.talla}</div>
                      <div className="flex justify-between">
                        <span><strong>Código:</strong> {detalle.codigo}</span>
                        <span className={`${detalle.id && detalle.id < 1000 ? 'text-blue-600 font-semibold' : 'text-green-600 font-semibold'}`}>
                          {detalle.id && detalle.id < 1000 ? `Existente` : 'Nuevo'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="font-medium text-gray-700 text-xs">Subtotal</label>
                    <div className="text-green-600 font-bold text-sm">
                      {formatCurrency(detalle.subtotal)}
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => eliminarDetalle(index)}
                disabled={editingCompra && (editingCompra.estado === 'PAGADA' || editingCompra.estado === 'ANULADA')}
                className={`p-2 rounded-lg transition-colors ml-2 ${
                  editingCompra && (editingCompra.estado === 'PAGADA' || editingCompra.estado === 'ANULADA')
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-red-600 hover:text-red-700 hover:bg-red-50'
                }`}
                title={
                  editingCompra && (editingCompra.estado === 'PAGADA' || editingCompra.estado === 'ANULADA')
                    ? 'No se puede eliminar productos de compras pagadas o anuladas'
                    : 'Eliminar producto'
                }
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ListaProductos