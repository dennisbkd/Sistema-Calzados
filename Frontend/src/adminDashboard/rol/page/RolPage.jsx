"use client"

import { useState } from "react"
import { useRol } from "../hooks/useRol"
import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Checkbox } from "../../components/ui/checkbox"
import { Input } from "../../components/ui/input"

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
    // Sin confirmación - eliminar directamente
    eliminar.mutate(role.id)
  }

  const handleReactivate = (role) => {
    // Sin confirmación - reactivar directamente
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
      {/* Modal transparente sin fondo negro */}
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
                  <Input
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="Ej: Administrador"
                    disabled={!!editingRole}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                  <Input
                    value={descInput}
                    onChange={(e) => setDescInput(e.target.value)}
                    placeholder="Ej: Acceso total al sistema"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <Button 
                  onClick={handleCreateOrEdit}
                  className="bg-green-600 hover:bg-green-700 text-white flex-1"
                >
                  {editingRole ? "💾 Guardar Cambios" : "✅ Crear Rol"}
                </Button>
                <Button 
                  onClick={closeModal}
                  variant="outline"
                >
                  Cancelar
                </Button>
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
              <div className="relative w-64">
                <Input
                  placeholder={`Buscar rol ${viewInactive ? 'inactivo' : 'activo'}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
                <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
              </div>
              <Button 
                onClick={() => setViewInactive(!viewInactive)}
                variant="outline"
                size="sm"
              >
                {viewInactive ? "👁️ Ver Activos" : "👁️ Ver Inactivos"}
              </Button>
            </div>
            
            <Button 
              onClick={() => openModal()}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={viewInactive}
            >
              ➕ Nuevo Rol
            </Button>
          </div>

          {/* Tabla de Roles */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left p-4">
                        <Checkbox
                          checked={selectedRoles.length === filteredRoles.length && filteredRoles.length > 0}
                          onCheckedChange={handleSelectAll}
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
                          <Checkbox
                            checked={selectedRoles.includes(role.id)}
                            onCheckedChange={() => handleSelectSingle(role.id)}
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
                          <Badge 
                            variant={role.activo ? "default" : "destructive"}
                            className={role.activo ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                          >
                            {role.activo ? "Activo" : "Inactivo"}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            {viewInactive ? (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleReactivate(role)}
                                className="text-green-600 hover:text-green-700 border-green-200"
                              >
                                🔄 Reactivar
                              </Button>
                            ) : (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => openModal(role)}
                                  className="text-blue-600 hover:text-blue-700 border-blue-200"
                                >
                                  ✏️ Editar
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDelete(role)}
                                  className="text-red-600 hover:text-red-700 border-red-200"
                                >
                                  🗑️ Eliminar
                                </Button>
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
            </CardContent>
          </Card>

          {/* Acciones masivas para roles seleccionados */}
          {selectedRoles.length > 0 && (
            <Card className="mt-4">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {selectedRoles.length} rol(es) seleccionado(s)
                  </span>
                  <div className="flex gap-2">
                    {viewInactive ? (
                      <Button
                        size="sm"
                        variant="outline"
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
                        className="text-green-600 border-green-200"
                      >
                        🔄 Reactivar seleccionados
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
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
                        className="text-red-600 border-red-200"
                      >
                        🗑️ Desactivar seleccionados
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}