import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { crearCompra, editarCompra, eliminarCompra, listarCompras, generarCodigoFactura, cambiarEstadoCompraA } from '../../../api/compra/compraApi.js'
import toast from 'react-hot-toast'

export const useCompra = () => {
  const queryClient = useQueryClient()

  // Crear compra
  const crear = useMutation({
    mutationFn: (data) => crearCompra(data),
    onSuccess: () => {
      toast.success('Compra registrada correctamente')
      queryClient.invalidateQueries(['listar-compras'])
    },
    onError: (error) => {
      toast.error(`Error al registrar la compra: ${error.message}`)
    }
  })

  // Editar compra
  const editar = useMutation({
    mutationFn: (data) => editarCompra(data),
    onSuccess: () => {
      // toast.success('Compra editada correctamente')
      queryClient.invalidateQueries(['listar-compras'])
    },
    onError: (error) => {
      toast.error(`Error al editar la compra: ${error.message}`)
    }
  })

  // Eliminar compra
  const eliminar = useMutation({
    mutationFn: (id) => eliminarCompra(id),
    onSuccess: () => {
      toast.success('Compra eliminada correctamente')
      queryClient.invalidateQueries(['listar-compras'])
    },
    onError: (error) => {
      toast.error(`Error al eliminar la compra: ${error.message}`)
    }
  })

  // Listar compras
  const listar = useQuery({
    queryKey: ['listar-compras'],
    queryFn: async () => {
      const res = await listarCompras()
      return Array.isArray(res) ? res : []
    },
    onError: () => {
      toast.error('Error al listar las compras')
    }
  })

 const generateCodigoFactura = useMutation({
    mutationFn: () => generarCodigoFactura(),
    onError: (error) => {
      toast.error(`Error al generar el código de factura: ${error.message}`)
    }
  })

 const cambiarEstadoCompra = useMutation({
    mutationFn: (data) => cambiarEstadoCompraA(data),
    onSuccess: () => {
      // toast.success('Estado de la compra cambiado correctamente')
      queryClient.invalidateQueries(['listar-compras'])
    },
    onError: (error) => {
      toast.error(`Error al cambiar el estado de la compra: ${error.message}`)
    }
  })
      
  return { crear, editar, eliminar, listar, generateCodigoFactura, cambiarEstadoCompra }
}
