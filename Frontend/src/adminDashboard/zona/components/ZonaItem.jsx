
import { motion } from "motion/react"
import { Package, MapPin, Edit3, Expand, Shrink, Layout, Container, Trash2 } from "lucide-react"
import { useActualizarLayoutZona } from '../hooks/useZonas'

const ZonaItem = ({
  zona,
  isSelected,
  onSelect,
  onEdit,
  isEditingLayout,
  onLayoutChange,
  onDelete
}) => {
  const { mutate: actualizarLayout, isPending: isUpdatingLayout } = useActualizarLayoutZona()

  const getIconComponent = (iconName) => {
    const iconMap = {
      'warehouse': Package,
      'package': Package,
      'map-pin': MapPin,
      'box': Package,
      'grid': Package,
      'layers': Layout,
      'shelves': Package,
      'container': Container,
      'pallet': Package,
      'building': Package
    }
    return iconMap[iconName] || Package
  }

  const IconComponent = getIconComponent(zona.icono || zonaIcono)

  const handleResize = (direction) => {
    if (!isEditingLayout) return

    const currentLayout = zona.layoutConfig || { span: { rows: 1, cols: 1 } }
    const newLayout = {
      ...currentLayout,
      span: { ...currentLayout.span }
    }

    switch (direction) {
      case 'expand-right':
        newLayout.span.cols = Math.min(currentLayout.span.cols + 1, 3)
        break
      case 'shrink-right':
        newLayout.span.cols = Math.max(currentLayout.span.cols - 1, 1)
        break
      case 'expand-down':
        newLayout.span.rows = Math.min(currentLayout.span.rows + 1, 3)
        break
      case 'shrink-down':
        newLayout.span.rows = Math.max(currentLayout.span.rows - 1, 1)
        break
      default:
        return
    }

    // Llamar a la mutation para actualizar en la base de datos
    actualizarLayout({
      zonaId: zona.id,
      layoutConfig: newLayout
    })

    // También llamar al callback del padre si existe
    if (onLayoutChange) {
      onLayoutChange(zona.id, newLayout)
    }
  }

  const getGridClass = (layout) => {
    const layoutConfig = layout || { span: { rows: 1, cols: 1 } }
    const { rows, cols } = layoutConfig.span

    const rowClasses = {
      1: 'row-span-1',
      2: 'row-span-2',
      3: 'row-span-3'
    }

    const colClasses = {
      1: 'col-span-1',
      2: 'col-span-2',
      3: 'col-span-3'
    }

    return `${colClasses[cols] || 'col-span-1'} ${rowClasses[rows] || 'row-span-1'}`
  }

  const getSizeLabel = (layout) => {
    const layoutConfig = layout || { span: { rows: 1, cols: 1 } }
    const { rows, cols } = layoutConfig.span
    if (rows === 1 && cols === 1) return 'Normal'
    if (rows === 1 && cols === 2) return 'Ancho'
    if (rows === 2 && cols === 1) return 'Alto'
    if (rows === 2 && cols === 2) return 'Grande'
    return `${cols}×${rows}`
  }
  const getHeightClass = (layout) => {
    const layoutConfig = layout || { span: { rows: 1, cols: 1 } }
    const { rows } = layoutConfig.span

    const heightClasses = {
      1: 'min-h-[120px]',    // Normal
      2: 'min-h-[250px]',    // Alto
      3: 'min-h-[380px]'     // Muy alto
    }

    return heightClasses[rows] || 'min-h-[120px]'
  }

  const zonaColor = zona.color || '#3B82F6'
  const zonaIcono = zona.icono || 'warehouse'
  const layoutConfig = zona.layoutConfig || { span: { rows: 1, cols: 1 } }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative group rounded-xl border-2 transition-all cursor-pointer
        ${isSelected
          ? 'ring-2 ring-offset-2'
          : 'hover:shadow-lg hover:border-gray-300'
        }
        ${getGridClass(layoutConfig)}
        ${getHeightClass(layoutConfig)}
      `}
      style={{
        borderColor: isSelected ? zonaColor : '#e5e7eb',
        backgroundColor: isSelected ? `${zonaColor}15` : 'white',
        ringColor: zonaColor
      }}
      onClick={() => !isEditingLayout && onSelect(zona.id)}
    >
      {/* Loading overlay */}
      {isUpdatingLayout && (
        <div className="absolute inset-0 bg-white bg-opacity-50 rounded-xl flex items-center justify-center z-10">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Contenido de la zona */}
      <div className="p-4 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div
              className="p-2 rounded-lg"
              style={{ backgroundColor: `${zonaColor}20` }}
            >
              <IconComponent
                className="w-4 h-4"
                style={{ color: zonaColor }}
              />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">
                {zona.nombre}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className="text-xs px-2 py-1 rounded-full font-medium"
                  style={{
                    backgroundColor: `${zonaColor}20`,
                    color: zonaColor
                  }}
                >
                  {getSizeLabel(layoutConfig)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-1">
            {/* ✅ Botón eliminar zona */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete(zona)
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 rounded text-red-500"
              title="Eliminar zona"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            {isEditingLayout && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit(zona)
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded"
                disabled={isUpdatingLayout}
              >
                <Edit3 className="w-4 h-4 text-gray-500" />
              </button>
            )}
          </div>
        </div>

        {/* Descripción */}
        {zona.descripcion && (
          <p className="text-xs text-gray-600 mb-3 line-clamp-2">
            {zona.descripcion}
          </p>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Package className="w-3 h-3" />
            <span>{zona.cantidadVariantes || 0} variantes</span>
          </div>

          {isEditingLayout && (
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleResize('expand-right')
                }}
                className={`p-1 rounded text-xs transition-colors ${layoutConfig.span.cols >= 3
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                title="Expandir ancho"
                disabled={layoutConfig.span.cols >= 3 || isUpdatingLayout}
              >
                <Expand className="w-3 h-3" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleResize('shrink-right')
                }}
                className={`p-1 rounded text-xs transition-colors ${layoutConfig.span.cols <= 1
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                title="Reducir ancho"
                disabled={layoutConfig.span.cols <= 1 || isUpdatingLayout}
              >
                <Shrink className="w-3 h-3" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleResize('expand-down')
                }}
                className={`p-1 rounded text-xs transition-colors ${layoutConfig.span.rows >= 3
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                title="Expandir alto"
                disabled={layoutConfig.span.rows >= 3 || isUpdatingLayout}
              >
                <Expand className="w-3 h-3 transform rotate-90" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleResize('shrink-down')
                }}
                className={`p-1 rounded text-xs transition-colors ${layoutConfig.span.rows <= 1
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                title="Reducir alto"
                disabled={layoutConfig.span.rows <= 1 || isUpdatingLayout}
              >
                <Shrink className="w-3 h-3 transform rotate-90" />
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export const GridZonasPersonalizable = ({
  zonas,
  zonaSeleccionada,
  onSeleccionarZona,
  onEditarZona,
  onEliminarZona,
  modoEdicion = false
}) => {
  const calculateGridTemplate = (zonas) => {
    // Ordenar zonas por posición
    const zonasOrdenadas = [...zonas].sort((a, b) => {
      const posA = a.layoutConfig?.position || { row: 0, col: 0 }
      const posB = b.layoutConfig?.position || { row: 0, col: 0 }
      if (posA.row === posB.row) return posA.col - posB.col
      return posA.row - posB.row
    })

    // Encontrar el número máximo de filas necesarias
    const maxRow = Math.max(...zonasOrdenadas.map(z => {
      const pos = z.layoutConfig?.position || { row: 0 }
      const span = z.layoutConfig?.span || { rows: 1 }
      return pos.row + span.rows
    }), 1)

    // Crear template rows con tamaño fijo
    return Array.from({ length: maxRow }, () => '1fr').join(' ')
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      style={{
        gridTemplateRows: calculateGridTemplate(zonas)
      }}>
      {zonas.map((zona) => (
        <ZonaItem
          key={zona.id}
          zona={zona}
          isSelected={zonaSeleccionada === zona.id}
          onSelect={onSeleccionarZona}
          onEdit={onEditarZona}
          onDelete={onEliminarZona}
          isEditingLayout={modoEdicion}
        />
      ))}
    </div>
  )
}