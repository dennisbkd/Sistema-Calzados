
"use client"

import { useState } from "react"
import { useRol } from "../hooks/useRol"
import { Eye, EyeOff, Pencil, Plus, RefreshCcw, Save, Search, Trash2 } from "lucide-react"

export const RolesPage = () => {
  const { listar, crear, editar, eliminar } = useRol()
  const roles = listar.data || []

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRoles, setSelectedRoles] = useState([])
  const [editingRole, setEditingRole] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [nameInput, setNameInput] = useState("")
  const [descInput, setDescInput] = useState("")
  const [viewInactive, setViewInactive] = useState(false)

  const filteredRoles = roles.filter((r) => {
    const matchesSearch = r.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesView = viewInactive ? !r.activo : r.activo
    return matchesSearch && matchesView
  })

  const openModal = (role = null) => {
    setEditingRole(role)
    if (role) {
      setNameInput(role.nombre)
      setDescInput(role.descripcion)
    } else {
      setNameInput("")
      setDescInput("")
    }
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingRole(null)
    setNameInput("")
    setDescInput("")
    setSelectedRoles([])
  }

  const handleCreateOrEdit = () => {
    if (editingRole) {
      editar.mutate({
        id: editingRole.id,
        descripcion: descInput,
        activo: editingRole.activo
      })
    } else {
      crear.mutate({
        nombre: nameInput,
        descripcion: descInput,
        activo: true
      })
    }
    closeModal()
  }

  const handleDelete = (role) => {
    eliminar.mutate(role.id)
  }

  const handleReactivate = (role) => {
    editar.mutate({
      id: role.id,
      descripcion: role.descripcion,
      activo: true
    })
  }

  const handleSelectAll = () => {
    setSelectedRoles(
      selectedRoles.length === filteredRoles.length
        ? []
        : filteredRoles.map((r) => r.id)
    )
  }

  const handleSelectSingle = (id) => {
    setSelectedRoles((prev) =>
      prev.includes(id) ? prev.filter((rid) => rid !== id) : [...prev, id]
    )
  }

  return (
    <div className="flex min-h-screen bg-white">
      {/* Modal para crear/editar rol */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 border border-gray-200">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                {editingRole ? "Editar Rol" : "Crear Nuevo Rol"}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {editingRole ? "Nombre (no editable)" : "Nombre del Rol"}
                  </label>
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="Ej: Administrador"
                    disabled={!!editingRole}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                  <input
                    type="text"
                    value={descInput}
                    onChange={(e) => setDescInput(e.target.value)}
                    placeholder="Ej: Acceso total al sistema"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <button
                  onClick={handleCreateOrEdit}
                  className="bg-green-600 flex justify-center hover:bg-green-700 text-white px-4 py-2 rounded-md flex-1"
                >
                  {editingRole ?
                    <div className="flex items-center gap-x-2"><Save size={20} /><span>Editar Rol</span></div> :
                    <div className="flex items-center gap-x-2"><Plus size={20} /><span>Crear Rol</span></div>}
                </button>
                <button
                  onClick={closeModal}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 p-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Gestión de Roles {viewInactive && "(Inactivos)"}
            </h1>
            <p className="text-gray-600">
              {viewInactive
                ? "Roles desactivados del sistema"
                : "Administra los roles y permisos del sistema"
              }
            </p>
            <div className="w-20 h-1 bg-blue-600 mt-2"></div>
          </div>

          {/* Controles superiores */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder={`Buscar rol ${viewInactive ? 'inactivo' : 'activo'}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="absolute left-3 top-2.5 text-gray-400"><Search size={20} /></span>
              </div>
              <button
                onClick={() => setViewInactive(!viewInactive)}
                className="px-3 py-2 border border-gray-300 rounded-md hover:cursor-pointer hover:bg-gray-100"
              >
                {viewInactive ?
                  <div className="flex items-center gap-x-2"><Eye size={20} /><span>Ver Activos</span></div> :
                  <div className="flex items-center gap-x-2"><EyeOff size={20} /><span>Ver Inactivos</span></div>}
              </button>
            </div>

            <button
              onClick={() => openModal()}
              disabled={viewInactive}
              className="bg-blue-600 flex items-center gap-x-2 hover:cursor-pointer hover:bg-blue-700 text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus size={20} /> <span>Nuevo Rol</span>
            </button>
          </div>

          {/* Tabla de Roles */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left p-4">
                      <input
                        type="checkbox"
                        checked={selectedRoles.length === filteredRoles.length && filteredRoles.length > 0}
                        onChange={handleSelectAll}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nombre del Rol
                    </th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Permisos/Descripción
                    </th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredRoles.map((role) => (
                    <tr key={role.id} className="hover:bg-gray-50">
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selectedRoles.includes(role.id)}
                          onChange={() => handleSelectSingle(role.id)}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="p-4 text-sm font-medium text-gray-900">{role.id}</td>
                      <td className="p-4">
                        <div className="text-sm font-semibold text-gray-900">{role.nombre}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-gray-600 max-w-xs">{role.descripcion}</div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${role.activo
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                          }`}>
                          {role.activo ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          {viewInactive ? (
                            <button
                              onClick={() => handleReactivate(role)}
                              className="group text-green-600 flex items-center gap-x-2 hover:cursor-pointer border-b-1 hover:text-green-700 px-2 py-1 "
                            >
                              <RefreshCcw className="group-hover:animate-spin" size={20} /> <span> Reactivar</span>
                            </button>
                          ) : (
                            <>
                              <button
                                onClick={() => openModal(role)}
                                className="text-blue-600 flex items-center gap-x-2 hover:cursor-pointer hover:bg-blue-50 hover:text-blue-700 px-2 py-1 border border-blue-200 rounded-md"
                              >
                                <Pencil size={20} /> <span>Editar</span>
                              </button>
                              <button
                                onClick={() => handleDelete(role)}
                                className="text-red-600 flex items-center gap-x-2 hover:cursor-pointer hover:text-red-700 px-2 py-1"
                              >
                                <Trash2 size={20} /> <span>Eliminar</span>
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredRoles.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-gray-500">
                        <div className="flex flex-col items-center">
                          <span className="text-4xl mb-2">
                            {viewInactive ? "📭" : "📋"}
                          </span>
                          {searchTerm
                            ? `No se encontraron roles ${viewInactive ? 'inactivos' : 'activos'} que coincidan con "${searchTerm}"`
                            : viewInactive
                              ? "No hay roles inactivos"
                              : "No hay roles activos"
                          }
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Acciones masivas para roles seleccionados */}
          {selectedRoles.length > 0 && (
            <div className="mt-4 bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {selectedRoles.length} rol(es) seleccionado(s)
                </span>
                <div className="flex gap-2">
                  {viewInactive ? (
                    <button
                      onClick={() => {
                        const rolesToReactivate = selectedRoles.map(id =>
                          roles.find(r => r.id === id)
                        ).filter(role => role && !role.activo)

                        if (rolesToReactivate.length > 0) {
                          rolesToReactivate.forEach(role => {
                            editar.mutate({
                              id: role.id,
                              descripcion: role.descripcion,
                              activo: true
                            })
                          })
                        }
                      }}
                      className="group text-green-600 flex items-center gap-x-2 hover:cursor-pointer border-b-1 hover:text-green-700 px-2 py-1 "
                    >
                      <RefreshCcw className="group-hover:animate-spin" size={20} /> <span>Reactivar Seleccionados</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        const rolesToDelete = selectedRoles.map(id =>
                          roles.find(r => r.id === id)
                        ).filter(role => role && role.activo)

                        if (rolesToDelete.length > 0) {
                          rolesToDelete.forEach(role => {
                            eliminar.mutate(role.id)
                          })
                        }
                      }}
                      className="text-red-600 flex items-center gap-x-2 hover:cursor-pointer hover:text-red-700 px-3 py-1 "
                    >
                      <Trash2 /> <span>Desactivar seleccionados</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}