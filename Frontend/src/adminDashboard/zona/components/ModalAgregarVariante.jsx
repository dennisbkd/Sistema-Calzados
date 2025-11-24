import { useState, useEffect } from 'react'
import { motion } from "motion/react"
import { Plus, Search, Package, X } from "lucide-react"

import { BuscarInput } from "../../../global/components/filtros/BuscarInput"
import { SpinnerCargando } from "../../../global/components/SpinnerCargando"

import toast from 'react-hot-toast'
import { Modal } from '../../../global/components/modal/Modal'
import { useVariantesDisponibles } from '../hooks/useZonas'

export const ModalAgregarVariantes = ({
  abierto,
  cambiarEstado,
  ubicacion,
  onAgregarVariantes,
  isLoading = false,
  onCerrarModal
}) => {
  const [variantesSeleccionadas, setVariantesSeleccionadas] = useState([])
  const [terminoBusqueda, setTerminoBusqueda] = useState('')
  const [cantidades, setCantidades] = useState({})

  // Usar el hook para obtener variantes disponibles
  const {
    data: variantesData,
    isLoading: isLoadingVariantes,
    error: errorVariantes
  } = useVariantesDisponibles(ubicacion?.id, terminoBusqueda)

  const variantesDisponibles = variantesData?.error ? [] : (variantesData || [])

  // Limpiar selección cuando se cierra el modal
  useEffect(() => {
    if (!abierto) {
      setVariantesSeleccionadas([])
      setCantidades({})
      setTerminoBusqueda('')
    }
  }, [abierto])

  const toggleVariante = (variante) => {
    const yaSeleccionada = variantesSeleccionadas.find(v => v.id === variante.id)

    if (yaSeleccionada) {
      setVariantesSeleccionadas(variantesSeleccionadas.filter(v => v.id !== variante.id))
      setCantidades(prev => {
        const nuevasCantidades = { ...prev }
        delete nuevasCantidades[variante.id]
        return nuevasCantidades
      })
    } else {
      setVariantesSeleccionadas([...variantesSeleccionadas, variante])
      setCantidades(prev => ({
        ...prev,
        [variante.id]: 1
      }))
    }
  }

  const actualizarCantidad = (varianteId, cantidad) => {
    if (cantidad < 1) return

    const variante = variantesDisponibles.find(v => v.id === varianteId)
    if (cantidad > variante.stockActual) {
      toast.error(`No hay suficiente stock. Máximo: ${variante.stockActual}`)
      return
    }

    setCantidades(prev => ({
      ...prev,
      [varianteId]: cantidad
    }))
  }

  const handleAgregar = () => {
    const variantesConCantidad = variantesSeleccionadas.map(variante => ({
      varianteId: variante.id,
      cantidad: cantidades[variante.id] || 1
    }))

    onAgregarVariantes(ubicacion.id, variantesConCantidad)
    onCerrarModal()
  }

  return (
    <Modal
      abierto={abierto}
      cambiarEstado={cambiarEstado}
      titulo={`Agregar Variantes - ${ubicacion?.codigo}`}
      size="xl"
    >
      <div className="space-y-6">
        {/* Búsqueda */}
        <div>
          <BuscarInput
            value={terminoBusqueda}
            onChange={setTerminoBusqueda}
            placeholder="Buscar variantes por código, producto, marca o color..."
          />
        </div>

        {/* Layout de dos columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Columna izquierda - Variantes disponibles */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <Search className="w-4 h-4" />
              Variantes Disponibles
              {isLoadingVariantes && <SpinnerCargando tamaño="sm" />}
            </h4>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {errorVariantes ? (
                <div className="text-center py-8 text-red-500">
                  <p>Error al cargar variantes</p>
                </div>
              ) : isLoadingVariantes ? (
                <div className="text-center py-8">
                  <SpinnerCargando texto="Cargando variantes..." />
                </div>
              ) : variantesDisponibles.length > 0 ? (
                variantesDisponibles.map((variante) => (
                  <motion.div
                    key={variante.id}
                    whileHover={{ scale: 1.01 }}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${variantesSeleccionadas.find(v => v.id === variante.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                      }`}
                    onClick={() => toggleVariante(variante)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Package className="w-4 h-4 text-gray-500" />
                          <span className="font-medium text-gray-900">{variante.codigo}</span>
                        </div>
                        <p className="text-sm text-gray-600">{variante.producto.nombre}</p>
                        <div className="flex gap-4 mt-1 text-xs text-gray-500">
                          <span>Talla: {variante.talla}</span>
                          <span>Color: {variante.color}</span>
                          <span>Marca: {variante.producto.marca}</span>
                        </div>
                        <div className="mt-1 text-xs text-gray-500">
                          Stock disponible: <span className="font-medium">{variante.stockActual}</span>
                        </div>
                      </div>

                      <div className={`w-4 h-4 rounded border ${variantesSeleccionadas.find(v => v.id === variante.id)
                        ? 'bg-blue-500 border-blue-500'
                        : 'border-gray-300'
                        }`} />
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No se encontraron variantes disponibles</p>
                </div>
              )}
            </div>
          </div>

          {/* Columna derecha - Variantes seleccionadas */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Variantes a Agregar ({variantesSeleccionadas.length})
            </h4>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {variantesSeleccionadas.map((variante) => (
                <motion.div
                  key={variante.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-3 rounded-lg border border-blue-200 bg-blue-50"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Package className="w-4 h-4 text-blue-600" />
                        <span className="font-medium text-gray-900">{variante.codigo}</span>
                      </div>
                      <p className="text-sm text-gray-600">{variante.producto.nombre}</p>
                      <div className="flex gap-4 mt-1 text-xs text-gray-500">
                        <span>Talla: {variante.talla}</span>
                        <span>Color: {variante.color}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleVariante(variante)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Selector de cantidad */}
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm text-gray-600">Cantidad:</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => actualizarCantidad(variante.id, (cantidades[variante.id] || 1) - 1)}
                        className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center text-sm hover:bg-gray-50"
                        disabled={(cantidades[variante.id] || 1) <= 1}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={cantidades[variante.id] || 1}
                        onChange={(e) => actualizarCantidad(variante.id, parseInt(e.target.value) || 1)}
                        min="1"
                        max={variante.stockActual}
                        className="w-12 text-center border border-gray-300 rounded py-1 text-sm"
                      />
                      <button
                        onClick={() => actualizarCantidad(variante.id, (cantidades[variante.id] || 1) + 1)}
                        className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center text-sm hover:bg-gray-50"
                        disabled={(cantidades[variante.id] || 1) >= variante.stockActual}
                      >
                        +
                      </button>
                    </div>
                    <span className="text-xs text-gray-500 ml-2">
                      Máx: {variante.stockActual}
                    </span>
                  </div>
                </motion.div>
              ))}

              {variantesSeleccionadas.length === 0 && (
                <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                  <Plus className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Selecciona variantes para agregar</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={cambiarEstado}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleAgregar}
            disabled={variantesSeleccionadas.length === 0 || isLoading}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <SpinnerCargando tamaño="sm" />
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Agregar {variantesSeleccionadas.length} Variante
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  )
}