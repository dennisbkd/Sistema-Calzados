// hooks/usePromocionesQueries.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { listarPromociones, obtenerPromocion, crearPromocion, actualizarPromocion, eliminarPromocion, toggleEstadoPromocion } from '../../../api/promocion/promocionApi'


export const usePromociones = () => {
  return useQuery({
    queryKey: ['promociones'],
    queryFn: listarPromociones,
    staleTime: 5 * 60 * 1000,
  })
}

export const usePromocion = (id) => {
  return useQuery({
    queryKey: ['promociones', id],
    queryFn: () => obtenerPromocion(id),
    enabled: !!id,
  })
}

export const useCrearPromocion = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => crearPromocion(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['promociones'])
      toast.success('Promoción creada correctamente')
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Error al crear la promoción')
      console.error('Error creando promoción:', error)
    },
  })
}

export const useActualizarPromocion = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => actualizarPromocion(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['promociones'])
      queryClient.invalidateQueries(['promociones', variables.id])
      toast.success('Promoción actualizada correctamente')
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Error al actualizar la promoción')
      console.error('Error actualizando promoción:', error)
    },
  })
}

export const useEliminarPromocion = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id) => eliminarPromocion(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['promociones'])
      toast.success('Promoción eliminada correctamente')
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Error al eliminar la promoción')
      console.error('Error eliminando promoción:', error)
    },
  })
}

export const useToggleEstadoPromocion = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id) => toggleEstadoPromocion(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['promociones'])
      toast.success('Estado de promoción actualizado')
    },
    onError: (error) => {
      toast.error('Error al cambiar el estado')
      console.error('Error cambiando estado promoción:', error)
    },
  })
}