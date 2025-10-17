import { EstadoEtiqueta } from '../../../global/components/Etiqueta/EstadoEtiqueta'
import { CheckCircle, XCircle } from 'lucide-react'

const TablaVariante = ({ variantes }) => {
  return (
    <div>
      <h4 className="text-lg font-medium text-gray-900 mb-4">Variantes</h4>
      <div className='border border-gray-200 rounded-lg overflow-hidden overflow-x-auto'>
        <table className="w-full ">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Talla - Color</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Código</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Precio Venta</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Precio Compra</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Stock</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Estado</th>
            </tr>
          </thead>
          <tbody>
            {variantes && variantes.length > 0 ? (variantes.map((variante => (
              <tr key={variante.id} className="border-b border-gray-200">
                <td className="px-4 py-3 text-sm text-gray-700">{`${variante.talla} - ${variante.color}`}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{variante.codigo}</td>
                <td className="px-4 py-3 text-sm font-semibold text-green-600">${variante.precioVenta}</td>
                <td className="px-4 py-3 text-sm font-semibold text-gray-600">${variante.precioCompra}</td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  <span className={`font-semibold ${variante.stockActual <= variante.stockMinimo
                    ? 'text-red-600'
                    : 'text-gray-900'
                    }`}>
                    {variante.stockActual} / {variante.stockMinimo}</span></td>
                <td >
                  <EstadoEtiqueta activo={variante.activo} textos={{ activo: "Activo", inactivo: "Inactivo" }} iconos={{ activo: CheckCircle, inactivo: XCircle }} />
                </td>
              </tr>
            )))) : (
              <tr>
                <td colSpan="5" className="px-4 py-3 text-sm text-gray-700 text-center">No hay variantes disponibles</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TablaVariante