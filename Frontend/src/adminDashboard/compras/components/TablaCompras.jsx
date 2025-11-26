import { motion } from "motion/react"
import { useState } from "react"
import { FileText, Building, User, Calendar } from "lucide-react"
import Paginacion from "./Paginacion"
import FilaCompra from "./FilaCompra"

const TablaCompras = ({
  compras,
  paginaActual,
  setPaginaActual,
  itemsPorPagina,
  setItemsPorPagina,
  selectedCompras,
  setSelectedCompras,
  menuEstadoAbierto,
  setMenuEstadoAbierto,
  openModal,
  openDetailsModal,
  cambiarEstado,
  eliminarCompra,
  formatCurrency,
  getEstadoColor,
  isLoading = false
}) => {
  const [selectAll, setSelectAll] = useState(false)

  // Paginación
  const comprasPaginadas = compras.slice(
    (paginaActual - 1) * itemsPorPagina,
    paginaActual * itemsPorPagina
  )

  const totalPaginas = Math.ceil(compras.length / itemsPorPagina)

  // Handlers de selección
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedCompras([])
    } else {
      setSelectedCompras(comprasPaginadas.map(c => c.id))
    }
    setSelectAll(!selectAll)
  }

  const handleSelectSingle = (id) => {
    setSelectedCompras(prev =>
      prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id]
    )
  }

  if (isLoading) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-xl shadow-lg overflow-hidden border border-blue-100">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando compras...</p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-xl shadow-lg overflow-hidden border border-blue-100">
      {/* Header de la tabla */}
      <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-4 mb-3 sm:mb-0">
          <div className="text-sm text-gray-600">
            Mostrando <span className="font-semibold">{comprasPaginadas.length}</span> de{" "}
            <span className="font-semibold">{compras.length}</span> compras
          </div>

          <select
            value={itemsPorPagina}
            onChange={(e) => {
              setItemsPorPagina(Number(e.target.value))
              setPaginaActual(1)
            }}
            className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={5}>5 por página</option>
            <option value={10}>10 por página</option>
            <option value={20}>20 por página</option>
            <option value={50}>50 por página</option>
          </select>
        </div>

        <Paginacion
          paginaActual={paginaActual}
          totalPaginas={totalPaginas}
          setPaginaActual={setPaginaActual}
          totalItems={compras.length}
          itemsPorPagina={itemsPorPagina}
          posicion="superior"
        />
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              <th className="text-left p-4">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="h-4 w-4 rounded border-white text-blue-600 focus:ring-blue-500 bg-white"
                />
              </th>
              <th className="text-left p-4 text-xs font-medium uppercase tracking-wider">
                <div className="flex items-center gap-1"><FileText size={16} />Factura</div>
              </th>
              <th className="text-left p-4 text-xs font-medium uppercase tracking-wider">
                <div className="flex items-center gap-1"><Building size={16} />Proveedor</div>
              </th>
              <th className="text-left p-4 text-xs font-medium uppercase tracking-wider">
                <div className="flex items-center gap-1"><User size={16} />Usuario</div>
              </th>
              <th className="text-left p-4 text-xs font-medium uppercase tracking-wider">
                <div className="flex items-center gap-1"><Calendar size={16} />Fecha</div>
              </th>
              <th className="text-left p-4 text-xs font-medium uppercase tracking-wider">Total</th>
              <th className="text-left p-4 text-xs font-medium uppercase tracking-wider">Estado</th>
              <th className="text-left p-4 text-xs font-medium uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {comprasPaginadas.map((compra, index) => (
              <FilaCompra
                key={compra.id}
                compra={compra}
                index={index}
                isSelected={selectedCompras.includes(compra.id)}
                onSelect={() => handleSelectSingle(compra.id)}
                menuEstadoAbierto={menuEstadoAbierto}
                setMenuEstadoAbierto={setMenuEstadoAbierto}
                onEdit={() => openModal(compra)}
                onViewDetails={() => openDetailsModal(compra)}
                onChangeEstado={(nuevoEstado) => cambiarEstado(compra, nuevoEstado)}
                onDelete={() => eliminarCompra(compra)}
                formatCurrency={formatCurrency}
                getEstadoColor={getEstadoColor}
              />
            ))}
            {comprasPaginadas.length === 0 && (
              <tr>
                <td colSpan={8} className="p-8 text-center text-gray-500">
                  <div className="flex flex-col items-center">
                    <FileText size={48} className="text-gray-300 mb-4" />
                    {compras.length > 0 ? "No se encontraron compras con los filtros aplicados" : "No hay compras registradas"}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer de la tabla */}
      <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-sm text-gray-600 mb-3 sm:mb-0">
          Mostrando <span className="font-semibold">{(paginaActual - 1) * itemsPorPagina + 1}</span> -{" "}
          <span className="font-semibold">
            {Math.min(paginaActual * itemsPorPagina, compras.length)}
          </span> de <span className="font-semibold">{compras.length}</span> compras
        </div>

        <Paginacion
          paginaActual={paginaActual}
          totalPaginas={totalPaginas}
          setPaginaActual={setPaginaActual}
          totalItems={compras.length}
          itemsPorPagina={itemsPorPagina}
          posicion="inferior"
        />
      </div>
    </motion.div>
  )
}

export default TablaCompras