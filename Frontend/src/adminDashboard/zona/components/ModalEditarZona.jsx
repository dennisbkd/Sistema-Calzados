import { useState, useEffect } from 'react'
import {
  Building,
  Save,
  Palette,
  Layout,
  Square,
  RectangleHorizontal,
  RectangleVertical,
  Box,
  Package,
  MapPin
} from "lucide-react"

import { SpinnerCargando } from "../../../global/components/SpinnerCargando"
import { Modal } from '../../../global/components/modal/Modal'
import { useActualizarZonaCompleta } from '../hooks/useZonas'

// Iconos disponibles
const ICONOS_DISPONIBLES = [
  { value: 'warehouse', label: 'Almacén', icon: Building },
  { value: 'package', label: 'Paquete', icon: Package },
  { value: 'map-pin', label: 'Ubicación', icon: MapPin },
  { value: 'box', label: 'Caja', icon: Package },
]

export const ModalEditarZona = ({
  abierto,
  cambiarEstado,
  zona,
  onZonaActualizada
}) => {
  const [formData, setFormData] = useState({
    color: '#3B82F6',
    icono: 'warehouse',
    descripcion: '',
    layoutConfig: {
      size: 'normal',
      position: { row: 0, col: 0 },
      span: { rows: 1, cols: 1 }
    }
  })

  const { mutate: actualizarZona, isLoading } = useActualizarZonaCompleta()

  // Inicializar el formulario cuando la zona cambia
  useEffect(() => {
    if (zona) {
      setFormData({
        color: zona.color || '#3B82F6',
        icono: zona.icono || 'warehouse',
        descripcion: zona.descripcion || '',
        layoutConfig: zona.layoutConfig || {
          size: 'normal',
          position: { row: 0, col: 0 },
          span: { rows: 1, cols: 1 }
        }
      })
    }
  }, [zona])

  // Presets de colores
  const COLORES_DISPONIBLES = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
    '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
  ]

  // Presets de layout
  const LAYOUTS_DISPONIBLES = [
    {
      type: 'normal',
      label: 'Normal',
      icon: Square,
      size: { rows: 1, cols: 1 },
      className: 'w-8 h-8'
    },
    {
      type: 'wide',
      label: 'Ancho',
      icon: RectangleHorizontal,
      size: { rows: 1, cols: 2 },
      className: 'w-16 h-8'
    },
    {
      type: 'tall',
      label: 'Alto',
      icon: RectangleVertical,
      size: { rows: 2, cols: 1 },
      className: 'w-8 h-16'
    },
    {
      type: 'large',
      label: 'Grande',
      icon: Box,
      size: { rows: 2, cols: 2 },
      className: 'w-16 h-16'
    }
  ]

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleLayoutChange = (layoutType) => {
    const layout = LAYOUTS_DISPONIBLES.find(l => l.type === layoutType)
    if (layout) {
      setFormData(prev => ({
        ...prev,
        layoutConfig: {
          ...prev.layoutConfig,
          size: layoutType,
          span: layout.size
        }
      }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!zona) return

    actualizarZona({
      zonaId: zona.id,
      data: {
        color: formData.color,
        icono: formData.icono,
        descripcion: formData.descripcion,
        layout_config: formData.layoutConfig
      }
    }, {
      onSuccess: (zonaActualizada) => {
        if (onZonaActualizada) {
          onZonaActualizada(zonaActualizada)
        }
        cambiarEstado()
      }
    })
  }

  const getIconComponent = (iconName) => {
    const iconMap = {
      'warehouse': Building,
      'package': Package,
      'map-pin': MapPin,
      'box': Package,
    }
    return iconMap[iconName] || Building
  }

  const IconComponent = getIconComponent(formData.icono)
  const LayoutIcon = LAYOUTS_DISPONIBLES.find(l => l.type === formData.layoutConfig.size)?.icon || Square

  return (
    <Modal
      abierto={abierto}
      cambiarEstado={cambiarEstado}
      titulo="Personalizar Zona"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información de la zona (solo lectura) */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-2">Zona: {zona?.nombre}</h4>
          <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
            <Building className="w-4 h-4" />
            <span>{zona?.cantidadVariantes || 0} variantes</span>
          </div>
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descripción
          </label>
          <textarea
            value={formData.descripcion}
            onChange={(e) => handleChange('descripcion', e.target.value)}
            placeholder="Descripción de la zona..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Selector de Icono */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <Layout className="w-4 h-4" />
            Icono de la Zona
          </label>
          <div className="grid grid-cols-2 gap-3">
            {ICONOS_DISPONIBLES.map((icono) => {
              const IconoComponent = icono.icon
              const isSelected = formData.icono === icono.value

              return (
                <button
                  key={icono.value}
                  type="button"
                  onClick={() => handleChange('icono', icono.value)}
                  className={`p-3 border-2 rounded-lg transition-all flex items-center gap-3 ${isSelected
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <div
                    className={`p-2 rounded ${isSelected ? 'text-blue-600 bg-blue-100' : 'text-gray-400 bg-gray-100'
                      }`}
                  >
                    <IconoComponent className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-sm text-gray-900">
                      {icono.label}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Selector de Color */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Color de la Zona
          </label>
          <div className="grid grid-cols-5 gap-2">
            {COLORES_DISPONIBLES.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => handleChange('color', color)}
                className={`w-8 h-8 rounded-full border-2 transition-all ${formData.color === color ? 'border-gray-900 scale-110' : 'border-gray-300'
                  }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* Selector de Layout */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <Layout className="w-4 h-4" />
            Tamaño y Forma
          </label>
          <div className="grid grid-cols-2 gap-3">
            {LAYOUTS_DISPONIBLES.map((layout) => {
              const LayoutIcon = layout.icon
              const isSelected = formData.layoutConfig.size === layout.type

              return (
                <button
                  key={layout.type}
                  type="button"
                  onClick={() => handleLayoutChange(layout.type)}
                  className={`p-3 border-2 rounded-lg transition-all flex items-center gap-3 ${isSelected
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <div
                    className={`flex items-center justify-center rounded ${isSelected ? 'text-blue-600' : 'text-gray-400'
                      }`}
                  >
                    <LayoutIcon className={layout.className} />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-sm text-gray-900">
                      {layout.label}
                    </div>
                    <div className="text-xs text-gray-500">
                      {layout.size.cols}×{layout.size.rows}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Vista previa */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Vista Previa
          </label>
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-4">
            <div
              className="mx-auto w-32 h-32 rounded-lg border-2 flex flex-col items-center justify-center transition-all"
              style={{
                borderColor: formData.color,
                backgroundColor: `${formData.color}15`
              }}
            >
              <IconComponent
                className="w-8 h-8 mb-2"
                style={{ color: formData.color }}
              />
              <LayoutIcon
                className="w-6 h-6"
                style={{ color: formData.color }}
              />
            </div>
            <div className="text-center mt-2">
              <p className="text-sm font-medium text-gray-900">{zona?.nombre}</p>
              <p className="text-xs text-gray-500">
                {formData.layoutConfig.span.cols}×{formData.layoutConfig.span.rows}
              </p>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={cambiarEstado}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <SpinnerCargando tamaño="sm" />
            ) : (
              <>
                <Save className="w-4 h-4" />
                Guardar Cambios
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  )
}