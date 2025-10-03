import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { listar, obtener, crear, actualizar, toggleEstado } from '../../../api/categoria/categoriaApi'

export const useCategorias = () => {
  return useQuery({
    queryKey: ['categorias'],
    queryFn: listar,
    staleTime: 5 * 60 * 1000,
  })
}

export const useCategoria = (id) => {
  return useQuery({
    queryKey: ['categorias', id],
    queryFn: (id) => obtener(id),
    enabled: !!id,
  })
}

export const useCrearCategoria = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => crear(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['categorias'])
      toast.success('Categoría creada correctamente')
    },
    onError: (error) => {
      toast.error('Error al crear la categoría')
      console.error('Error creando categoría:', error)
    },
  })
}

export const useActualizarCategoria = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => actualizar(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['categorias'])
      queryClient.invalidateQueries(['categorias', variables.id])
      toast.success('Categoría actualizada correctamente')
    },
    onError: (error) => {
      toast.error('Error al actualizar la categoría')
      console.error('Error actualizando categoría:', error)
    },
  })
}

export const useToggleEstadoCategoria = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id) => toggleEstado(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['categorias'])
      toast.success('Estado de la categoría actualizado')
    },
    onError: (error) => {
      toast.error('Error al cambiar el estado')
      console.error('Error cambiando estado categoría:', error)
    },
  })
}