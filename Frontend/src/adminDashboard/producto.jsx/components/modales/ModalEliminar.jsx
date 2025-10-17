
import { Modal } from '../../../../global/components/modal/Modal'
import { AlertTriangle, X, Trash2 } from "lucide-react"


export const ModalEliminar = ({ isOpen, cerrar, eliminarProducto, tipo = "elemento", nombre = "" }) => {

  const handleEliminar = () => {
    eliminarProducto()
    cerrar()
  }

  return (
    <Modal abierto={isOpen} cambiarEstado={cerrar} titulo={`Eliminar ${tipo}`} size="md">
      <div className="flex items-center gap-3 p-4 bg-red-50 rounded-md">
        <AlertTriangle className="h-6 w-6 text-red-600" />
        <p className="text-gray-700">
          ¿Estás seguro de que deseas eliminar este {tipo}? <strong>{nombre}</strong><br />
          <span className="text-sm text-gray-500">Esta acción no se puede deshacer.</span>
        </p>
      </div>
      <div className="flex justify-end mt-6 gap-3">
        <button
          onClick={cerrar}
          className="flex items-center gap-2 px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
        >
          <X className="h-4 w-4" />
          Cancelar
        </button>

        <button
          onClick={handleEliminar}
          className="flex items-center gap-2 px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
        >
          <Trash2 className="h-4 w-4" />
          Eliminar
        </button>
      </div>
    </Modal>

  )
}
