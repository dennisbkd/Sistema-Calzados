import { useMutation } from '@tanstack/react-query'
import { obtenerReporteIngresosEgresos, listarComprasFecha, listarVentasFecha } from '../../../../api/reporteIngresoEgreso/reporteIngresoEgresoApi.js'

export const useReportes = () => {
  const obtenerIngresosEgresos = useMutation({
    mutationFn: ({ fechaInicio, fechaFin }) => obtenerReporteIngresosEgresos(fechaInicio, fechaFin)
  })

  const listarPorFecha = useMutation({
    mutationFn: ({ fechaInicio, fechaFin }) => listarComprasFecha(fechaInicio, fechaFin)
  })

  const listarVentaPorFecha = useMutation ({
    mutationFn: ({ fechaInicio, fechaFin }) => listarVentasFecha(fechaInicio, fechaFin)
  })

  return {
    obtenerIngresosEgresos, listarPorFecha, listarVentaPorFecha
  }
}