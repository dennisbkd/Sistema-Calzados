// hooks/useBitacora.js
import { useQuery } from '@tanstack/react-query'
import { bitacoraApi } from '../../../api/bitacora/bitacoraApi'

export const useBitacora = {
  // Hook para usuarios activos
  useUsuariosActivos: (filtros = {}) => {
    return useQuery({
      queryKey: ['bitacora', 'usuarios-activos', filtros],
      queryFn: () => bitacoraApi.obtenerUsuariosActivos(filtros),
      staleTime: 5 * 60 * 1000, // 5 minutos
      retry: 2
    })
  },

  // Hook para detalles de usuario
  useDetallesUsuario: (usuarioId, filtros = {}) => {
    return useQuery({
      queryKey: ['bitacora', 'usuario', usuarioId, filtros],
      queryFn: () => bitacoraApi.obtenerDetallesUsuario(usuarioId, filtros),
      enabled: !!usuarioId, // Solo ejecutar si hay usuarioId
      staleTime: 2 * 60 * 1000, // 2 minutos
      retry: 2
    })
  },

  // Hook para búsqueda
  useBusquedaBitacora: (termino, filtros = {}) => {
    return useQuery({
      queryKey: ['bitacora', 'buscar', termino, filtros],
      queryFn: () => bitacoraApi.buscarBitacora(termino, filtros),
      enabled: !!termino && termino.length >= 2, // Solo buscar con 2+ caracteres
      staleTime: 1 * 60 * 1000, // 1 minuto
      retry: 1
    })
  },

  // Hook para estadísticas
  useEstadisticas: (filtros = {}) => {
    return useQuery({
      queryKey: ['bitacora', 'estadisticas', filtros],
      queryFn: () => bitacoraApi.obtenerEstadisticas(filtros),
      staleTime: 10 * 60 * 1000, // 10 minutos
      retry: 1
    })
  },
  // hooks/useBitacora.js - NUEVO HOOK
  // Hook para estadísticas completas
  useEstadisticasCompletas: (filtros = {}) => {
    return useQuery({
      queryKey: ['bitacora', 'estadisticas-completas', filtros],
      queryFn: () => bitacoraApi.obtenerEstadisticasCompletas(filtros),
      staleTime: 10 * 60 * 1000, // 10 minutos
      retry: 1
    })
  }
}