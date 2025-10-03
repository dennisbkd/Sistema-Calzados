import { useUsuarios, useToggleEstadoUsuario, useActualizarRolesUsuario } from "./useUsuarioQuery"


export const useUsuariosManager = () => {
  const { data: usuarios = [], isLoading, error } = useUsuarios()
  const toggleEstadoMutation = useToggleEstadoUsuario()
  const actualizarRolesMutation = useActualizarRolesUsuario()

  const toggleEstadoUsuario = (id, activo) => {
    toggleEstadoMutation.mutate({ id, activo })
  }

  const eliminarRol = (id, rol) => {
    console.log('mana', id, rol)
    const usuario = usuarios.find(u => u.id === id)
    if (usuario) {
      const nuevosRoles = usuario.roles.filter(r => r !== rol)
      actualizarRolesMutation.mutate({
        id,
        roles: nuevosRoles
      })
    }
  }
  return {
    usuarios,
    isLoading,
    error,
    toggleEstadoUsuario,
    eliminarRol,
    isCambiandoEstado: toggleEstadoMutation.isPending,
    isActualizandoRoles: actualizarRolesMutation.isPending
  }
}
