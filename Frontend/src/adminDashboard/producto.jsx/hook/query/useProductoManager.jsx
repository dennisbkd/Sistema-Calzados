import { useEliminarProducto, useProducto, useToggleEstadoProducto } from './useProductoQuery'
import { useCategorias } from '../../../categoria/hooks/useCategorias'
import { useState } from 'react'

const useProductoManager = () => {
  const [procesoCambiando, setProcesoCambiando] = useState(false)
  const { data: productos = [], isLoading, isError } = useProducto()
  const { data: categorias = [] } = useCategorias()
  const toggleMutation = useToggleEstadoProducto()
  const eliminarMutation = useEliminarProducto()

  const categoriasActivas = categorias.filter(cat => cat.activo).map(
    (cat) => ({ value: cat.nombre, label: cat.nombre })
  )

  const toggleEstadoProducto = (id) => {
    setProcesoCambiando(id)
    toggleMutation.mutate(id, {
      onSettled: () => setProcesoCambiando(null)
    })
  }
  const eliminarProducto = (id) => {
    eliminarMutation.mutate(id)
  }

  return {
    productos,
    isLoading,
    isError,
    categoriasActivas,
    procesoCambiando,
    estaCambiandoProducto: toggleMutation.isPending,
    toggleEstadoProducto,
    eliminarProducto
  }
}

export default useProductoManager