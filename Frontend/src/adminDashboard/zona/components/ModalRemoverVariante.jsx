import { useState, useEffect } from 'react'
import { motion } from "motion/react"
import { Trash2, Package, Search } from "lucide-react"

import { BuscarInput } from "../../../global/components/filtros/BuscarInput"
import { SpinnerCargando } from "../../../global/components/SpinnerCargando"
import { Modal } from '../../../global/components/modal/Modal'
import { useVariantesEnUbicacion } from '../hooks/useZonas'

export const ModalRemoverVariantes = ({
  abierto,
  cambiarEstado,
  ubicacion,
  onRemoverVariantes,
  isLoading = false,
  onCerrarModal
}) => {
  const [variantesSeleccionadas, setVariantesSeleccionadas] = useState([])
  const [terminoBusqueda, setTerminoBusqueda] = useState('')

  // Usar el hook para obtener variantes en la ubicación
  const {
    data: variantesData,
    isLoading: isLoadingVariantes,
    error: errorVariantes,
    refetch: refetchVariantes
  } = useVariantesEnUbicacion(ubicacion?.id, terminoBusqueda)

  const variantesEnUbicacion = variantesData?.error ? [] : (variantesData || [])

  // Refrescar datos cuando se abre el modal
  useEffect(() => {
    if (abierto) {
      refetchVariantes()
    }
  }, [abierto, refetchVariantes])

  // Limpiar selección cuando se cierra el modal
  useEffect(() => {
    if (!abierto) {
      setVariantesSeleccionadas([])
      setTerminoBusqueda('')
    }
  }, [abierto])

  const toggleVariante = (varianteId) => {
    if (variantesSeleccionadas.includes(varianteId)) {
      setVariantesSeleccionadas(variantesSeleccionadas.filter(id => id !== varianteId))
    } else {
      setVariantesSeleccionadas([...variantesSeleccionadas, varianteId])
    }
  }

  const handleRemover = () => {
    onRemoverVariantes(ubicacion.id, variantesSeleccionadas)
    onCerrarModal()
  }

  return (
    <Modal
      abierto={abierto}
      cambiarEstado={cambiarEstado}
      titulo={`Remover Variantes - ${ubicacion?.codigo}`}
      size="lg"
    >
      <div className="space-y-6">
        {/* Búsqueda */}
        <div>
          <BuscarInput
            value={terminoBusqueda}
            onChange={setTerminoBusqueda}
            placeholder="Buscar variantes en esta ubicación..."
          />
        </div>

        {/* Información de la ubicación */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Ubicación:</span>
              <p className="font-medium">{ubicacion?.codigo}</p>
            </div>
            <div>
              <span className="text-gray-600">Variantes totales:</span>
              <p className="font-medium">{variantesEnUbicacion.length}</p>
            </div>
          </div>
        </div>

        {/* Lista de variantes */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
            <Search className="w-4 h-4" />
            Variantes en Ubicación ({variantesEnUbicacion.length})
            {isLoadingVariantes && <SpinnerCargando tamaño="sm" />}
          </h4>

          {errorVariantes ? (
            <div className="text-center py-8 text-red-500">
              <p>Error al cargar variantes</p>
            </div>
          ) : isLoadingVariantes ? (
            <div className="text-center py-8">
              <SpinnerCargando texto="Cargando variantes..." />
            </div>
          ) : variantesEnUbicacion.length > 0 ? (
            variantesEnUbicacion.map((inventario) => (
              <motion.div
                key={inventario.varianteId}
                whileHover={{ scale: 1.01 }}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${variantesSeleccionadas.includes(inventario.varianteId)
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-200 hover:border-gray-300'
                  }`}
                onClick={() => toggleVariante(inventario.varianteId)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Package className="w-4 h-4 text-gray-500" />
                      <span className="font-medium text-gray-900">{inventario.codigo}</span>
                    </div>
                    <p className="text-sm text-gray-600">{inventario.producto.nombre}</p>
                    <div className="flex gap-4 mt-1 text-xs text-gray-500">
                      <span>Talla: {inventario.talla}</span>
                      <span>Color: {inventario.color}</span>
                      <span>Marca: {inventario.producto.marca}</span>
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      Cantidad actual: <span className="font-medium">{inventario.cantidad}</span>
                    </div>
                  </div>

                  <div className={`w-4 h-4 rounded border ${variantesSeleccionadas.includes(inventario.varianteId)
                    ? 'bg-red-500 border-red-500'
                    : 'border-gray-300'
                    }`} />
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No hay variantes en esta ubicación</p>
            </div>
          )}
        </div>

        {/* Resumen de selección */}
        {variantesSeleccionadas.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-lg p-4"
          >
            <div className="flex items-center gap-2 text-red-800 mb-2">
              <Trash2 className="w-4 h-4" />
              <span className="font-medium">Variantes seleccionadas para remover:</span>
            </div>
            <p className="text-sm text-red-700">
              Se removerán {variantesSeleccionadas.length} variantes de esta ubicación.
            </p>
          </motion.div>
        )}

        {/* Acciones */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={cambiarEstado}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleRemover}
            disabled={variantesSeleccionadas.length === 0 || isLoading}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <SpinnerCargando tamaño="sm" />
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Remover {variantesSeleccionadas.length} Variantes
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  )
}