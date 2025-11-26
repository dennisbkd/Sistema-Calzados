import instancia from "../../../config/axios"

export const obtenerControlCaja = async ({ fecha } = {}) => {
  const response = await instancia.get('/ventas/control-caja', {
    params: fecha ? { fecha } : {}
  })
  return response.data
}
