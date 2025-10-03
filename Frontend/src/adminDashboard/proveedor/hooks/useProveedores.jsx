import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { listar, obtener, actualizar, crear, toggleEstado } from '../../../api/proveedor/proveedorApi'

export const useProveedores = () => {
  return useQuery({
    queryKey: ['proveedores'],
    queryFn: listar,
    staleTime: 5 * 60 * 1000,
  })
}

export const useProveedor = (id) => {
  return useQuery({
    queryKey: ['proveedores', id],
    queryFn: (id) => obtener(id),
    enabled: !!id,
  })
}

export const useCrearProveedor = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => crear(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['proveedores'])
      toast.success('Proveedor creado correctamente')
    },
    onError: (error) => {
      toast.error('Error al crear el proveedor')
      console.error('Error creando proveedor:', error)
    },
  })
}

export const useActualizarProveedor = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => actualizar(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['proveedores'])
      queryClient.invalidateQueries(['proveedores', variables.id])
      toast.success('Proveedor actualizado correctamente')
    },
    onError: (error) => {
      toast.error('Error al actualizar el proveedor')
      console.error('Error actualizando proveedor:', error)
    },
  })
}

export const useToggleEstadoProveedor = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id) => toggleEstado(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['proveedores'])
      toast.success('Estado del proveedor actualizado')
    },
    onError: (error) => {
      toast.error('Error al cambiar el estado')
      console.error('Error cambiando estado proveedor:', error)
    },
  })
}