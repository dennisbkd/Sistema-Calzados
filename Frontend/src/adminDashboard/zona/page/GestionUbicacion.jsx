import { motion } from "motion/react"
import { MapPin, Package, Warehouse, Plus, Building, Edit, Trash2 } from "lucide-react"
import { useState } from "react"

import { PageCabecera } from "../../../global/components/cabecera/PageCabecera"
import { SpinnerCargando } from "../../../global/components/SpinnerCargando"
import { ErrorMessage } from "../../../global/components/ErrorMessage"
import { BotonAccion } from "../../../global/components/Boton/BotonAccion"
import { useUbicacionesManager } from "../hooks/useZonaManager"
import { useModalesUbicaciones } from "../hooks/useModalesUbicaciones"
import { ModalAgregarVariantes } from "../components/ModalAgregarVariante"
import { ModalRemoverVariantes } from "../components/ModalRemoverVariante"
import { ModalCrearUbicacion } from "../components/ModalCrearUbicacion"
import { ModalCrearZona } from "../components/ModalCrearZona"
import { ModalEditarZona } from "../components/ModalEditarZona"
import { GridZonasPersonalizable } from "../components/ZonaItem"
import { ModalEliminarZona } from "../components/ModalEliminarZona"
import { ModalEliminarUbicacion } from "../components/ModalEliminarUbicacion"

