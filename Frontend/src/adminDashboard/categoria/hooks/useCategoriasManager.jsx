import { useCategorias, useToggleEstadoCategoria } from "./useCategorias"


export const useCategoriasManager = () => {
  const { data: categorias = [], isLoading, error } = useCategorias()
  const toggleEstadoMutation = useToggleEstadoCategoria()

  const toggleEstadoCategoria = (id) => {
    toggleEstadoMutation.mutate(id)
  }

  return {
    categorias,
    isLoading,
    error,
    toggleEstadoCategoria,
    isCambiandoEstado: toggleEstadoMutation.isPending
  }
}