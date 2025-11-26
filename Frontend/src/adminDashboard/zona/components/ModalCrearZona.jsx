import { useState } from 'react'
import { Building } from "lucide-react"

import { SpinnerCargando } from "../../../global/components/SpinnerCargando"
import toast from 'react-hot-toast'
import { Modal } from '../../../global/components/modal/Modal'
import { useCrearZona } from '../hooks/useZonas'
import { maxLengthChar } from '../../../utils/maxLengthj'

export const ModalCrearZona = ({
  abierto,
  cambiarEstado,
  onZonaCreada
}) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: ''
  })

  const { mutate: crearZona, isLoading } = useCrearZona()

  // Limpiar formulario cuando se cierra el modal
  const handleCerrar = () => {
    setFormData({
      nombre: '',
      descripcion: ''
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

    if (!formData.nombre.trim()) {
      toast.error('El nombre de la zona es requerido')
      return
    }

    crearZona(formData, {
      onSuccess: (data) => {
        if (onZonaCreada) {
          onZonaCreada(data)
        }
        handleCerrar()
      }
    })
  }

  return (
    <Modal
      abierto={abierto}
      cambiarEstado={handleCerrar}
      titulo="Crear Nueva Zona"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nombre de la Zona */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre de la Zona *
          </label>
          <input
            type="text"
            value={formData.nombre}
            onChange={(e) => { handleChange('nombre', e.target.value); maxLengthChar(e.target.value, 100) }}
            placeholder="Ej: Zona A, Pasillo Principal, etc."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descripción
          </label>
          <textarea
            value={formData.descripcion}
            onChange={(e) => { handleChange('descripcion', e.target.value); maxLengthChar(e.target.value, 100) }}
            placeholder="Descripción de la zona..."
            rows={3}
            maxLength={100}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
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
            disabled={isLoading || !formData.nombre.trim()}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <SpinnerCargando tamaño="sm" />
            ) : (
              <>
                <Building className="w-4 h-4" />
                Crear Zona
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  )
}