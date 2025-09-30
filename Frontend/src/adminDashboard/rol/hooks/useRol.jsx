
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { crearRol, editarRol, eliminarRol, listarRoles } from '../../../api/rol/rol.js'
import toast from 'react-hot-toast'

export const useRol = () => {
  const queryClient = useQueryClient()

  // Crear rol
  const crear = useMutation({
    mutationFn: (data) => crearRol(data),
    onSuccess: () => {
      toast.success('Rol creado correctamente')
      queryClient.invalidateQueries(['listar-roles'])
    },
    onError: (error) => {
      toast.error(`Error al crear el rol ${error.message}`)
    }
  })

  // Editar rol
  const editar = useMutation({
    mutationFn: (data) => editarRol(data),
    onSuccess: () => {
      toast.success('Rol editado correctamente')
      queryClient.invalidateQueries(['listar-roles'])
    },
    onError: (error) => {
      toast.error(`Error al editar el rol ${error.message}`)
    }
  })

  // Eliminar rol
  const eliminar = useMutation({
    mutationFn: (id) => eliminarRol(id),
    onSuccess: () => {
      toast.success('Rol eliminado correctamente')
      queryClient.invalidateQueries(['listar-roles'])
    },
    onError: () => {
      toast.error('Error al eliminar el rol')
    }
  })

  // Listar roles
  const listar = useQuery({
    queryKey: ['listar-roles'],
    queryFn: async () => {
      const res = await listarRoles()
      return Array.isArray(res) ? res : [] // garantizamos array
    },
    onError: () => {
      toast.error('Error al listar los roles')
    }
  })

  return { crear, editar, eliminar, listar }
}
