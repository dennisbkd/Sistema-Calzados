import { Modal } from "../../../../global/components/modal/Modal"
import { EstadoEtiqueta } from "../../../../global/components/Etiqueta/EstadoEtiqueta"
import { CheckCircle, XCircle } from "lucide-react"
import TablaVariante from "../TablaVariante"

const VisualizarDetalle = ({ cerrar, isOpen, detalleProducto, calcularStockTotal }) => {
  const calcularBeneficioNeto = (variantes) => {
    if (variantes.length === 0) return 0;
    const totalPrecio = variantes.reduce((acc, variante) => {
      const precio = parseFloat(variante.precioVenta)
      const costos = parseFloat(variante.precioCompra)
      return acc + (precio - costos) * variante.stockActual;
    }, 0);
    return totalPrecio.toFixed(2);
  }

  const calcularVariantesActivas = (variantes) => {
    return variantes.filter(variant => variant.activo).length;
  }

  return (
    <Modal
      abierto={isOpen}
      cambiarEstado={cerrar}
      titulo={`Detalles del Producto - ${detalleProducto ? detalleProducto.nombre : ''}`}
      size="xl"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h4 className="text-lg font-medium text-gray-900 mb-4">Información General</h4>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-700">Nombre:</label>
              <p className="text-sm text-gray-600">{detalleProducto ? detalleProducto.nombre : ''}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Marca - Modelo:</label>
              <p className="text-sm text-gray-600">{detalleProducto ? detalleProducto.marca : ''} - {detalleProducto ? detalleProducto.modelo : ''}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Categoria:</label>
              <p className="text-sm text-gray-600">{detalleProducto ? detalleProducto.categoria : ''}</p>
            </div>
            <div className="flex items-center gap-x-2">
              <label className="text-sm font-medium text-gray-700">Estado:</label>
              <EstadoEtiqueta activo={detalleProducto?.estado} textos={{ activo: "Activo", inactivo: "Inactivo" }}
                iconos={{ activo: CheckCircle, inactivo: XCircle }} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Descripción:</label>
              <p className="text-sm text-gray-600">{detalleProducto ? detalleProducto.descripcion : ''}</p>
            </div>
          </div>
        </div>
        <div>
          <h4 className="text-lg font-medium text-gray-900 mb-4">Estadísticas</h4>
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex justify-between">
              <label className="text-gray-600">Número de Variantes:</label>
              <p className="font-semibold text-gray-900">{detalleProducto ? detalleProducto.variantes.length : 0}</p>
            </div>
            <div className="flex justify-between">
              <label className="text-gray-600">Stock Total:</label>
              <p className="font-semibold text-gray-900">{detalleProducto ? calcularStockTotal(detalleProducto.variantes) : 0}</p>
            </div>
            <div className="flex justify-between">
              <label className="text-gray-600">Variantes Activas:</label>
              <p className="font-semibold text-gray-900">{detalleProducto ? calcularVariantesActivas(detalleProducto.variantes) : 0}</p>
            </div>
            <div className="flex justify-between">
              <label className="text-gray-600">Beneficio Neto:</label>
              <p className="font-semibold text-green-600">${detalleProducto ? calcularBeneficioNeto(detalleProducto.variantes) : 0}</p>
            </div>
          </div>
        </div>
      </div>
      <TablaVariante
        variantes={detalleProducto ? detalleProducto.variantes : []}
      />
    </Modal>
  )
}

export default VisualizarDetalle