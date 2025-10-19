import instancia from "../../../config/axios"

export const bitacoraApi = {
  // Obtener resumen de usuarios activos
  obtenerUsuariosActivos: async (filtros = {}) => {
    const { fechaInicio, fechaFin, pagina = 1, limite = 20 } = filtros
    const params = new URLSearchParams()
    
    if (fechaInicio) params.append('fechaInicio', fechaInicio)
    if (fechaFin) params.append('fechaFin', fechaFin)
    params.append('pagina', pagina)
    params.append('limite', limite)
    
    const response = await instancia.get(`/bitacora/usuarios-activos?${params}`)
    return response.data
  },

  // Obtener detalles de un usuario específico
  obtenerDetallesUsuario: async (usuarioId, filtros = {}) => {
    const { fechaInicio, fechaFin, tabla, pagina = 1, limite = 50 } = filtros
    const params = new URLSearchParams()
    
    if (fechaInicio) params.append('fechaInicio', fechaInicio)
    if (fechaFin) params.append('fechaFin', fechaFin)
    if (tabla) params.append('tabla', tabla)
    params.append('pagina', pagina)
    params.append('limite', limite)
    
    const response = await instancia.get(`/bitacora/usuario/${usuarioId}?${params}`)
    return response.data
  },

  // Buscar en bitácora
  buscarBitacora: async (termino, filtros = {}) => {
    const { fechaInicio, fechaFin, limite = 50 } = filtros
    const params = new URLSearchParams({ termino, limite })
    
    if (fechaInicio) params.append('fechaInicio', fechaInicio)
    if (fechaFin) params.append('fechaFin', fechaFin)
    
    const response = await instancia.get(`/bitacora/buscar?${params}`)
    return response.data
  },

  // Obtener estadísticas
  obtenerEstadisticas: async (filtros = {}) => {
    const { fechaInicio, fechaFin } = filtros
    const params = new URLSearchParams()
    
    if (fechaInicio) params.append('fechaInicio', fechaInicio)
    if (fechaFin) params.append('fechaFin', fechaFin)
    
    const response = await instancia.get(`/bitacora/estadisticas?${params}`)
    return response.data
  },

  // Obtener estadísticas completas
  obtenerEstadisticasCompletas: async (filtros = {}) => {
    const { fechaInicio, fechaFin } = filtros
    const params = new URLSearchParams()

    if (fechaInicio) params.append('fechaInicio', fechaInicio)
    if (fechaFin) params.append('fechaFin', fechaFin)

    const response = await instancia.get(`/bitacora/estadisticas-completas?${params}`)
    return response.data
  }
}