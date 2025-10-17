import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ActualizarProducto, CrearProducto, EliminarProducto, ObtenerProductos, ToggleEstadoProducto } from '../../../../api/producto/productoApi'
import toast from 'react-hot-toast'

export const useProducto = () => {
  return useQuery({
    queryKey: ['productos'],
    queryFn: ObtenerProductos,
    staleTime: 5 * 60 * 1000, // 5 minutos
  })
}
export const useCrearProducto = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => CrearProducto(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['productos'])
      toast.success('Producto creado correctamente')
    }
  })
}
export const useActualizarProducto = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }) => ActualizarProducto(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['productos'])
      toast.success('Producto actualizado correctamente')
    }
  })
}
export const useToggleEstadoProducto = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id) => ToggleEstadoProducto(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['productos'])
      toast.success('Estado del producto actualizado correctamente')
    }
  })
}
export const useEliminarProducto = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id) => EliminarProducto(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['productos'])
      toast.success('Producto eliminado correctamente')
    }
  })
}
