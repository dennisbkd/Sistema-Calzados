import { motion, AnimatePresence } from "motion/react"
import { Search, Filter, ChevronDown, Plus } from "lucide-react"

const FiltrosCompras = ({
  searchTerm,
  setSearchTerm,
  filtroEstado,
  setFiltroEstado,
  filtroMes,
  setFiltroMes,
  filtroAnio,
  setFiltroAnio,
  menuFiltrosAbierto,
  setMenuFiltrosAbierto,
  meses,
  años,
  limpiarFiltros,
  openModal
}) => {
  const toggleMenuFiltros = () => {
    setMenuFiltrosAbierto(!menuFiltrosAbierto)
  }

  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 border border-blue-100">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por factura, proveedor o usuario..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="relative">
            <button onClick={toggleMenuFiltros} className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter size={20} />
              <span>Filtros</span>
              <ChevronDown size={16} className={`transition-transform ${menuFiltrosAbierto ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {menuFiltrosAbierto && (
                <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 p-4">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Estado de Compra</label>
                      <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="TODAS">Todos los estados</option>
                        <option value="REGISTRADA">Registradas</option>
                        <option value="PAGADA">Pagadas</option>
                        <option value="ANULADA">Anuladas</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Mes</label>
                        <select value={filtroMes} onChange={(e) => setFiltroMes(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                          <option value="">Todos los meses</option>
                          {meses.map(mes => (
                            <option key={mes.value} value={mes.value}>{mes.label}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Año</label>
                        <select value={filtroAnio} onChange={(e) => setFiltroAnio(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                          <option value="">Todos los años</option>
                          {años.map(año => (
                            <option key={año} value={año}>{año}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button onClick={limpiarFiltros} className="flex-1 px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">Limpiar</button>
                      <button onClick={toggleMenuFiltros} className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Aplicar</button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button onClick={() => openModal()} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/25">
            <Plus size={20} />
            <span>Nueva Compra</span>
          </button>
        </div>

        {/* Filtros activos */}
        {(filtroEstado !== "TODAS" || filtroMes || filtroAnio) && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="flex flex-wrap gap-2 text-sm">
            <span className="text-gray-600">Filtros activos:</span>
            {filtroEstado !== "TODAS" && (<span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Estado: {filtroEstado}</span>)}
            {filtroMes && (<span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Mes: {meses.find(m => m.value === filtroMes)?.label}</span>)}
            {filtroAnio && (<span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">Año: {filtroAnio}</span>)}
            <button onClick={limpiarFiltros} className="text-red-600 hover:text-red-700 text-xs underline">Limpiar todos</button>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default FiltrosCompras