import { motion } from "motion/react"
import { FileText } from "lucide-react"

const HeaderCompras = () => {
  return (
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-blue-600 rounded-lg">
          <FileText className="text-white" size={24} />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Compras</h1>
      </div>
      <p className="text-gray-600 ml-11">Administra las compras y facturas del sistema</p>
      <div className="w-20 h-1 bg-blue-600 mt-2 ml-11 rounded-full"></div>
    </motion.div>
  )
}

export default HeaderCompras