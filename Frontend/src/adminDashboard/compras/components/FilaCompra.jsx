import { motion } from "motion/react"
import { FileText, Pencil, Download, RefreshCcw, Trash2 } from "lucide-react"

const FilaCompra = ({
  compra,
  index,
  isSelected,
  onSelect,
  menuEstadoAbierto,
  setMenuEstadoAbierto,
  onEdit,
  onViewDetails,
  onChangeEstado,
  onDelete,
  formatCurrency,
  getEstadoColor
}) => {
  return (
    <motion.tr
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="hover:bg-blue-50 transition-colors"
    >
      <td className="p-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
      </td>
      <td className="p-4">
        <div className="text-sm font-semibold text-gray-900">{compra.nroFactura}</div>
      </td>
      <td className="p-4">
        <div className="text-sm text-gray-900">{compra.proveedor}</div>
      </td>
      <td className="p-4">
        <div className="text-sm text-gray-600">{compra.usuario}</div>
      </td>
      <td className="p-4">
        <div className="text-sm text-gray-600">{compra.fechaCompra}</div>
        <div className="text-xs text-gray-400">{compra.horaCompra}</div>
      </td>
      <td className="p-4">
        <div className="text-sm font-semibold text-gray-900">{formatCurrency(compra.total)}</div>
      </td>
      <td className="p-4">
        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getEstadoColor(compra.estado)}`}>
          {compra.estado}
        </span>
      </td>
      <td className="p-4">
        <div className="flex gap-2">
          <button
            onClick={onViewDetails}
            className="text-blue-600 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 transition-colors"
            title="Ver detalles"
          >
            <FileText size={16} />
          </button>

          <button
            onClick={() => {/* Generar PDF */}}
            className="text-purple-600 hover:text-purple-700 p-2 rounded-lg hover:bg-purple-50 transition-colors"
            title="Generar factura PDF"
          >
            <Download size={16} />
          </button>

          <button
            onClick={onEdit}
            disabled={compra.estado === 'PAGADA' || compra.estado === 'ANULADA'}
            className={`p-2 rounded-lg transition-colors ${compra.estado === 'PAGADA' || compra.estado === 'ANULADA'
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-green-600 hover:text-green-700 hover:bg-green-50'
              }`}
            title={
              compra.estado === 'PAGADA' || compra.estado === 'ANULADA'
                ? 'No se puede editar compras pagadas o anuladas'
                : 'Editar compra'
            }
          >
            <Pencil size={16} />
          </button>

          <div className="relative">
            <button
              onClick={() => setMenuEstadoAbierto(menuEstadoAbierto === compra.id ? null : compra.id)}
              disabled={compra.estado === 'PAGADA' || compra.estado === 'ANULADA'}
              className={`p-2 rounded-lg transition-colors ${compra.estado === 'PAGADA' || compra.estado === 'ANULADA'
                ? 'text-gray-400 cursor-not-allowed'
                : compra.estado === "REGISTRADA"
                  ? "text-blue-600 hover:bg-blue-50"
                  : "text-gray-600 hover:bg-gray-50"
                }`}
              title={
                compra.estado === 'PAGADA' || compra.estado === 'ANULADA'
                  ? 'No se puede cambiar el estado de compras pagadas o anuladas'
                  : `Cambiar estado (Actual: ${compra.estado})`
              }
            >
              <RefreshCcw size={16} />
            </button>

            {menuEstadoAbierto === compra.id && compra.estado === 'REGISTRADA' && (
              <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <button
                  onClick={() => onChangeEstado("PAGADA")}
                  className="w-full text-left px-3 py-2 text-sm rounded-t-lg text-green-600 hover:bg-green-50"
                >
                  Pagada
                </button>
                <button
                  onClick={() => onChangeEstado("ANULADA")}
                  className="w-full text-left px-3 py-2 text-sm rounded-b-lg text-red-600 hover:bg-red-50"
                >
                  Anulada
                </button>
              </div>
            )}
          </div>

          <button
            onClick={onDelete}
            disabled={compra.estado === 'PAGADA'}
            className={`p-2 rounded-lg transition-colors ${compra.estado === 'PAGADA'
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-red-600 hover:text-red-700 hover:bg-red-50'
              }`}
            title={
              compra.estado === 'PAGADA'
                ? 'No se puede anular compras pagadas'
                : 'Anular compra'
            }
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </motion.tr>
  )
}

export default FilaCompra