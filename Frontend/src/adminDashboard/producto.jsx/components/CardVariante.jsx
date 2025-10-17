import { EstadoEtiqueta } from '../../../global/components/Etiqueta/EstadoEtiqueta'
import { Etiqueta } from '../../../global/components/Etiqueta/Etiqueta'
import { Barcode, CheckCircle, Edit, Trash, XCircle } from 'lucide-react'
import { BotonIcon } from '../../../global/components/Boton/BotonIcon'
import { motion } from 'motion/react'

export const CardVariante = ({ index, variante, productoId, editarVariante, varianteEnProceso, cambiarEstadoVariante, estaCambiandoEstado, eliminarVariante }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      whileTap={{ scale: 0.98 }}>
      <div key={variante.id} className="border border-gray-200 rounded-lg p-4">
        <div className='flex justify-between items-start mb-3'>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-gray-900">
                Talla {variante.talla} - {variante.color}
              </span>
              <EstadoEtiqueta isLoading={estaCambiandoEstado && varianteEnProceso === variante.id} activo={variante.activo} iconos={{ activo: CheckCircle, inactivo: XCircle }} />
            </div>
            <div className="text-sm text-gray-600 flex items-center gap-1 mb-1">
              <Etiqueta size={12} icon={Barcode} texto={variante.codigo} />
            </div>

          </div>
          <div className='flex gap-1'>
            <BotonIcon onSubmit={() => editarVariante({
              productoId: productoId,
              id: variante.id,
              varianteData: variante
            })} titulo={"Editar Variante"} size={14} icon={Edit} color={"green"} />
            <BotonIcon
              isLoading={estaCambiandoEstado}
              onSubmit={() => cambiarEstadoVariante(variante.id)}
              titulo={"Activar Variante"}
              size={14}
              activo={variante.activo}
              color={variante.activo ? "green" : "red"} />
            <BotonIcon
              onSubmit={() => eliminarVariante(variante.id)}
              titulo={"Eliminar Variante"}
              size={14}
              icon={Trash}
              color={"red"} />
          </div>
        </div>
        <div className='grid grid-cols-2 gap-2 text-sm'>
          <div>
            <span className='text-gray-600'>Precio:</span>
            <div className='font-semibold text-green-600'>${variante.precioVenta}</div>
          </div>
          <div>
            <span className="text-gray-600">Stock:</span>
            <div className={`font-semibold ${variante.stockActual <= variante.stockMinimo
              ? 'text-red-600'
              : 'text-gray-900'
              }`}>
              {variante.stockActual} / {variante.stockMinimo}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
