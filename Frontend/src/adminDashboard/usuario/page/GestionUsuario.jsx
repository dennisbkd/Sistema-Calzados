/* eslint-disable no-unused-vars */

import { motion } from "motion/react"
import { User, Mail, Shield, Lock } from "lucide-react"

import { useFiltros } from "../../../global/hooks/useFiltros"

import { PageCabecera } from "../../../global/components/cabecera/PageCabecera"
import { BuscarInput } from "../../../global/components/filtros/BuscarInput"
import { FiltrarFIlas } from "../../../global/components/filtros/FiltrarFIlas"
import { SeleccionarFiltros } from "../../../global/components/filtros/SeleccionarFiltros"
import { BotonAccion } from "../../../global/components/Boton/BotonAccion"
import { SpinnerCargando } from "../../../global/components/SpinnerCargando"
import { ErrorMessage } from "../../../global/components/ErrorMessage"

import { FormModal } from "../../../global/components/formulario/FormModal"
import { FormCheckboxGroup } from "../../../global/components/formulario/FormCheckboxGroup"
import { FormInput } from "../../../global/components/formulario/FormInput"

import { TablaUsuarios } from "../components/TablaUsuarios"
import { useUsuariosManager } from "../hooks/useUsuariosManager"
import { useUsuarioForm } from "../hooks/useUsuarioForm"
import { useRol } from "../../rol/hooks/useRol"

