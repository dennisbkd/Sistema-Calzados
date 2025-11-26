// pages/GestionPromociones.jsx
import { useState } from 'react'
import { motion } from "motion/react"
import { Tag, Plus, Filter } from "lucide-react"

import { PageCabecera } from "../../../global/components/cabecera/PageCabecera"
import { BuscarInput } from "../../../global/components/filtros/BuscarInput"
import { FiltrarFIlas } from "../../../global/components/filtros/FiltrarFIlas"
import { SeleccionarFiltros } from "../../../global/components/filtros/SeleccionarFiltros"
import { BotonAccion } from "../../../global/components/Boton/BotonAccion"
import { SpinnerCargando } from "../../../global/components/SpinnerCargando"
import { ErrorMessage } from "../../../global/components/ErrorMessage"

import { TablaPromociones } from "../components/TablaPromociones"
import { ModalPromocionForm } from "../components/ModalPromocionForm"
import { usePromocionesManager } from "../hooks/usePromocionesManager"
import { useCrearPromocion, useActualizarPromocion } from "../hooks/usePromocionesQueries"
import useProductoManager from '../../producto.jsx/hook/query/useProductoManager'

export const GestionPromociones = () => {
  const {
    promociones,
    isLoading,
    error,
    handleEliminarPromocion,
    handleToggleEstado,
    isEliminando,
    isCambiandoEstado,
    filtros,
    actualizarFiltro,
    menuFiltrosAbierto,
    toggleMenuFiltros
  } = usePromocionesManager()

  const [modalAbierto, setModalAbierto] = useState(false)
  const [promocionEditando, setPromocionEditando] = useState(null)

  const crearMutation = useCrearPromocion()
  const actualizarMutation = useActualizarPromocion()

  const { productos, categoriasActivas } = useProductoManager()

  console.log('Categorías activas cargadas:', categoriasActivas)

  const handleGuardarPromocion = async (datosPromocion) => {
    if (promocionEditando) {
      await actualizarMutation.mutateAsync({
        id: promocionEditando.id,
        data: datosPromocion
      })
    } else {
      await crearMutation.mutateAsync(datosPromocion)
    }

    setModalAbierto(false)
    setPromocionEditando(null)
  }

  const handleAbrirModal = () => {
    setPromocionEditando(null)
    setModalAbierto(true)
  }

  const handleCerrarModal = () => {
    setModalAbierto(false)
    setPromocionEditando(null)
  }

  const handleEditarPromocion = (promocion) => {
    setPromocionEditando(promocion)
    setModalAbierto(true)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <PageCabecera
            titulo="Gestión de Promociones"
            subtitulo="Administra promociones y descuentos"
            icono={Tag}
          />
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-8">
            <SpinnerCargando
              tamaño="lg"
              texto="Cargando promociones..."
            />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <PageCabecera
            titulo="Gestión de Promociones"
            subtitulo="Administra promociones y descuentos"
            icono={Tag}
          />
          <ErrorMessage
            titulo="Error al cargar promociones"
            mensaje="No se pudieron cargar las promociones. Por favor, intenta nuevamente."
            onRetry={() => window.location.reload()}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <PageCabecera
          titulo="Gestión de Promociones"
          subtitulo="Administra promociones y descuentos"
          icono={Tag}
        />

        {/* Panel de controles */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 mb-6"
        >
          <div className="flex flex-col gap-4">
            {/* Búsqueda */}
            <BuscarInput
              value={filtros.searchTerm}
              onChange={(value) => actualizarFiltro('searchTerm', value)}
              placeholder="Buscar promociones por nombre o descripción..."
            />

            {/* Filtros */}
            <FiltrarFIlas
              menuFiltrosAbierto={menuFiltrosAbierto}
              onToggleMenu={toggleMenuFiltros}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SeleccionarFiltros
                  value={filtros.filtroEstado}
                  onChange={(e) => actualizarFiltro('filtroEstado', e.target.value)}
                  options={[
                    { value: 'todos', label: 'Todos los estados' },
                    { value: 'activas', label: 'Solo activas' },
                    { value: 'inactivas', label: 'Solo inactivas' }
                  ]}
                />
                <SeleccionarFiltros
                  value={filtros.filtroTipo}
                  onChange={(e) => actualizarFiltro('filtroTipo', e.target.value)}
                  options={[
                    { value: 'todos', label: 'Todos los tipos' },
                    { value: 'PORCENTAJE', label: 'Porcentaje' },
                    { value: 'MONTO_FIJO', label: 'Monto Fijo' },
                    { value: '2X1', label: '2x1' },
                    { value: '3X2', label: '3x2' }
                  ]}
                />
              </div>
            </FiltrarFIlas>

            <div className="flex justify-end">
              <BotonAccion
                onClick={handleAbrirModal}
                icon={Plus}
                label="Nueva Promoción"
                variant="primary"
              />
            </div>
          </div>
        </motion.div>

        {/* Tabla de promociones */}
        <TablaPromociones
          promociones={promociones}
          onEditar={handleEditarPromocion}
          onEliminar={handleEliminarPromocion}
          onToggleEstado={handleToggleEstado}
          isLoading={isLoading || isEliminando}
          isChangingState={isCambiandoEstado}
        />

        {/* Modal de formulario */}
        <ModalPromocionForm
          abierto={modalAbierto}
          cambiarEstado={handleCerrarModal}
          promocion={promocionEditando}
          categorias={categoriasActivas}
          productos={productos}
          onGuardar={handleGuardarPromocion}
          isLoading={crearMutation.isLoading || actualizarMutation.isLoading}
        />
      </div>
    </div>
  )
}