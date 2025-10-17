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


export const GestionProducto = () => {
  //reutilizando la modal de form
  const { abrir, cerrar, isOpen } = useFormModal()
  const [productoAEliminar, setProductoAEliminar] = useState(null)
  const [detalleProducto, setDetalleProducto] = useState(null)
  const { modal, formConfigProducto, guardarProducto } = useFormProducto()
  const { modal: modalVariante, formConfigVariante, guardarVariante } = useFormVariante()

  const { productos, isLoading, isError, toggleEstadoProducto, categoriasActivas, eliminarProducto } = useProductoManager()


  const verDetalleProducto = (producto) => {
    setDetalleProducto(producto)
    abrir()
  }

  const cerrarModalEliminar = () => {
    setProductoAEliminar(null)
  }

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
      <div className="flex justify-end">
        <BotonAccion
          label={"Agregar Producto"}
          onClick={() => modal.abrir()}
          icon={Plus}
          className="mb-4"
        />
      </div>
      <div className="grid gap-y-4">
        {productos.map((prod) => (
          <CardProducto key={prod.id}
            producto={prod}
            calcularStockTotal={calcularStockTotal}
            verDetalleProducto={verDetalleProducto}
            cambiarEstadoProducto={toggleEstadoProducto}
            eliminarProducto={setProductoAEliminar}
            crearVariante={() => modalVariante.abrir({ productoId: prod.id })}
            editarProducto={modal.abrir}
            editarVariante={(variante) => modalVariante.abrir({
              productoId: prod.id,
              varianteData: variante
            })}
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
        isOpen={!!productoAEliminar}
        cerrar={cerrarModalEliminar}
        eliminarProducto={() => eliminarProducto(productoAEliminar)}
      />
    </div>
  )
}
