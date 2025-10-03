import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { actualizar, crear, listar, toggleEstado, obtener, actualizarRoles } from '../../../api/usuarioApi'

export const useUsuarios = () => {
  return useQuery({
    queryKey: ['usuarios'],
    queryFn: listar,
    staleTime: 5 * 60 * 1000, // 5 minutos
  })
}

export const useUsuario = (id) => {
  return useQuery({
    queryKey: ['usuarios', id],
    queryFn: () => obtener(id),
    enabled: !!id,
  })
}

export const useCrearUsuario = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => crear(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['usuarios'])
      toast.success('Usuario creado correctamente')
    },
    onError: (error) => {
      toast.error('Error al crear el usuario')
      console.error('Error creando usuario:', error)
    },
  })
}

export const useActualizarUsuario = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => actualizar(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['usuarios'])
      queryClient.invalidateQueries(['usuarios', variables.id])
      toast.success('Usuario actualizado correctamente')
    },
    onError: (error) => {
      toast.error('Error al actualizar el usuario')
      console.error('Error actualizando usuario:', error)
    },
  })
}

export const useToggleEstadoUsuario = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, activo }) => toggleEstado(id, activo),
    onSuccess: () => {
      queryClient.invalidateQueries(['usuarios'])
      toast.success('Estado del usuario actualizado')
    },
    onError: (error) => {
      toast.error('Error al cambiar el estado')
      console.error('Error cambiando estado:', error)
    },
  })
}

export const useActualizarRolesUsuario = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, roles }) => actualizarRoles(id, roles),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['usuarios'])
      queryClient.invalidateQueries(['usuarios', variables.id])
      toast.success('Roles actualizados correctamente')
    },
    onError: (error) => {
      toast.error('Error al actualizar los roles', error.response.data.error)
      console.error('Error actualizando roles:', error)
    },
  })
}