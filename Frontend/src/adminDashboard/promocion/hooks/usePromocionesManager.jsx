// hooks/usePromocionesManager.js
import { useState } from 'react'
import { usePromociones, useEliminarPromocion, useToggleEstadoPromocion } from './usePromocionesQueries'

export const usePromocionesManager = () => {
  const {
    data: promocionesData,
    isLoading,
    error,
    refetch
  } = usePromociones()

  const { mutate: eliminarPromocion, isPending: isEliminando } = useEliminarPromocion()
  const { mutate: toggleEstado, isPending: isCambiandoEstado } = useToggleEstadoPromocion()

  const [filtros, setFiltros] = useState({
    searchTerm: '',
    filtroEstado: 'todos',
    filtroTipo: 'todos'
  })

  const promociones = promocionesData?.error ? [] : (promocionesData || [])

  // Filtrar promociones
  const promocionesFiltradas = promociones.filter(promocion => {
    const coincideBusqueda = promocion.nombre
      .toLowerCase()
      .includes(filtros.searchTerm.toLowerCase()) ||
      promocion.descripcion?.toLowerCase()
        .includes(filtros.searchTerm.toLowerCase())

    const coincideEstado = filtros.filtroEstado === 'todos' ||
      (filtros.filtroEstado === 'activas' && promocion.estado === 'ACTIVA') ||
      (filtros.filtroEstado === 'inactivas' && promocion.estado !== 'ACTIVA')

    const coincideTipo = filtros.filtroTipo === 'todos' ||
      promocion.tipo === filtros.filtroTipo

    return coincideBusqueda && coincideEstado && coincideTipo
  })

  const handleEliminarPromocion = (id) => {
    eliminarPromocion(id)
  }

  const handleToggleEstado = (id) => {
    toggleEstado(id)
  }

  const actualizarFiltro = (campo, valor) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor
    }))
  }

  return {
    // Datos
    promociones: promocionesFiltradas,
    promocionesTotales: promociones,

    // Estados
    filtros,
    isLoading,
    isEliminando,
    isCambiandoEstado,
    error,

    // Handlers
    handleEliminarPromocion,
    handleToggleEstado,
    actualizarFiltro,
    refetch
  }
}