export const GestionUbicaciones = () => {
  const {
    zonas,
    ubicaciones,
    zonaSeleccionada,
    ubicacionSeleccionada,
    isLoadingZonas,
    isLoadingUbicaciones,
    errorZonas,
    errorUbicaciones,
    seleccionarZona,
    seleccionarUbicacion,
    handleAgregarVariantes,
    handleRemoverVariantes,
    refetchUbicaciones
  } = useUbicacionesManager()

  const {
    modalAgregar,
    modalRemover,
    modalCrearUbicacion,
    modalCrearZona,
    modalEliminarZona,
    modalEliminarUbicacion,
    abrirModalAgregar,
    abrirModalRemover,
    abrirModalCrearUbicacion,
    abrirModalCrearZona,
    abrirModalEliminarZona,
    abrirModalEliminarUbicacion,
    cerrarModales
  } = useModalesUbicaciones()

  const [modoEdicionLayout, setModoEdicionLayout] = useState(false)
  const [zonaEditando, setZonaEditando] = useState(null)

  if (isLoadingZonas) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <PageCabecera
            titulo="Gestión de Ubicaciones"
            subtitulo="Administra la ubicación física del inventario"
            icono={Warehouse}
          />
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-8">
            <SpinnerCargando
              tamaño="lg"
              texto="Cargando zonas..."
            />
          </div>
        </div>
      </div>
    )
  }

  if (errorZonas) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <PageCabecera
            titulo="Gestión de Ubicaciones"
            subtitulo="Administra la ubicación física del inventario"
            icono={Warehouse}
          />
          <ErrorMessage
            titulo="Error al cargar zonas"
            mensaje="No se pudieron cargar las zonas. Por favor, intenta nuevamente."
            onRetry={() => window.location.reload()}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <PageCabecera
          titulo="Gestión de Ubicaciones"
          subtitulo="Administra la ubicación física del inventario"
          icono={Warehouse}
        />

        {/* Controles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 mb-6"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Layout de Zonas
            </h3>

            <div className="flex gap-2">
              <button
                onClick={() => setModoEdicionLayout(!modoEdicionLayout)}
                className={`px-4 py-2 rounded-lg border transition-colors flex items-center gap-2 ${modoEdicionLayout
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
              >
                <Edit className="w-4 h-4" />
                {modoEdicionLayout ? 'Guardar Layout' : 'Editar Layout'}
              </button>

              <BotonAccion
                onClick={abrirModalCrearZona}
                icon={Building}
                label="Nueva Zona"
                variant="primary"
              />
            </div>
          </div>
        </motion.div>

        {/* Grid de Zonas Personalizable */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 mb-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Zonas de Bodega
          </h3>

          <GridZonasPersonalizable
            zonas={zonas}
            zonaSeleccionada={zonaSeleccionada}
            onSeleccionarZona={seleccionarZona}
            onEditarZona={setZonaEditando}
            onEliminarZona={abrirModalEliminarZona} // ✅ Nuevo prop
            modoEdicion={modoEdicionLayout}
          />
        </motion.div>

        {/* Ubicaciones de la zona seleccionada */}
        {zonaSeleccionada && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Warehouse className="w-5 h-5" />
                Ubicaciones en {zonas.find(z => z.id === zonaSeleccionada)?.nombre}
              </h3>

              <BotonAccion
                onClick={abrirModalCrearUbicacion}
                icon={Plus}
                label="Nueva Ubicación"
                variant="primary"
              />
            </div>

            {isLoadingUbicaciones ? (
              <SpinnerCargando texto="Cargando ubicaciones..." />
            ) : errorUbicaciones ? (
              <ErrorMessage
                titulo="Error al cargar ubicaciones"
                mensaje={errorUbicaciones.message}
              />
            ) : ubicaciones.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No hay ubicaciones en esta zona</p>
                <button
                  onClick={abrirModalCrearUbicacion}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Crear primera ubicación
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {ubicaciones.map((ubicacion) => (
                  <motion.div
                    key={ubicacion.id}
                    whileHover={{ scale: 1.02 }}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${ubicacionSeleccionada === ubicacion.id
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                      }`}
                    onClick={() => seleccionarUbicacion(ubicacion.id)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">{ubicacion.codigo}</h4>
                        <p className="text-sm text-gray-600 mt-1">{ubicacion.descripcion}</p>
                      </div>
                      <div className="flex items-start gap-1">
                        <span className={`px-2 py-1 rounded-full text-xs ${ubicacion.activa
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                          }`}>
                          {ubicacion.activa ? 'Activa' : 'Inactiva'}
                        </span>
                        {/* ✅ Botón eliminar ubicación */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            abrirModalEliminarUbicacion(ubicacion)
                          }}
                          className="p-1 hover:bg-red-100 rounded text-red-500 transition-colors"
                          title="Eliminar ubicación"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1 text-sm text-gray-500">
                      <div className="flex justify-between">
                        <span>Variantes:</span>
                        <span className="font-medium">{ubicacion.cantidadVariantes}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Stock total:</span>
                        <span className="font-medium">{ubicacion.stockTotal}</span>
                      </div>
                      {ubicacion.capacidadMaxima && (
                        <div className="flex justify-between">
                          <span>Capacidad:</span>
                          <span className="font-medium">{ubicacion.capacidadMaxima}</span>
                        </div>
                      )}
                    </div>

                    {/* Acciones rápidas */}
                    {ubicacionSeleccionada === ubicacion.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-4 flex gap-2"
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            abrirModalAgregar(ubicacion)
                          }}
                          className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700 transition-colors"
                        >
                          Agregar
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            abrirModalRemover(ubicacion)
                          }}
                          className="flex-1 bg-red-600 text-white py-2 px-3 rounded text-sm hover:bg-red-700 transition-colors"
                        >
                          Remover
                        </button>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Modales */}
        <ModalAgregarVariantes
          {...modalAgregar}
          onAgregarVariantes={handleAgregarVariantes}
          onCerrarModal={cerrarModales}
        />

        <ModalRemoverVariantes
          {...modalRemover}
          onRemoverVariantes={handleRemoverVariantes}
          onCerrarModal={cerrarModales}
        />

        <ModalCrearUbicacion
          {...modalCrearUbicacion}
          zonas={zonas}
          onUbicacionCreada={refetchUbicaciones}
        />

        <ModalCrearZona
          {...modalCrearZona}
          onZonaCreada={(nuevaZona) => {
            seleccionarZona(nuevaZona.id)
          }}
        />

        <ModalEditarZona
          abierto={!!zonaEditando}
          cambiarEstado={() => setZonaEditando(null)}
          zona={zonaEditando}
          onZonaActualizada={() => {
            setZonaEditando(null)
          }}
        />

        {/* ✅ Nuevos modales de eliminación */}
        <ModalEliminarZona
          {...modalEliminarZona}
          onZonaEliminada={(zonaId) => {
            if (zonaSeleccionada === zonaId) {
              seleccionarZona(null)
            }
          }}
        />

        <ModalEliminarUbicacion
          {...modalEliminarUbicacion}
          onUbicacionEliminada={(ubicacionId) => {
            if (ubicacionSeleccionada === ubicacionId) {
              seleccionarUbicacion(null)
            }
            refetchUbicaciones()
          }}
        />
      </div>
    </div>
  )
}