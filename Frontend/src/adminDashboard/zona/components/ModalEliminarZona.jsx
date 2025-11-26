import { useState } from 'react'
import { Trash2, AlertTriangle, Package, MapPin } from "lucide-react"

import { SpinnerCargando } from "../../../global/components/SpinnerCargando"
import { useEliminarZona } from '../hooks/useZonas'
import { Modal } from '../../../global/components/modal/Modal'

export const ModalEliminarZona = ({
  abierto,
  cambiarEstado,
  zona,
  onZonaEliminada
}) => {
  const [eliminacionForzada, setEliminacionForzada] = useState(false)
  const { mutate: eliminarZona, isLoading } = useEliminarZona()

  const handleEliminar = () => {
    if (!zona) return

    eliminarZona({
      zonaId: zona.id,
      forzado: eliminacionForzada
    }, {
      onSuccess: () => {
        if (onZonaEliminada) {
          onZonaEliminada(zona.id)
        }
        cambiarEstado()
        setEliminacionForzada(false)
      }
    })
  }

  const handleCerrar = () => {
    setEliminacionForzada(false)
    cambiarEstado()
  }

  return (
    <Modal
      abierto={abierto}
      cambiarEstado={handleCerrar}
      titulo="Eliminar Zona"
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
            ¿Eliminar zona "{zona?.nombre}"?
          </h3>
          <p className="text-sm text-gray-600">
            Esta acción no se puede deshacer. La zona será marcada como inactiva.
          </p>
        </div>

        {/* Información de la zona */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">Zona:</span>
              <span className="font-medium">{zona?.nombre}</span>
            </div>
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">Variantes:</span>
              <span className="font-medium">{zona?.cantidadVariantes || 0}</span>
            </div>
            {zona?.descripcion && (
              <div>
                <span className="text-gray-600">Descripción:</span>
                <p className="font-medium mt-1">{zona.descripcion}</p>
              </div>
            )}
          </div>
        </div>

        {/* Opción de eliminación forzada */}
        <div className="border border-orange-200 bg-orange-50 rounded-lg p-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={eliminacionForzada}
              onChange={(e) => setEliminacionForzada(e.target.checked)}
              className="mt-0.5 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
            />
            <div>
              <div className="font-medium text-orange-800 text-sm">
                Eliminar forzadamente (incluyendo ubicaciones)
              </div>
              <p className="text-orange-700 text-xs mt-1">
                Marca esta opción si quieres eliminar la zona incluso si tiene ubicaciones activas.
                Todas las ubicaciones de esta zona también serán eliminadas.
              </p>
            </div>
          </label>
        </div>

        {/* Acciones */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={handleCerrar}
            disabled={isLoading}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleEliminar}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <SpinnerCargando tamaño="sm" />
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                {eliminacionForzada ? 'Eliminar Todo' : 'Eliminar Zona'}
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  )
}