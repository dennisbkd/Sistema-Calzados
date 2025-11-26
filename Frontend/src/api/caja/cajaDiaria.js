import instancia from "../../../config/axios"


export const obtenerResumenCajaDiaria = async (fecha) => {
  const response = await instancia.get('/caja/resumen', {
    params: { fecha }
  })
  return response.data
}

export const obtenerResumenHoy = async () => {
  const response = await instancia.get('/caja/resumen-hoy')
  return response.data
}

export const obtenerMovimientosPorRango = async (fechaInicio, fechaFin) => {
  const response = await instancia.get('/caja/movimientos', {
    params: { fechaInicio, fechaFin }
  })
  return response.data
}