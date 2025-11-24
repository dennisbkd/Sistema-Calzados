import { Trash2, AlertTriangle, Package, MapPin } from "lucide-react"
import { SpinnerCargando } from "../../../global/components/SpinnerCargando"
import { useEliminarUbicacion } from '../hooks/useZonas'
import { Modal } from "../../../global/components/modal/Modal"

export const ModalEliminarUbicacion = ({
  abierto,
  cambiarEstado,
  ubicacion,
  onUbicacionEliminada
}) => {
  const { mutate: eliminarUbicacion, isLoading } = useEliminarUbicacion()

  const handleEliminar = () => {
    if (!ubicacion) return

    eliminarUbicacion(ubicacion.id, {
      onSuccess: () => {
        if (onUbicacionEliminada) {
          onUbicacionEliminada(ubicacion.id)
        }
        cambiarEstado()
      }
    })
  }

  return (
    <Modal
      abierto={abierto}
      cambiarEstado={cambiarEstado}
      titulo="Eliminar Ubicación"
      size="md"
    >
      <div className="space-y-4">
        {/* Icono de advertencia */}
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
        </div>

        {/* Mensaje principal */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            ¿Eliminar ubicación "{ubicacion?.codigo}"?
          </h3>
          <p className="text-sm text-gray-600">
            Esta acción no se puede deshacer. La ubicación será marcada como inactiva.
          </p>
        </div>

        {/* Información de la ubicación */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">Código:</span>
              <span className="font-medium">{ubicacion?.codigo}</span>
            </div>
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">Variantes:</span>
              <span className="font-medium">{ubicacion?.cantidadVariantes || 0}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Stock total:</span>
              <span className="font-medium">{ubicacion?.stockTotal || 0}</span>
            </div>
            {ubicacion?.descripcion && (
              <div>
                <span className="text-gray-600">Descripción:</span>
                <p className="font-medium mt-1">{ubicacion.descripcion}</p>
              </div>
            )}
          </div>
        </div>

        {/* Advertencia si tiene variantes */}
        {ubicacion?.cantidadVariantes > 0 && (
          <div className="border border-red-200 bg-red-50 rounded-lg p-3">
            <div className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="w-4 h-4" />
              <span className="font-medium text-sm">Advertencia</span>
            </div>
            <p className="text-red-700 text-xs mt-1">
              Esta ubicación tiene {ubicacion.cantidadVariantes} variante(s) asignadas.
              Debes remover todas las variantes antes de poder eliminar la ubicación.
            </p>
          </div>
        )}

        {/* Acciones */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={cambiarEstado}
            disabled={isLoading}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleEliminar}
            disabled={isLoading || (ubicacion?.cantidadVariantes > 0)}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <SpinnerCargando tamaño="sm" />
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Eliminar Ubicación
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  )
}