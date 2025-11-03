import instancia from '../../../config/axios'

export const obtenerReporteIngresosEgresos = async (fechaInicio, fechaFin) => {
  const res = await instancia.get('/reportes/ingresos-egresos', {
    params: {
      fechaInicio,
      fechaFin
    }
  })
  return res.data
}

export const listarComprasFecha = async (fechaInicio, fechaFin) => {
  const res = await instancia.get('/reportes/listarComprasxFecha', {
    params: {
      fechaInicio,
      fechaFin
    }
  })
  return res.data
}

export const listarVentasFecha = async (fechaInicio, fechaFin) => {
  const res = await instancia.get('/reportes/listarVentasxFecha',{ params: { fechaInicio, fechaFin }})
  return res.data
}