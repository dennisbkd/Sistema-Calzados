import { motion } from "motion/react"
import { Edit, Tag, Calendar, FileText, Hash } from "lucide-react"
import { SpinnerCargando } from "../../../global/components/SpinnerCargando"
import { ListaVacia } from "../../../global/components/ListaVacia"
import { EstadoEtiqueta } from "../../../global/components/Etiqueta/EstadoEtiqueta"

export const TablaCategorias = ({
  categorias = [],
  onEditar,
  onToggleEstado,
  isLoading = false,
  isChangingState = false
}) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-8">
        <SpinnerCargando texto="Cargando categorías..." />
      </div>
    )
  }

  if (categorias.length === 0) {
    return (
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg">
        <ListaVacia icon={Tag} titulo="No se encontraron categorías" />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden"
    >
      <div className="overflow-x-auto">
        {/* Vista de tabla para desktop */}
        <table className="w-full hidden sm:table">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="text-left p-4 font-semibold">ID</th>
              <th className="text-left p-4 font-semibold">Categoría</th>
              <th className="text-left p-4 font-semibold">Descripción</th>
              <th className="text-left p-4 font-semibold">Género</th>
              <th className="text-left p-4 font-semibold">Registro</th>
              <th className="text-left p-4 font-semibold">Estado</th>
              <th className="text-left p-4 font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {categorias.map((categoria) => (
              <FilaCategoriaDesktop
                key={categoria.id}
                categoria={categoria}
                onEditar={onEditar}
                onToggleEstado={onToggleEstado}
                isChangingState={isChangingState}
              />
            ))}
          </tbody>
        </table>

        {/* Vista de tarjetas para móvil */}
        <div className="sm:hidden space-y-4 p-4">
          {categorias.map((categoria) => (
            <TarjetaCategoriaMobile
              key={categoria.id}
              categoria={categoria}
              onEditar={onEditar}
              onToggleEstado={onToggleEstado}
              isChangingState={isChangingState}
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}

// Componente para fila desktop
const FilaCategoriaDesktop = ({ categoria, onEditar, onToggleEstado, isChangingState }) => (
  <motion.tr
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="hover:bg-blue-50 transition-colors"
  >
    <td className="p-4">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
        <Hash size={14} className="text-gray-400" />
        {categoria.id}
      </div>
    </td>
    <td className="p-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <Tag className="text-blue-600" size={18} />
        </div>
        <div>
          <div className="font-semibold text-gray-800">{categoria.nombre}</div>
        </div>
      </div>
    </td>
    <td className="p-4">
      <div className="text-sm text-gray-600 max-w-xs">
        {categoria.descripcion || (
          <span className="text-gray-400 italic">Sin descripción</span>
        )}
      </div>
    </td>
    <td className="p-4">
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
        {categoria.genero}
      </span>
    </td>
    <td className="p-4">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Calendar size={14} />
        <div className="flex flex-col">
          <span>{categoria.fechaRegistro}</span>
          <span className="text-xs text-gray-400">{categoria.hora}</span>
        </div>
      </div>
    </td>
    <td className="p-4">
      <EstadoEtiqueta activo={categoria.activo} />
    </td>
    <td className="p-4">
      <div className="flex gap-2">
        <button
          onClick={() => onEditar(categoria)}
          className="flex items-center gap-1 px-3 py-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors text-sm"
        >
          <Edit size={14} />
          Editar
        </button>
        <button
          onClick={() => onToggleEstado(categoria.id)}
          disabled={isChangingState}
          className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors text-sm ${categoria.activo
            ? 'text-red-600 hover:bg-red-100'
            : 'text-green-600 hover:bg-green-100'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {categoria.activo ? 'Desactivar' : 'Activar'}
        </button>
      </div>
    </td>
  </motion.tr>
)

// Componente para tarjeta móvil
const TarjetaCategoriaMobile = ({ categoria, onEditar, onToggleEstado, isChangingState }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
  >
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <Tag className="text-blue-600" size={18} />
        </div>
        <div>
          <div className="font-semibold text-gray-800">{categoria.nombre}</div>
          <div className="text-xs text-gray-500">ID: {categoria.id}</div>
        </div>
      </div>
      <EstadoEtiqueta activo={categoria.activo} />
    </div>

    <div className="space-y-2 text-sm mb-3">
      <div className="flex items-center gap-2">
        <FileText size={14} className="text-gray-400" />
        <span className="text-gray-600">
          {categoria.descripcion || 'Sin descripción'}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-gray-500">Género:</span>
        <span className="font-medium text-purple-600">{categoria.genero}</span>
      </div>
      <div className="flex items-center gap-2 text-gray-500">
        <Calendar size={14} />
        <span>{categoria.fechaRegistro} - {categoria.hora}</span>
      </div>
    </div>

    <div className="flex gap-2 pt-3 border-t border-gray-100">
      <button
        onClick={() => onEditar(categoria)}
        className="flex-1 flex items-center justify-center gap-1 py-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors text-sm"
      >
        <Edit size={14} />
        Editar
      </button>
      <button
        onClick={() => onToggleEstado(categoria.id)}
        disabled={isChangingState}
        className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg transition-colors text-sm ${categoria.activo
          ? 'text-red-600 hover:bg-red-100'
          : 'text-green-600 hover:bg-green-100'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {categoria.activo ? 'Desactivar' : 'Activar'}
      </button>
    </div>
  </motion.div>
)