/* eslint-disable no-unused-vars */
import { motion } from "motion/react"
import { Tag, FileText, Hash } from "lucide-react"

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
import { FormSeleccionado } from "../../../global/components/formulario/FormSeleccionado"

import { TablaCategorias } from "../components/TablaCategorias"
import { useCategoriasManager } from "../hooks/useCategoriasManager"
import { useCategoriaForm } from "../hooks/useCategoriaForm"

// Opciones para el género
const opcionesGenero = [
  { value: "hombre", label: "Hombre" },
  { value: "mujer", label: "Mujer" },
  { value: "unisex", label: "Unisex" },
  { value: "niño", label: "Niño" },
  { value: "niña", label: "Niña" }
]

export const GestionCategoria = () => {
  const {
    categorias,
    isLoading,
    error,
    toggleEstadoCategoria,
    isCambiandoEstado
  } = useCategoriasManager()

  const {
    filtros,
    menuFiltrosAbierto,
    actualizarFiltro,
    toggleMenuFiltros
  } = useFiltros({
    filtroGenero: 'todos',
    filtroEstado: 'todos'
  })

  // Filtrar categorías
  const categoriasFiltradas = categorias.filter(categoria => {
    const coincideBusqueda = categoria.nombre
      .toLowerCase()
      .includes(filtros.searchTerm.toLowerCase()) ||
      categoria.descripcion?.toLowerCase()
        .includes(filtros.searchTerm.toLowerCase())

    const coincideGenero = filtros.filtroGenero === "todos" ||
      categoria.genero.toLowerCase() === filtros.filtroGenero.toLowerCase()

    const coincideEstado = filtros.filtroEstado === 'todos' ||
      (filtros.filtroEstado === 'activos' && categoria.activo) ||
      (filtros.filtroEstado === 'inactivos' && !categoria.activo)

    return coincideBusqueda && coincideGenero && coincideEstado
  })

  const {
    modal,
    guardarCategoria,
    formConfig,
    isLoading: isSaving
  } = useCategoriaForm()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <PageCabecera
            titulo="Gestión de Categorías"
            subtitulo="Organiza tus productos por categorías"
            icono={Tag}
          />
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-8">
            <SpinnerCargando
              tamaño="lg"
              texto="Cargando categorías..."
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
            titulo="Gestión de Categorías"
            subtitulo="Organiza tus productos por categorías"
            icono={Tag}
          />
          <ErrorMessage
            titulo="Error al cargar categorías"
            mensaje="No se pudieron cargar las categorías. Por favor, intenta nuevamente."
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
          titulo="Gestión de Categorías"
          subtitulo="Organiza tus productos por categorías"
          icono={Tag}
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
              placeholder="Buscar categorías por nombre o descripción..."
            />

            {/* Filtros */}
            <FiltrarFIlas
              menuFiltrosAbierto={menuFiltrosAbierto}
              onToggleMenu={toggleMenuFiltros}
            >
              <SeleccionarFiltros
                value={filtros.filtroGenero}
                onChange={(e) => actualizarFiltro('filtroGenero', e.target.value)}
                options={[
                  ...opcionesGenero
                ]}
                placeholder="Todos los géneros"
              />

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
                icon={Tag}
                label="Nueva Categoría"
                variant="primary"
              />
            </div>
          </div>
        </motion.div>

        {/* Tabla de categorías */}
        <TablaCategorias
          categorias={categoriasFiltradas}
          onEditar={modal.abrir}
          onToggleEstado={toggleEstadoCategoria}
          isLoading={isLoading}
          isChangingState={isCambiandoEstado}
        />

        {/* Modal de formulario */}
        <FormModal
          isOpen={modal.isOpen}
          onClose={modal.cerrar}
          title={modal.data ? 'Editar Categoría' : 'Crear Nueva Categoría'}
          formConfig={{
            defaultValues: formConfig.defaultValues
          }}
          onSubmit={guardarCategoria}
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
              {isLoading ? 'Guardando...' : (modal.data ? 'Guardar Cambios' : 'Crear Categoría')}
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
                    if (value.length > 50) return 'El nombre no puede tener más de 50 caracteres'
                  }
                }}
                children={(field) => (
                  <FormInput
                    field={field}
                    label="Nombre de la Categoría"
                    placeholder="Ej: Zapatillas Deportivas"
                    icon={Tag}
                  />
                )}
              />

              <form.Field
                name="descripcion"
                validators={{
                  onChange: ({ value }) => {
                    if (value && value.length > 255) return 'La descripción no puede tener más de 255 caracteres'
                  }
                }}
                children={(field) => (
                  <FormTextarea
                    field={field}
                    label="Descripción"
                    placeholder="Describe la categoría (opcional)"
                    rows={3}
                  />
                )}
              />

              <form.Field
                name="genero"
                validators={{
                  onChange: ({ value }) => {
                    if (!value) return 'El género es requerido'
                  }
                }}
                children={(field) => (
                  <FormSeleccionado
                    field={field}
                    label="Género"
                    options={opcionesGenero}
                    placeholder="Selecciona un género"
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