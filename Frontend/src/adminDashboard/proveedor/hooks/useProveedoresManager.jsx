import { useProveedores, useToggleEstadoProveedor } from "./useProveedores"

export const useProveedoresManager = () => {
  const { data: proveedores = [], isLoading, error } = useProveedores()
  const toggleEstadoMutation = useToggleEstadoProveedor()

  const toggleEstadoProveedor = (id) => {
    toggleEstadoMutation.mutate(id)
  }

  return {
    proveedores,
    isLoading,
    error,
    toggleEstadoProveedor,
    isCambiandoEstado: toggleEstadoMutation.isPending
  }
}