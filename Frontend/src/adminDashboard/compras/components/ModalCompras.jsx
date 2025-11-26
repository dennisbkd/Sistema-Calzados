import { motion, AnimatePresence } from "motion/react"
import { X, AlertTriangle } from "lucide-react"
import FormularioCompra from "./FormularioCompra"

const ModalCompras = ({
  showModal,
  closeModal,
  editingCompra,
  proveedores,
  cargandoProveedores,
  todasLasVariantes,
  cargandoProductos,
  generateCodigoFactura,
  crear,
  editar,
  usuario
}) => {
  return (
    <AnimatePresence>
      {showModal && (
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
              {editingCompra && (editingCompra.estado === 'PAGADA' || editingCompra.estado === 'ANULADA') && (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="text-yellow-600" size={24} />
                    <div>
                      <h4 className="font-semibold text-yellow-800">Compra {editingCompra.estado.toLowerCase()}</h4>
                      <p className="text-yellow-700 text-sm">
                        Esta compra está {editingCompra.estado.toLowerCase()} y no puede ser editada.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">
                  {editingCompra ? "Editar Compra" : "Registrar Nueva Compra"}
                </h3>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X size={24} />
                </button>
              </div>

              <FormularioCompra
                editingCompra={editingCompra}
                proveedores={proveedores}
                cargandoProveedores={cargandoProveedores}
                todasLasVariantes={todasLasVariantes}
                cargandoProductos={cargandoProductos}
                generateCodigoFactura={generateCodigoFactura}
                crear={crear}
                editar={editar}
                usuario={usuario}
                closeModal={closeModal}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ModalCompras