export const GestionUsuario = () => {

  const {
    usuarios,
    isLoading,
    error,
    toggleEstadoUsuario,
    eliminarRol,
    isCambiandoEstado
  } = useUsuariosManager()

  const {
    filtros,
    menuFiltrosAbierto,
    actualizarFiltro,
    toggleMenuFiltros
  } = useFiltros({
    filtroRol: 'todos'
  })

  const { listar } = useRol()
  const rol = listar.data || []

  const usuarioFiltrados = usuarios.filter(usuario => {
    const coincideBusqueda = usuario.nombre
      .toLowerCase()
      .includes(filtros.searchTerm.toLocaleLowerCase()) ||
      usuario.email.toLowerCase()
        .includes(filtros.searchTerm.toLocaleLowerCase())

    const coincideRol = filtros.filtroRol === "todos" ||
      usuario.roles.includes(filtros.filtroRol.toLocaleLowerCase())

    const conincideEstado = filtros.filtroEstado === 'todos' ||
      (filtros.filtroEstado === 'activos' && usuario.activo) ||
      (filtros.filtroEstado === 'inactivos' && !usuario.activo)

    return coincideBusqueda && conincideEstado && coincideRol
  })

  const {
    modal,
    guardarUsuario,
    formConfig,
    isLoading: isSaving
  } = useUsuarioForm()


  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <PageCabecera
            titulo="Gestión de Usuarios"
            subtitulo="Usuarios pueden tener múltiples roles"
            icono={User}
          />
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-8">
            <SpinnerCargando
              tamaño="lg"
              texto="Cargando usuarios..."
            />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <PageCabecera
            titulo="Gestión de Usuarios"
            subtitulo="Usuarios pueden tener múltiples roles"
            icono={User}
          />
          <ErrorMessage
            titulo="Error al cargar usuarios"
            mensaje="No se pudieron cargar los usuarios. Por favor, intenta nuevamente."
            onRetry={() => window.location.reload()}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header de la página */}
        <PageCabecera
          titulo="Gestión de Usuarios"
          subtitulo="Usuarios pueden tener múltiples roles"
          icono={User}
        />

        {/* Panel de controles */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 mb-6"
        >
          <div className="flex flex-col gap-4">
            {/* BUSQUEDA */}

            <BuscarInput value={filtros.searchTerm}
              onChange={(value) => actualizarFiltro('searchTerm', value)}
              placeholder="Buscar usuarios por nombre o email..." />
            {/* FILTROS */}
            <FiltrarFIlas
              menuFiltrosAbierto={menuFiltrosAbierto}
              onToggleMenu={toggleMenuFiltros}
            >
              <SeleccionarFiltros
                value={filtros.filtroRol}
                onChange={(e) => actualizarFiltro('filtroRol', e.target.value)}
                options={rol
                  .filter(rol => rol.activo) // ✅ Filtrar solo roles activos
                  .map(rol => ({
                    value: rol.nombre,
                    label: rol.nombre
                  }))
                }
                placeholder="Todos los roles"
              />
              <SeleccionarFiltros
                value={filtros.filtroEstado}
                onChange={(e) => actualizarFiltro('filtroEstado', e.target.value)}
                options={[
                  { value: 'todos', label: 'Todos los estados' },
                  { value: 'activos', label: 'Solo activos' },
                  { value: 'inactivos', label: 'Solo inactivos' }
                ]}
                placeholder="Todos los estados"
              />

            </FiltrarFIlas>

            <div className="flex justify-end">
              <BotonAccion
                onClick={() => modal.abrir()}
                icon={User}
                label="Nuevo Usuario"
                variant="primary" />
            </div>

          </div>
        </motion.div>
        {/* TABLA */}
        <TablaUsuarios
          usuarios={usuarioFiltrados}
          onEditar={modal.abrir}
          onToggleEstado={toggleEstadoUsuario}
          onEliminarRol={eliminarRol}
          isLoading={isLoading}
          isChangingState={isCambiandoEstado}
        />

        <FormModal
          isOpen={modal.isOpen}
          onClose={modal.cerrar}
          title={modal.data ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
          formConfig={{
            defaultValues: formConfig.defaultValues // Solo pasamos defaultValues
          }}
          onSubmit={guardarUsuario}
          isLoading={isSaving}
          acciones={(form, isLoading, onClose) => [
            <button
              key="cancelar"
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
            >
              Cancelar
            </button>,
            <button
              key="guardar"
              type="submit"
              disabled={!form.state.canSubmit || isLoading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {isLoading ? 'Guardando...' : (modal.data ? 'Guardar Cambios' : 'Crear Usuario')}
            </button>
          ]}
        >
          {(form) => (
            <>
              <form.Field
                name="nombre"
                validators={{
                  onChange: ({ value }) => {
                    if (!value || value.length < 2) return 'El nombre debe tener al menos 2 caracteres'
                  }
                }}
                children={(field) => (
                  <FormInput
                    field={field}
                    label="Nombre Completo"
                    placeholder="Ej: Maria Gonzales"
                    icon={User}
                  />
                )}
              />

              <form.Field
                name="email"
                validators={{
                  onChange: ({ value }) => {
                    if (!value) return 'El email es requerido'
                    if (!/\S+@\S+\.\S+/.test(value)) return 'Email inválido'
                  }
                }}
                children={(field) => (
                  <FormInput
                    field={field}
                    label="Email"
                    type="email"
                    placeholder="Ej: usuario@empresa.com"
                    icon={Mail}
                  />
                )}
              />

              {/* Campo Password con validación condicional */}
              <form.Field
                name="password"
                validators={{
                  onChange: ({ value }) => {
                    // Solo validar si es nuevo usuario o si se está cambiando la contraseña
                    if (!modal.data && (!value || value.length < 6)) {
                      return 'La contraseña debe tener al menos 6 caracteres'
                    }
                    if (modal.data && value && value.length < 6) {
                      return 'La contraseña debe tener al menos 6 caracteres'
                    }
                  }
                }}
                children={(field) => (
                  <FormInput
                    field={field}
                    label="Contraseña"
                    type="password"
                    placeholder={modal.data ? "Dejar vacío para mantener la actual" : "Mínimo 6 caracteres"}
                    icon={Lock}
                  />
                )}
              />

              <form.Field
                name="roles"
                children={(field) => {
                  return (
                    <FormCheckboxGroup
                      field={field}
                      label="Roles (múltiples selección)"
                      options={rol.filter(rol => rol.activo)
                        .map(rol => ({
                          value: rol.nombre,
                          label: rol.nombre
                        }))}
                    />
                  )
                }}
              />
            </>
          )}
        </FormModal>
      </div>
    </div>
  )
}