import { useState } from 'react'
import { Plus } from "lucide-react"

import { SpinnerCargando } from "../../../global/components/SpinnerCargando"
import toast from 'react-hot-toast'
import { Modal } from '../../../global/components/modal/Modal'
import { useCrearUbicacion } from '../hooks/useZonas'
import { maxLengthChar } from '../../../utils/maxLengthj'

export const ModalCrearUbicacion = ({
  abierto,
  cambiarEstado,
  zonas,
  onUbicacionCreada
}) => {
  const [formData, setFormData] = useState({
    zonaBodegaId: '',
    codigo: '',
    descripcion: '',
    capacidadMaxima: ''
  })

  const { mutate: crearUbicacion, isLoading } = useCrearUbicacion()

  // Limpiar formulario cuando se cierra el modal
  const handleCerrar = () => {
    setFormData({
      zonaBodegaId: '',
      codigo: '',
      descripcion: '',
      capacidadMaxima: ''
    })
    cambiarEstado()
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validaciones
    if (!formData.zonaBodegaId) {
      toast.error('Selecciona una zona')
      return
    }

    if (!formData.codigo.trim()) {
      toast.error('El código es requerido')
      return
    }

    const datosEnvio = {
      ...formData,
      zonaBodegaId: parseInt(formData.zonaBodegaId),
      capacidadMaxima: formData.capacidadMaxima ? parseInt(formData.capacidadMaxima) : null
    }

    crearUbicacion(datosEnvio, {
      onSuccess: (data) => {
        if (onUbicacionCreada) {
          onUbicacionCreada(data)
        }
        handleCerrar()
      }
    })
  }

  return (
    <Modal
      abierto={abierto}
      cambiarEstado={handleCerrar}
      titulo="Crear Nueva Ubicación"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Selector de Zona */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Zona de Bodega *
          </label>
          <select
            value={formData.zonaBodegaId}
            onChange={(e) => handleChange('zonaBodegaId', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Selecciona una zona</option>
            {zonas.map((zona) => (
              <option key={zona.id} value={zona.id}>
                {zona.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Código de Ubicación */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Código de Ubicación *
          </label>
          <input
            type="text"
            value={formData.codigo}
            onChange={(e) => { handleChange('codigo', maxLengthChar(e.target.value.toUpperCase(), 50)) }}
            maxLength={50}
            placeholder="Ej: A-01, B-02, etc."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Código único para identificar la ubicación dentro de la zona
          </p>
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descripción
          </label>
          <textarea
            value={formData.descripcion}
            onChange={(e) => handleChange('descripcion', e.target.value)}
            placeholder="Descripción opcional de la ubicación..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Capacidad Máxima */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Capacidad Máxima (Opcional)
          </label>
          <input
            type="number"
            value={formData.capacidadMaxima}
            onChange={(e) => handleChange('capacidadMaxima', e.target.value)}
            placeholder="Ej: 100, 500, 1000"
            min="1"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Número máximo de items que puede almacenar esta ubicación
          </p>
        </div>

        {/* Acciones */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={handleCerrar}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading || !formData.zonaBodegaId || !formData.codigo.trim()}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <SpinnerCargando tamaño="sm" />
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Crear Ubicación
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  )
}