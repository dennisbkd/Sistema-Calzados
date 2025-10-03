/* eslint-disable no-unused-vars */
import { useState } from "react"
import { motion } from "motion/react"
import {
  Plus,
  Search,
  Edit,
  UserX,
  UserCheck,
  Mail,
  Phone,
  Calendar,
  Shield,
  Users,
  Menu,
  X,
  Check,
  X as XIcon
} from "lucide-react"

export const GestionUsuarios = () => {
  const [usuarios, setUsuarios] = useState([
    {
      id: 1,
      nombre: "María González",
      email: "maria@empresa.com",
      telefono: "+1 234 567 890",
      roles: ["Administrador", "Vendedor"], // Múltiples roles
      fechaRegistro: "2024-01-15",
      activo: true
    },
    {
      id: 2,
      nombre: "Carlos Rodríguez",
      email: "carlos@empresa.com",
      telefono: "+1 234 567 891",
      roles: ["Vendedor"],
      fechaRegistro: "2024-02-20",
      activo: true
    },
    {
      id: 3,
      nombre: "Ana Martínez",
      email: "ana@empresa.com",
      telefono: "+1 234 567 892",
      roles: ["Cliente", "Vendedor"],
      fechaRegistro: "2024-03-10",
      activo: false
    },
    {
      id: 4,
      nombre: "Pedro López",
      email: "pedro@empresa.com",
      telefono: "+1 234 567 893",
      roles: ["Administrador"],
      fechaRegistro: "2024-03-15",
      activo: true
    }
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [filtroRol, setFiltroRol] = useState("todos")
  const [filtroEstado, setFiltroEstado] = useState("todos")
  const [mostrarModal, setMostrarModal] = useState(false)
  const [usuarioEditando, setUsuarioEditando] = useState(null)
  const [menuFiltrosAbierto, setMenuFiltrosAbierto] = useState(false)
  const [rolesSeleccionados, setRolesSeleccionados] = useState([])

  // Todos los roles disponibles
  const rolesDisponibles = ["Administrador", "Vendedor", "Cliente", "Supervisor"]

  // Filtrar usuarios
  const usuariosFiltrados = usuarios.filter(usuario => {
    const coincideBusqueda = usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.email.toLowerCase().includes(searchTerm.toLowerCase())

    const coincideRol = filtroRol === "todos" || usuario.roles.includes(filtroRol)

    const coincideEstado = filtroEstado === "todos" ||
      (filtroEstado === "activos" && usuario.activo) ||
      (filtroEstado === "inactivos" && !usuario.activo)

    return coincideBusqueda && coincideRol && coincideEstado
  })

  const toggleEstadoUsuario = (id) => {
    setUsuarios(usuarios.map(usuario =>
      usuario.id === id ? { ...usuario, activo: !usuario.activo } : usuario
    ))
  }

  const abrirModalEditar = (usuario = null) => {
    setUsuarioEditando(usuario)
    if (usuario) {
      setRolesSeleccionados([...usuario.roles])
    } else {
      setRolesSeleccionados([])
    }
    setMostrarModal(true)
  }

  const cerrarModal = () => {
    setMostrarModal(false)
    setUsuarioEditando(null)
    setRolesSeleccionados([])
  }

  const toggleRol = (rol) => {
    setRolesSeleccionados(prev =>
      prev.includes(rol)
        ? prev.filter(r => r !== rol)
        : [...prev, rol]
    )
  }

  const guardarUsuario = () => {
    if (usuarioEditando) {
      // Editar usuario existente
      setUsuarios(usuarios.map(usuario =>
        usuario.id === usuarioEditando.id
          ? { ...usuario, roles: rolesSeleccionados }
          : usuario
      ))
    } else {
      // Crear nuevo usuario
      const nuevoUsuario = {
        id: Math.max(...usuarios.map(u => u.id)) + 1,
        nombre: document.getElementById('nombre').value,
        email: document.getElementById('email').value,
        telefono: document.getElementById('telefono').value,
        roles: rolesSeleccionados,
        fechaRegistro: new Date().toISOString().split('T')[0],
        activo: true
      }
      setUsuarios([...usuarios, nuevoUsuario])
    }
    cerrarModal()
  }

  const eliminarRol = (usuarioId, rol) => {
    setUsuarios(usuarios.map(usuario =>
      usuario.id === usuarioId
        ? { ...usuario, roles: usuario.roles.filter(r => r !== rol) }
        : usuario
    ))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
              <Users className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Gestión de Usuarios</h1>
              <p className="text-gray-600 text-sm sm:text-base">Usuarios pueden tener múltiples roles</p>
            </div>
          </div>
          <div className="w-20 h-1 bg-blue-600 rounded-full"></div>
        </motion.div>

        {/* Controles */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 mb-6"
        >
          <div className="flex flex-col gap-4">
            {/* Búsqueda */}
            <div className="w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar usuarios por nombre o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filtros y Botones */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Botón para mostrar/ocultar filtros en móvil */}
              <div className="sm:hidden">
                <button
                  onClick={() => setMenuFiltrosAbierto(!menuFiltrosAbierto)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700"
                >
                  {menuFiltrosAbierto ? <X size={18} /> : <Menu size={18} />}
                  Filtros
                </button>
              </div>

              {/* Contenedor de filtros */}
              <div className={`
                flex flex-col sm:flex-row gap-3 w-full
                ${menuFiltrosAbierto ? 'flex' : 'hidden sm:flex'}
              `}>
                <select
                  value={filtroRol}
                  onChange={(e) => setFiltroRol(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                >
                  <option value="todos">Todos los roles</option>
                  {rolesDisponibles.map(rol => (
                    <option key={rol} value={rol}>{rol}</option>
                  ))}
                </select>

                <select
                  value={filtroEstado}
                  onChange={(e) => setFiltroEstado(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                >
                  <option value="todos">Todos los estados</option>
                  <option value="activos">Solo activos</option>
                  <option value="inactivos">Solo inactivos</option>
                </select>
              </div>

              <button
                onClick={() => abrirModalEditar()}
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-300 hover:shadow-lg text-sm sm:text-base"
              >
                <Plus size={18} />
                <span className="whitespace-nowrap">Nuevo Usuario</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Tabla de Usuarios */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden"
        >
          {usuariosFiltrados.length === 0 ? (
            <div className="text-center py-12">
              <Users className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-500 text-lg">No se encontraron usuarios</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {/* Vista de tabla para desktop */}
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
                  {usuariosFiltrados.map((usuario) => (
                    <motion.tr
                      key={usuario.id}
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
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Phone size={14} className="text-gray-400" />
                            {usuario.telefono}
                          </div>
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
                              <button
                                onClick={() => eliminarRol(usuario.id, rol)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700"
                              >
                                <XIcon size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar size={14} />
                          {new Date(usuario.fechaRegistro).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${usuario.activo
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                          }`}>
                          {usuario.activo ? (
                            <>
                              <UserCheck size={14} />
                              Activo
                            </>
                          ) : (
                            <>
                              <UserX size={14} />
                              Inactivo
                            </>
                          )}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => abrirModalEditar(usuario)}
                            className="flex items-center gap-1 px-3 py-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors text-sm"
                          >
                            <Edit size={14} />
                            Editar
                          </button>
                          <button
                            onClick={() => toggleEstadoUsuario(usuario.id)}
                            className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors text-sm ${usuario.activo
                              ? 'text-red-600 hover:bg-red-100'
                              : 'text-green-600 hover:bg-green-100'
                              }`}
                          >
                            {usuario.activo ? <UserX size={14} /> : <UserCheck size={14} />}
                            {usuario.activo ? 'Desactivar' : 'Activar'}
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>

              {/* Vista de tarjetas para móvil */}
              <div className="sm:hidden space-y-4 p-4">
                {usuariosFiltrados.map((usuario) => (
                  <motion.div
                    key={usuario.id}
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
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${usuario.activo
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                        }`}>
                        {usuario.activo ? <UserCheck size={12} /> : <UserX size={12} />}
                        {usuario.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm mb-3">
                      <div className="flex items-center gap-2">
                        <Mail size={14} className="text-gray-400" />
                        <span className="text-gray-600">{usuario.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone size={14} className="text-gray-400" />
                        <span className="text-gray-600">{usuario.telefono}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-gray-400" />
                        <span className="text-gray-600">
                          {new Date(usuario.fechaRegistro).toLocaleDateString()}
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
                        onClick={() => abrirModalEditar(usuario)}
                        className="flex-1 flex items-center justify-center gap-1 py-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors text-sm"
                      >
                        <Edit size={14} />
                        Editar
                      </button>
                      <button
                        onClick={() => toggleEstadoUsuario(usuario.id)}
                        className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg transition-colors text-sm ${usuario.activo
                          ? 'text-red-600 hover:bg-red-100'
                          : 'text-green-600 hover:bg-green-100'
                          }`}
                      >
                        {usuario.activo ? <UserX size={14} /> : <UserCheck size={14} />}
                        {usuario.activo ? 'Desactivar' : 'Activar'}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Modal para crear/editar usuario */}
        {mostrarModal && (
          <div className="fixed inset-0  backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
            >
              <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
                  {usuarioEditando ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre completo
                    </label>
                    <input
                      id="nombre"
                      type="text"
                      defaultValue={usuarioEditando?.nombre || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      defaultValue={usuarioEditando?.email || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono
                    </label>
                    <input
                      id="telefono"
                      type="tel"
                      defaultValue={usuarioEditando?.telefono || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Roles (múltiples selección)
                    </label>
                    <div className="space-y-2">
                      {rolesDisponibles.map((rol) => (
                        <label key={rol} className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={rolesSeleccionados.includes(rol)}
                            onChange={() => toggleRol(rol)}
                            className="hidden"
                          />
                          <div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-all ${rolesSeleccionados.includes(rol)
                            ? 'bg-blue-600 border-blue-600'
                            : 'border-gray-300'
                            }`}>
                            {rolesSeleccionados.includes(rol) && (
                              <Check size={14} className="text-white" />
                            )}
                          </div>
                          <span className="text-sm text-gray-700">{rol}</span>
                        </label>
                      ))}
                    </div>
                    {rolesSeleccionados.length === 0 && (
                      <p className="text-red-500 text-xs mt-1">Selecciona al menos un rol</p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <button
                    onClick={cerrarModal}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={guardarUsuario}
                    disabled={rolesSeleccionados.length === 0}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                  >
                    {usuarioEditando ? 'Guardar Cambios' : 'Crear Usuario'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}