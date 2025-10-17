import { useState } from "react"
import { useFormModal } from "../../../global/hooks/useFormModal"
import { CardProducto } from "../components/CardProducto"
import VisualizarDetalle from "../components/modales/VisualizarDetalle"
import { FormProducto } from "../components/modales/FormProducto"
import { useFormProducto } from "../hook/useFormProducto"
import { BotonAccion } from "../../../global/components/Boton/BotonAccion"
import { Plus } from "lucide-react"
import { useFormVariante } from "../hook/useFormVariante"
import { FormVariante } from "../components/modales/FormVariante"
import useProductoManager from "../hook/query/useProductoManager"
import { ModalEliminar } from "../components/modales/ModalEliminar"
import { SpinnerCargando } from "../../../global/components/SpinnerCargando"
import { ErrorMessage } from "../../../global/components/ErrorMessage"
import { useVarianteManager } from "../hook/query/useVarianteManager"
import { useFiltros } from "../../../global/hooks/useFiltros"
import { FiltrarFIlas } from "../../../global/components/filtros/FiltrarFIlas"
import { SeleccionarFiltros } from "../../../global/components/filtros/SeleccionarFiltros"
import { BuscarInput } from "../../../global/components/filtros/BuscarInput"
import { motion } from "motion/react"


export const GestionProducto = () => {
  //reutilizando la modal de form
  const { abrir, cerrar, isOpen } = useFormModal()
  const [productoAEliminar, setProductoAEliminar] = useState(null)
  const [varianteAEliminar, setVarianteAEliminar] = useState(null)
  const [detalleProducto, setDetalleProducto] = useState(null)
  const { modal, formConfigProducto, guardarProducto } = useFormProducto()
  const { modal: modalVariante, formConfigVariante, guardarVariante } = useFormVariante()

  const {
    productos,
    isLoading,
    isError,
    toggleEstadoProducto,
    categoriasActivas,
    eliminarProducto,
    procesoCambiando,
    estaCambiandoProducto
  } = useProductoManager()

  const {
    cambiarEstadoVariante,
    estaCambiandoEstado,
    eliminarVariante,
    varianteEnProceso
  } = useVarianteManager()

  const {
    filtros,
    menuFiltrosAbierto,
    actualizarFiltro,
    toggleMenuFiltros
  } = useFiltros({
    filtroEstado: 'todos'
  })


  const verDetalleProducto = (producto) => {
    setDetalleProducto(producto)
    abrir()
  }

  const cerrarModalEliminarGeneral = () => {
    setProductoAEliminar(null)
    setVarianteAEliminar(null)
  }
  const confirmarEliminar = () => {
    if (productoAEliminar) {
      eliminarProducto(productoAEliminar)
    } else {
      eliminarVariante(varianteAEliminar)
    }
    cerrarModalEliminarGeneral()
  }

  // Filtrar productos
  const ProductosFiltrados = productos?.filter(producto => {
    const coincideBusqueda = producto.nombre
      .toLowerCase()
      .includes(filtros.searchTerm.toLowerCase()) ||
      producto.descripcion?.toLowerCase()
        .includes(filtros.searchTerm.toLowerCase())

    const coincideEstado = filtros.filtroEstado === 'todos' ||
      (filtros.filtroEstado === 'activos' && producto.estado) ||
      (filtros.filtroEstado === 'inactivos' && !producto.estado)

    return coincideBusqueda && coincideEstado
  })

  const calcularStockTotal = (variantes) => {
    return variantes.reduce((acc, variante) => acc + variante.stockActual, 0)
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-8">
        <SpinnerCargando
          tamaño="lg"
          texto="Cargando Productos..."
        />
      </div>
    )
  }
  if (isError) {
    return (
      <ErrorMessage
        titulo="Error al cargar productos"
        mensaje="No se pudieron cargar los productos. Por favor, intenta nuevamente."
        onRetry={() => window.location.reload()}
      />
    )
  }

  return (
    <div>
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
            placeholder="Buscar por nombre o descripción..."
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
              className="w-full"
            />
          </FiltrarFIlas>

          <div className="flex justify-end">
            <BotonAccion
              label={"Agregar Producto"}
              onClick={() => modal.abrir()}
              icon={Plus}
              className="mb-4"
            />
          </div>
        </div>
      </motion.div>
      <div className="grid gap-y-4">
        {ProductosFiltrados?.map((prod) => (
          <CardProducto key={prod.id}
            procesoCambiando={procesoCambiando}
            estaCambiandoProducto={estaCambiandoProducto}
            producto={prod}
            calcularStockTotal={calcularStockTotal}
            verDetalleProducto={verDetalleProducto}
            cambiarEstadoProducto={toggleEstadoProducto}
            eliminarProducto={setProductoAEliminar}
            editarProducto={modal.abrir}
            editarVariante={(variante) => modalVariante.abrir({
              productoId: prod.id,
              varianteData: variante
            })}
            crearVariante={() => modalVariante.abrir({ productoId: prod.id })}
            cambiarEstadoVariante={cambiarEstadoVariante}
            eliminarVariante={setVarianteAEliminar}
            estaCambiandoEstado={estaCambiandoEstado}
            varianteEnProceso={varianteEnProceso}
          />
        ))}
      </div>
      <VisualizarDetalle
        isOpen={isOpen}
        cerrar={cerrar}
        detalleProducto={detalleProducto}
        calcularStockTotal={calcularStockTotal}
      />
      <FormProducto
        isLoading={isLoading}
        categorias={categoriasActivas}
        guardarProducto={guardarProducto}
        modal={modal}
        formConfigProducto={formConfigProducto.defaultValues}
      />
      <FormVariante
        isLoading={false}
        guardarVariante={guardarVariante}
        modal={modalVariante}
        formConfigVariante={formConfigVariante.defaultValues}
      />
      <ModalEliminar
        isOpen={!!productoAEliminar || !!varianteAEliminar}
        cerrar={cerrarModalEliminarGeneral}
        tipo={productoAEliminar ? "producto" : "variante"}
        nombre={productoAEliminar ?
          productos.find(p => p.id === productoAEliminar)?.nombre :
          varianteAEliminar ? `Variante ID: ${varianteAEliminar}` : ''}
        eliminarProducto={confirmarEliminar}
      />
    </div>
  )
}
