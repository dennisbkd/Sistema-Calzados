import { Box, CheckCircle, CircleX, Edit, Eye, Layers, Plus, Tag, Trash } from "lucide-react"
import { EstadoEtiqueta } from "../../../global/components/Etiqueta/EstadoEtiqueta"
import { Etiqueta } from "../../../global/components/Etiqueta/Etiqueta"
import { BotonIcon } from "../../../global/components/Boton/BotonIcon"
import { CardVariante } from "../components/CardVariante"
export const CardProducto = ({
  producto,
  estaCambiandoProducto,
  procesoCambiando,
  calcularStockTotal,
  verDetalleProducto,
  editarProducto,
  editarVariante,
  crearVariante,
  cambiarEstadoProducto,
  eliminarProducto,
  cambiarEstadoVariante,
  eliminarVariante,
  estaCambiandoEstado,
  varianteEnProceso
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden ">
      <div className="border-b border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex gap-x-3 items-center mb-3">
              <h3 className="text-lg font-semibold text-gray-900">{producto.nombre}</h3>
              <EstadoEtiqueta isLoading={estaCambiandoProducto && procesoCambiando === producto.id} activo={producto.estado} textos={{ activo: "Activo", inactivo: "Inactivo" }}
                iconos={{ activo: CheckCircle, inactivo: CircleX }} />
            </div>
            <div className="text-sm text-gray-600 flex flex-wrap gap-4">
              <Etiqueta icon={Tag} texto={`${producto.marca} - ${producto.modelo}`} />
              <Etiqueta icon={Layers} texto={`${producto.categoria}`} />
              <Etiqueta icon={Box} texto={`Stock total: ${calcularStockTotal(producto.variantes)} unidades`} />
            </div>
            <p className="text-gray-600 mt-2 text-sm">{producto.descripcion}</p>
          </div>
          <div className="flex items-center gap-2 mt-4 lg:mt-0">
            <BotonIcon onSubmit={() => verDetalleProducto(producto)} titulo={"Visualizar Detalles"} icon={Eye} color={"blue"} />
            <BotonIcon onSubmit={() => editarProducto(producto)} titulo={"Editar Producto"} icon={Edit} color={"green"} />
            <BotonIcon onSubmit={() => crearVariante(producto.id)} titulo={"Agregar Variante"} icon={Plus} color={"blue"} />
            <BotonIcon onSubmit={() => cambiarEstadoProducto(producto.id)} titulo={"Activar Producto"} activo={producto.estado} color={producto.estado ? "green" : "orange"} />
            <BotonIcon onSubmit={() => eliminarProducto(producto.id)} titulo={"Eliminar Producto"} icon={Trash} color={"red"} />
          </div>
        </div>
      </div>
      <div className="p-6">
        <h4 className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
          <Layers size={16} />
          Variantes ({producto.variantes.length})
        </h4>
        {producto.variantes.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Layers size={34} className="mx-auto mb-2" />
            <p>No hay variantes registradas</p>
            <button
              onClick={() => crearVariante(producto.id)}
              className="text-blue-600 hover:text-blue-800 mt-2 text-sm cursor-pointer"
            >
              Agregar primera variante
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {producto.variantes.map((variante, index) => (
              <CardVariante
                key={variante.id}
                variante={variante}
                editarVariante={editarVariante}
                productoId={producto.id}
                index={index}
                cambiarEstadoVariante={cambiarEstadoVariante}
                estaCambiandoEstado={estaCambiandoEstado}
                eliminarVariante={eliminarVariante}
                varianteEnProceso={varianteEnProceso}
              />
            ))}
          </div>
        )}
      </div>
    </div >
  )
}
