import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ActualizarVariante, CrearVariante, EliminarVariante, ToggleEstadoVariante } from '../../../../api/producto/varianteApi'
import toast from 'react-hot-toast'

export const useActualizarVariante = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }) => ActualizarVariante(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['productos'])
      toast.success('Variante actualizada con éxito')
    },
    onError: (response) => {
      toast.error(response.response.data.error || 'Error al actualizar la variante')
    }
  })
}

export const useCrearVariante = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => CrearVariante(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries(['productos'])
      toast.success(data.mensaje)
    },
    onError: (response) => {
      toast.error(response.response.data.error || 'Error al crear la variante')
    }
  })
}

export const useToggleEstadoVariante = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id) => ToggleEstadoVariante(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries(['productos'])
      toast.success(data.mensaje)
    },
    onError: (response) => {
      toast.error(response.response.error || 'Error al actualizar el estado de la variante')
    }
  })
}

export const useEliminarVariante = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id) => EliminarVariante(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['productos'])
      toast.success('Variante eliminada con éxito')
    },
    onError: () => {
      toast.error('Error al eliminar la variante')
    }
  })
}
