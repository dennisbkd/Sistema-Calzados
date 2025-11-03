import { useMutation } from '@tanstack/react-query'
import { obtenerReporteIngresosEgresos, listarComprasFecha, listarVentasFecha } from '../../../../api/reporteIngresoEgreso/reporteIngresoEgresoApi.js'
import toast from 'react-hot-toast'

export const useReportes = () => {
  const obtenerIngresosEgresos = useMutation({
    mutationFn: ({ fechaInicio, fechaFin }) => obtenerReporteIngresosEgresos(fechaInicio, fechaFin),
    onError: (error) => {
      toast.error(`Error al generar el reporte: ${error.message}`)
    }
  })

  const listarPorFecha = useMutation({
    mutationFn: ({ fechaInicio, fechaFin }) => listarComprasFecha(fechaInicio, fechaFin),
    onError: (error) => {
      toast.error(`Error al listar compras por fecha: ${error.message}`)
    }
  })

  const listarVentaPorFecha = useMutation ({
    mutationFn: ({ fechaInicio, fechaFin }) => listarVentasFecha(fechaInicio, fechaFin),
    onError: (error) => {
      toast.error(`Error al listar ventas por fecha: , ${error.message}`)
    }
  })

  return {
    obtenerIngresosEgresos, listarPorFecha, listarVentaPorFecha
  }
}