import React from 'react'
import { useEliminarProducto, useProducto, useToggleEstadoProducto } from './useProductoQuery'
import { useCategorias } from '../../../categoria/hooks/useCategorias'

const useProductoManager = () => {
  const { data: productos = [], isLoading, isError } = useProducto()
  const { data: categorias = [] } = useCategorias()
  const toggleMutation = useToggleEstadoProducto()
  const eliminarMutation = useEliminarProducto()

  const categoriasActivas = categorias.filter(cat => cat.activo).map(
    (cat) => ({ value: cat.nombre, label: cat.nombre })
  )

  const toggleEstadoProducto = (id) => {
    toggleMutation.mutate(id)
  }
  const eliminarProducto = (id) => {
    eliminarMutation.mutate(id)
  }

  return {
    productos,
    isLoading,
    isError,
    categoriasActivas,
    toggleEstadoProducto,
    eliminarProducto
  }
}

export default useProductoManager