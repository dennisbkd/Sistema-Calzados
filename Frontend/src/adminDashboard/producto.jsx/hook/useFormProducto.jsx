import { useMemo } from 'react'
import { useFormModal } from '../../../global/hooks/useFormModal'
import { useActualizarProducto, useCrearProducto } from './query/useProductoQuery'

export const useFormProducto = () => {
  const modal = useFormModal()
  const crearProductoMutation = useCrearProducto()
  const editarProductoMutation = useActualizarProducto()

  const guardarProducto = (datos) => {
    if (modal.data) {
      editarProductoMutation.mutate({ id: modal.data.id, data: datos })
    } else {
      crearProductoMutation.mutate(datos)
    }
    modal.cerrar()
  }

  const formConfigProducto = useMemo(() => ({
    defaultValues: {
      nombre: modal.data?.nombre || '',
      marca: modal.data?.marca || '',
      modelo: modal.data?.modelo || '',
      categoria: modal.data?.categoria || '',
      descripcion: modal.data?.descripcion || '',
      estado: modal.data?.estado ?? true
    }
  }), [modal.data])

  return {
    modal,
    guardarProducto,
    formConfigProducto
  }
}
