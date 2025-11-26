import { useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { obtenerResumenCajaDiaria, obtenerResumenHoy, obtenerMovimientosPorRango } from '../../../api/caja/cajaDiaria'

// Hook para obtener resumen de caja por fecha específica
export const useResumenCajaDiaria = (fecha) => {
  return useQuery({
    queryKey: ['caja-diaria', 'resumen', fecha],
    queryFn: () => obtenerResumenCajaDiaria(fecha),
    enabled: !!fecha,
    staleTime: 2 * 60 * 1000, // 2 minutos
    retry: 2
  })
}

// Hook para obtener resumen de caja del día actual
export const useResumenHoy = () => {
  return useQuery({
    queryKey: ['caja-diaria', 'resumen-hoy'],
    queryFn: obtenerResumenHoy,
    staleTime: 2 * 60 * 1000, // 2 minutos
    refetchInterval: 5 * 60 * 1000, // Refrescar cada 5 minutos
    retry: 2
  })
}

// Hook para obtener movimientos por rango de fechas
export const useMovimientosPorRango = (fechaInicio, fechaFin) => {
  return useQuery({
    queryKey: ['caja-diaria', 'movimientos', fechaInicio, fechaFin],
    queryFn: () => obtenerMovimientosPorRango(fechaInicio, fechaFin),
    enabled: !!fechaInicio && !!fechaFin,
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 2
  })
}

// Hook para invalidar queries de caja diaria
export const useInvalidarCajaDiaria = () => {
  const queryClient = useQueryClient()

  const invalidarQueries = () => {
    queryClient.invalidateQueries({ queryKey: ['caja-diaria'] })
    toast.success('Datos de caja actualizados')
  }

  return { invalidarQueries }
}