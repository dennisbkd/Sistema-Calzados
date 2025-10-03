/* eslint-disable no-unused-vars */
import { motion } from "motion/react"
import { Edit, Building, User, MapPin, Phone, Hash } from "lucide-react"
import { EstadoEtiqueta } from "../../../global/components/Etiqueta/EstadoEtiqueta"
import { ListaVacia } from "../../../global/components/ListaVacia"
import { SpinnerCargando } from "../../../global/components/SpinnerCargando"


export const TablaProveedores = ({
  proveedores,
  onEditar,
  onToggleEstado,
  isLoading = false,
  isChangingState = false
}) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-8">
        <SpinnerCargando texto="Cargando proveedores..." />
      </div>
    )
  }

  if (proveedores.length === 0) {
    return (
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg">
        <ListaVacia icon={Building} titulo="No se encontraron proveedores" />
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
              <th className="text-left p-4 font-semibold">Proveedor</th>
              <th className="text-left p-4 font-semibold">Contacto</th>
              <th className="text-left p-4 font-semibold">Teléfono</th>
              <th className="text-left p-4 font-semibold">Dirección</th>
              <th className="text-left p-4 font-semibold">Estado</th>
              <th className="text-left p-4 font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {proveedores.map((proveedor) => (
              <FilaProveedorDesktop
                key={proveedor.id}
                proveedor={proveedor}
                onEditar={onEditar}
                onToggleEstado={onToggleEstado}
                isChangingState={isChangingState}
              />
            ))}
          </tbody>
        </table>

        {/* Vista de tarjetas para móvil */}
        <div className="sm:hidden space-y-4 p-4">
          {proveedores.map((proveedor) => (
            <TarjetaProveedorMobile
              key={proveedor.id}
              proveedor={proveedor}
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
const FilaProveedorDesktop = ({ proveedor, onEditar, onToggleEstado, isChangingState }) => (
  <motion.tr
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="hover:bg-blue-50 transition-colors"
  >
    <td className="p-4">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
        <Hash size={14} className="text-gray-400" />
        {proveedor.id}
      </div>
    </td>
    <td className="p-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <Building className="text-blue-600" size={18} />
        </div>
        <div>
          <div className="font-semibold text-gray-800">{proveedor.nombre}</div>
        </div>
      </div>
    </td>
    <td className="p-4">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <User size={14} className="text-gray-400" />
        {proveedor.contacto}
      </div>
    </td>
    <td className="p-4">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Phone size={14} className="text-gray-400" />
        {proveedor.telefono}
      </div>
    </td>
    <td className="p-4">
      <div className="text-sm text-gray-600 max-w-xs">
        {proveedor.direccion}
      </div>
    </td>
    <td className="p-4">
      <EstadoEtiqueta activo={proveedor.activo} />
    </td>
    <td className="p-4">
      <div className="flex gap-2">
        <button
          onClick={() => onEditar(proveedor)}
          className="flex items-center gap-1 px-3 py-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors text-sm"
        >
          <Edit size={14} />
          Editar
        </button>
        <button
          onClick={() => onToggleEstado(proveedor.id)}
          disabled={isChangingState}
          className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors text-sm ${proveedor.activo
            ? 'text-red-600 hover:bg-red-100'
            : 'text-green-600 hover:bg-green-100'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {proveedor.activo ? 'Desactivar' : 'Activar'}
        </button>
      </div>
    </td>
  </motion.tr>
)

// Componente para tarjeta móvil
const TarjetaProveedorMobile = ({ proveedor, onEditar, onToggleEstado, isChangingState }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
  >
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <Building className="text-blue-600" size={18} />
        </div>
        <div>
          <div className="font-semibold text-gray-800">{proveedor.nombre}</div>
          <div className="text-xs text-gray-500">ID: {proveedor.id}</div>
        </div>
      </div>
      <EstadoEtiqueta activo={proveedor.activo} />
    </div>

    <div className="space-y-2 text-sm mb-3">
      <div className="flex items-center gap-2">
        <User size={14} className="text-gray-400" />
        <span className="text-gray-600">{proveedor.contacto}</span>
      </div>
      <div className="flex items-center gap-2">
        <Phone size={14} className="text-gray-400" />
        <span className="text-gray-600">{proveedor.telefono}</span>
      </div>
      <div className="flex items-center gap-2">
        <MapPin size={14} className="text-gray-400" />
        <span className="text-gray-600">{proveedor.direccion}</span>
      </div>
    </div>

    <div className="flex gap-2 pt-3 border-t border-gray-100">
      <button
        onClick={() => onEditar(proveedor)}
        className="flex-1 flex items-center justify-center gap-1 py-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors text-sm"
      >
        <Edit size={14} />
        Editar
      </button>
      <button
        onClick={() => onToggleEstado(proveedor.id)}
        disabled={isChangingState}
        className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg transition-colors text-sm ${proveedor.activo
          ? 'text-red-600 hover:bg-red-100'
          : 'text-green-600 hover:bg-green-100'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {proveedor.activo ? 'Desactivar' : 'Activar'}
      </button>
    </div>
  </motion.div>
)