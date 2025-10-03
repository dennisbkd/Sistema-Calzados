/* eslint-disable no-unused-vars */
import { motion } from "motion/react"
import { Edit, UserX, UserCheck, Mail, Phone, Calendar, Shield, Users, X as XIcon } from "lucide-react"
import { SpinnerCargando } from "../../../global/components/SpinnerCargando"
import { EstadoEtiqueta } from "../../../global/components/Etiqueta/EstadoEtiqueta"
import { ListaVacia } from "../../../global/components/ListaVacia"


export const TablaUsuarios = ({
  usuarios = [],
  onEditar,
  onToggleEstado,
  onEliminarRol,
  isLoading = false,
  isChangingState = false
}) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-8">
        <SpinnerCargando texto="Cargando usuarios..." />
      </div>
    )
  }

  if (usuarios.length === 0) {
    return (
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg">
        <ListaVacia icon={Users} titulo="No se encontraron usuarios" />
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
        <table className="w-full hidden sm:table">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="text-left p-4 font-semibold">Usuario</th>
              <th className="text-left p-4 font-semibold">Contacto</th>
              <th className="text-left p-4 font-semibold">Roles</th>
              <th className="text-left p-4 font-semibold">Registro</th>
              <th className="text-left p-4 font-semibold">Estado</th>
              <th className="text-left p-4 font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {usuarios.map((usuario) => (
              <FilaUsuarioDesktop
                key={usuario.id}
                usuario={usuario}
                onEditar={onEditar}
                onToggleEstado={onToggleEstado}
                onEliminarRol={onEliminarRol}
                isChangingState={isChangingState}
              />
            ))}
          </tbody>
        </table>

        <div className="sm:hidden space-y-4 p-4">
          {usuarios.map((usuario) => (
            <TarjetaUsuarioMobile
              key={usuario.id}
              usuario={usuario}
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

// Componente para fila de escritorio
const FilaUsuarioDesktop = ({ usuario, onEditar, onToggleEstado, onEliminarRol, isChangingState }) => (
  <motion.tr
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="hover:bg-blue-50 transition-colors"
  >
    <td className="p-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <Users className="text-blue-600" size={18} />
        </div>
        <div>
          <div className="font-semibold text-gray-800">{usuario.nombre}</div>
          <div className="text-sm text-gray-500">ID: {usuario.id}</div>
        </div>
      </div>
    </td>
    <td className="p-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-sm">
          <Mail size={14} className="text-gray-400" />
          {usuario.email}
        </div>
        {/* <div className="flex items-center gap-2 text-sm text-gray-500">
          <Phone size={14} className="text-gray-400" />
          {usuario.telefono}
        </div> */}
      </div>
    </td>
    <td className="p-4">
      <div className="flex flex-wrap gap-2 max-w-xs">
        {usuario.roles.map((rol, index) => (
          <div
            key={index}
            className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium group"
          >
            <Shield size={12} />
            {rol}
            {onEliminarRol && (
              <button
                onClick={() => { onEliminarRol(usuario.id, rol) }}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700"
                disabled={isChangingState}
              >
                <XIcon size={12} />
              </button>
            )}
          </div>
        ))}
      </div>
    </td>
    <td className="p-4">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Calendar size={14} />
        <span>{new Date(usuario.fechaRegistro).toLocaleDateString()}</span>
        <span>{usuario.hora}</span>
      </div>
    </td>
    <td className="p-4">
      <EstadoEtiqueta
        activo={usuario.activo}
        iconos={{ activo: UserCheck, inactivo: UserX }}
      />
    </td>
    <td className="p-4">
      <div className="flex gap-2">
        <button
          onClick={() => onEditar(usuario)}
          disabled={isChangingState}
          className="flex items-center gap-1 px-3 py-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Edit size={14} />
          Editar
        </button>
        <button
          onClick={() => onToggleEstado(usuario.id, !usuario.activo)}
          disabled={isChangingState}
          className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed ${usuario.activo
            ? 'text-red-600 hover:bg-red-100'
            : 'text-green-600 hover:bg-green-100'
            }`}
        >
          {usuario.activo ? <UserX size={14} /> : <UserCheck size={14} />}
          {usuario.activo ? 'Desactivar' : 'Activar'}
        </button>
      </div>
    </td>
  </motion.tr >
)

// Componente para tarjeta móvil
const TarjetaUsuarioMobile = ({ usuario, onEditar, onToggleEstado, isChangingState }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
  >
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <Users className="text-blue-600" size={18} />
        </div>
        <div>
          <div className="font-semibold text-gray-800">{usuario.nombre}</div>
          <div className="text-xs text-gray-500">ID: {usuario.id}</div>
        </div>
      </div>
      <EstadoEtiqueta
        activo={usuario.activo}
        textos={{ activo: 'Activo', inactivo: 'Inactivo' }}
        iconos={{ activo: UserCheck, inactivo: UserX }}
      />
    </div>

    <div className="space-y-2 text-sm mb-3">
      <div className="flex items-center gap-2">
        <Mail size={14} className="text-gray-400" />
        <span className="text-gray-600">{usuario.email}</span>
      </div>
      <div className="flex items-center gap-2">
        {/* <Phone size={14} className="text-gray-400" />
        <span className="text-gray-600">{usuario.telefono}</span> */}
      </div>
      <div className="flex items-center gap-2">
        <Calendar size={14} className="text-gray-400" />
        <span className="text-gray-600">
          <span>{new Date(usuario.fechaRegistro).toLocaleDateString()} - </span>
          <span>{usuario.hora}</span>
        </span>
      </div>
    </div>

    {/* Roles en móvil */}
    <div className="mb-3">
      <div className="flex flex-wrap gap-1">
        {usuario.roles.map((rol, index) => (
          <div
            key={index}
            className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium"
          >
            <Shield size={10} />
            {rol}
          </div>
        ))}
      </div>
    </div>

    <div className="flex gap-2 pt-3 border-t border-gray-100">
      <button
        onClick={() => onEditar(usuario)}
        disabled={isChangingState}
        className="flex-1 flex items-center justify-center gap-1 py-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Edit size={14} />
        Editar
      </button>
      <button
        onClick={() => onToggleEstado(usuario.id, !usuario.activo)}
        disabled={isChangingState}
        className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed ${usuario.activo
          ? 'text-red-600 hover:bg-red-100'
          : 'text-green-600 hover:bg-green-100'
          }`}
      >
        {usuario.activo ? <UserX size={14} /> : <UserCheck size={14} />}
        {usuario.activo ? 'Desactivar' : 'Activar'}
      </button>
    </div>
  </motion.div>
)