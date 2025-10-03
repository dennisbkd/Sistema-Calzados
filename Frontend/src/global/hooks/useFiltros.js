
import { useState } from 'react'

export const useFiltros = (opcionesIniciales = {}) => {
  const [filtros, setFiltros] = useState({
    searchTerm: '',
    filtroEstado: 'todos',
    ...opcionesIniciales
  })
  const [menuFiltrosAbierto, setMenuFiltrosAbierto] = useState(false)

  const actualizarFiltro = (key, value) => {
    setFiltros(prev => ({ ...prev, [key]: value }))
  }

  const toggleMenuFiltros = () => {
    setMenuFiltrosAbierto(prev => !prev)
  }

  return {
    filtros,
    menuFiltrosAbierto,
    actualizarFiltro,
    toggleMenuFiltros,
    setFiltros
  }
}