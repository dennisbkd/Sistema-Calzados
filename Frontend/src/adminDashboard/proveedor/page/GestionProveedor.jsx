/* eslint-disable no-unused-vars */

import { motion } from "motion/react"
import { Building, User, MapPin, Phone } from "lucide-react"

import { useFiltros } from "../../../global/hooks/useFiltros"

import { PageCabecera } from "../../../global/components/cabecera/PageCabecera"
import { BuscarInput } from "../../../global/components/filtros/BuscarInput"
import { FiltrarFIlas } from "../../../global/components/filtros/FiltrarFIlas"
import { SeleccionarFiltros } from "../../../global/components/filtros/SeleccionarFiltros"
import { BotonAccion } from "../../../global/components/Boton/BotonAccion"
import { SpinnerCargando } from "../../../global/components/SpinnerCargando"
import { ErrorMessage } from "../../../global/components/ErrorMessage"

import { FormModal } from "../../../global/components/formulario/FormModal"
import { FormInput } from "../../../global/components/formulario/FormInput"
import { FormTextarea } from "../../../global/components/formulario/FormTextarea"

import { TablaProveedores } from "../components/TablaProveedores"
import { useProveedoresManager } from "../hooks/useProveedoresManager"
import { useProveedorForm } from "../hooks/useProveedorForm"

export const GestionProveedor = () => {
  const {
    proveedores,
    isLoading,
    error,
    toggleEstadoProveedor,
    isCambiandoEstado
  } = useProveedoresManager()

  const {
    filtros,
    menuFiltrosAbierto,
    actualizarFiltro,
    toggleMenuFiltros
  } = useFiltros({
    filtroEstado: 'todos'
  })

  // Filtrar proveedores
  const proveedoresFiltrados = proveedores.filter(proveedor => {
    const coincideBusqueda = proveedor.nombre
      .toLowerCase()
      .includes(filtros.searchTerm.toLowerCase()) ||
      proveedor.contacto?.toLowerCase()
        .includes(filtros.searchTerm.toLowerCase()) ||
      proveedor.telefono?.includes(filtros.searchTerm)

    const coincideEstado = filtros.filtroEstado === 'todos' ||
      (filtros.filtroEstado === 'activos' && proveedor.activo) ||
      (filtros.filtroEstado === 'inactivos' && !proveedor.activo)

    return coincideBusqueda && coincideEstado
  })

  const {
    modal,
    guardarProveedor,
    formConfig,
    isLoading: isSaving
  } = useProveedorForm()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <PageCabecera
            titulo="Gestión de Proveedores"
            subtitulo="Administra los proveedores de calzado"
            icono={Building}
          />
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-8">
            <SpinnerCargando
              tamaño="lg"
              texto="Cargando proveedores..."
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
            titulo="Gestión de Proveedores"
            subtitulo="Administra los proveedores de calzado"
            icono={Building}
          />
          <ErrorMessage
            titulo="Error al cargar proveedores"
            mensaje="No se pudieron cargar los proveedores. Por favor, intenta nuevamente."
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
          titulo="Gestión de Proveedores"
          subtitulo="Administra los proveedores de calzado"
          icono={Building}
        />

        {/* Panel de controles */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 mb-6"
        >
          <div className="flex flex-col gap-4">
            {/* Búsqueda */}
            <BuscarInput
              value={filtros.searchTerm}
              onChange={(value) => actualizarFiltro('searchTerm', value)}
              placeholder="Buscar proveedores por nombre, contacto o teléfono..."
            />

            {/* Filtros */}
            <FiltrarFIlas
              menuFiltrosAbierto={menuFiltrosAbierto}
              onToggleMenu={toggleMenuFiltros}
            >
              <SeleccionarFiltros
                value={filtros.filtroEstado}
                onChange={(e) => actualizarFiltro('filtroEstado', e.target.value)}
                options={[
                  { value: 'activos', label: 'Solo activos' },
                  { value: 'inactivos', label: 'Solo inactivos' }
                ]}
                placeholder="Todos los estados"
              />
            </FiltrarFIlas>

            <div className="flex justify-end">
              <BotonAccion
                onClick={() => modal.abrir()}
                icon={Building}
                label="Nuevo Proveedor"
                variant="primary"
              />
            </div>
          </div>
        </motion.div>

        {/* Tabla de proveedores */}
        <TablaProveedores
          proveedores={proveedoresFiltrados}
          onEditar={modal.abrir}
          onToggleEstado={toggleEstadoProveedor}
          isLoading={isLoading}
          isChangingState={isCambiandoEstado}
        />

        {/* Modal de formulario */}
        <FormModal
          isOpen={modal.isOpen}
          onClose={modal.cerrar}
          title={modal.data ? 'Editar Proveedor' : 'Crear Nuevo Proveedor'}
          formConfig={{
            defaultValues: formConfig.defaultValues
          }}
          onSubmit={guardarProveedor}
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
              {isLoading ? 'Guardando...' : (modal.data ? 'Guardar Cambios' : 'Crear Proveedor')}
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
                    if (value.length > 100) return 'El nombre no puede tener más de 100 caracteres'
                  }
                }}
                children={(field) => (
                  <FormInput
                    field={field}
                    label="Nombre del Proveedor"
                    placeholder="Ej: Calzados Premium SA"
                    icon={Building}
                  />
                )}
              />

              <form.Field
                name="contacto"
                validators={{
                  onChange: ({ value }) => {
                    if (!value) return 'El contacto es requerido'
                    if (value.length > 100) return 'El contacto no puede tener más de 100 caracteres'
                  }
                }}
                children={(field) => (
                  <FormInput
                    field={field}
                    label="Persona de Contacto"
                    placeholder="Ej: Juan Pérez"
                    icon={User}
                  />
                )}
              />

              <form.Field
                name="telefono"
                validators={{
                  onChange: ({ value }) => {
                    if (!value) return 'El teléfono es requerido'
                    if (!/^[+]?[\d\s\-()]{10,}$/.test(value)) return 'Teléfono inválido'
                  }
                }}
                children={(field) => (
                  <FormInput
                    field={field}
                    label="Teléfono"
                    placeholder="Ej: +1234567890"
                    icon={Phone}
                  />
                )}
              />

              <form.Field
                name="direccion"
                validators={{
                  onChange: ({ value }) => {
                    if (!value) return 'La dirección es requerida'
                    if (value.length > 255) return 'La dirección no puede tener más de 255 caracteres'
                  }
                }}
                children={(field) => (
                  <FormTextarea
                    field={field}
                    label="Dirección"
                    placeholder="Ej: Av. Industrial 123, Ciudad, País"
                    rows={3}
                    icon={MapPin}
                  />
                )}
              />
            </>
          )}
        </FormModal>
      </div>
    </div>
  )
}