import { motion } from "motion/react"

const EstadisticasCompras = ({ compras }) => {
  const estadisticas = {
    total: compras.length,
    pagadas: compras.filter(c => c.estado === "PAGADA").length,
    registradas: compras.filter(c => c.estado === "REGISTRADA").length,
    anuladas: compras.filter(c => c.estado === "ANULADA").length
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-blue-500">
        <div className="text-sm text-gray-600">Total Compras</div>
        <div className="text-2xl font-bold text-gray-800">{estadisticas.total}</div>
      </div>
      <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-green-500">
        <div className="text-sm text-gray-600">Pagadas</div>
        <div className="text-2xl font-bold text-gray-800">{estadisticas.pagadas}</div>
      </div>
      <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-yellow-500">
        <div className="text-sm text-gray-600">Registradas</div>
        <div className="text-2xl font-bold text-gray-800">{estadisticas.registradas}</div>
      </div>
      <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-red-500">
        <div className="text-sm text-gray-600">Anuladas</div>
        <div className="text-2xl font-bold text-gray-800">{estadisticas.anuladas}</div>
      </div>
    </motion.div>
  )
}

export default EstadisticasCompras