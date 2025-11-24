import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { actualizarLayoutZona, actualizarZonaCompleta, agregarVariantesUbicacion, crearUbicacion, crearZona, eliminarUbicacion, eliminarZona, listarZonas, obtenerUbicacionesPorZona, obtenerVariantesDisponibles, obtenerVariantesEnUbicacion, removerVariantesUbicacion } from '../../../api/producto/zonaApi'


// Hook para listar todas las zonas
export const useZonas = () => {
  return useQuery({
    queryKey: ['zonas'],
    queryFn: listarZonas,
    staleTime: 5 * 60 * 1000,
  })
}

// Hook para obtener ubicaciones de una zona específica
export const useUbicacionesPorZona = (zonaId) => {
  return useQuery({
    queryKey: ['ubicaciones', 'zona', zonaId],
    queryFn: () => obtenerUbicacionesPorZona(zonaId),
    enabled: !!zonaId,
    staleTime: 2 * 60 * 1000,
  })
}

// Hook para agregar variantes a una ubicación
export const useAgregarVariantesUbicacion = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ ubicacionId, variantes }) =>
      agregarVariantesUbicacion(ubicacionId, variantes),
    onSuccess: () => {
      // Invalidar las queries de ubicaciones para esa zona
      queryClient.invalidateQueries({
        queryKey: ['ubicaciones', 'zona']
      })
      toast.success('Variantes agregadas correctamente')
    },
    onError: (error) => {
      toast.error('Error al agregar variantes')
      console.error('Error agregando variantes:', error)
    },
  })
}

// Hook para remover variantes de una ubicación
export const useRemoverVariantesUbicacion = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ ubicacionId, variantesIds }) =>
      removerVariantesUbicacion(ubicacionId, variantesIds),
    onSuccess: () => {
      // Invalidar las queries de ubicaciones para esa zona
      queryClient.invalidateQueries({
        queryKey: ['ubicaciones', 'zona']
      })
      toast.success('Variantes removidas correctamente')
    },
    onError: (error) => {
      toast.error('Error al remover variantes')
      console.error('Error removiendo variantes:', error)
    },
  })
}

export const useVariantesDisponibles = (ubicacionId, searchTerm = '') => {
  return useQuery({
    queryKey: ['variantes-disponibles', ubicacionId, searchTerm],
    queryFn: () => obtenerVariantesDisponibles(ubicacionId, searchTerm),
    enabled: !!ubicacionId,
    staleTime: 2 * 60 * 1000,
  })
}

// Hook para obtener variantes en una ubicación
export const useVariantesEnUbicacion = (ubicacionId, searchTerm = '') => {
  return useQuery({
    queryKey: ['variantes-ubicacion', ubicacionId, searchTerm],
    queryFn: () => obtenerVariantesEnUbicacion(ubicacionId, searchTerm),
    enabled: !!ubicacionId,
    staleTime: 2 * 60 * 1000,
  })
}

// Hook para crear nueva zona
export const useCrearZona = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => crearZona(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['zonas'])
      toast.success('Zona creada correctamente')
    },
    onError: (error) => {
      toast.error(`Error creando zona: ${error.response?.data?.error || error.message}`);
    }
  })
}

// Hook para crear nueva ubicación
export const useCrearUbicacion = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => crearUbicacion(data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['ubicaciones', 'zona', variables.zonaBodegaId])
      queryClient.invalidateQueries(['zonas'])
      toast.success('Ubicación creada correctamente')
    },
    onError: (error) => {
      toast.error(`Error creando ubicación: ${error.response?.data?.error || error.message}`);
      console.error('Error creando ubicación:', error)
    },
  })
}

export const useActualizarLayoutZona = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ zonaId, layoutConfig }) =>
      actualizarLayoutZona(zonaId, layoutConfig),
    onSuccess: () => {
      queryClient.invalidateQueries(['zonas'])
      toast.success('Layout actualizado correctamente')
    },
    onError: (error) => {
      toast.error('Error al actualizar el layout')
      console.error('Error actualizando layout:', error)
    },
  })
}

// En useZonas.js - agregar este hook
export const useActualizarZonaCompleta = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ zonaId, data }) =>
      actualizarZonaCompleta(zonaId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['zonas'])
      toast.success('Zona actualizada correctamente')
    },
    onError: (error) => {
      toast.error('Error al actualizar la zona')
      console.error('Error actualizando zona:', error)
    },
  })
}

export const useEliminarZona = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ zonaId, forzado = false }) =>
      eliminarZona(zonaId, forzado),
    onSuccess: () => {
      queryClient.invalidateQueries(['zonas'])
      toast.success('Zona eliminada correctamente')
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Error al eliminar la zona')
      console.error('Error eliminando zona:', error)
    },
  })
}

export const useEliminarUbicacion = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ubicacionId) => eliminarUbicacion(ubicacionId),
    onSuccess: () => {
      queryClient.invalidateQueries(['ubicaciones', 'zona'])
      queryClient.invalidateQueries(['zonas'])
      toast.success('Ubicación eliminada correctamente')
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Error al eliminar la ubicación')
      console.error('Error eliminando ubicación:', error)
    },
  })
}