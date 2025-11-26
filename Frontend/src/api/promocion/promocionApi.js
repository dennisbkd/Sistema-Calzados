import instancia from "../../../config/axios"


export const listarPromociones = async () => {
  const response = await instancia.get('/promociones/')
  return response.data
}

export const obtenerPromocion = async (id) => {
  const response = await instancia.get(`/promociones/obtener/${id}`)
  return response.data
}

export const crearPromocion = async (data) => {
  const response = await instancia.post('/promociones/crear', data)
  return response.data
}

export const actualizarPromocion = async (id, data) => {
  const response = await instancia.put(`/promociones/editar/${id}`, data)
  return response.data
}

export const eliminarPromocion = async (id) => {
  const response = await instancia.delete(`/promociones/eliminar/${id}`)
  return response.data
}

export const obtenerPromocionesActivas = async (productos) => {
  const response = await instancia.post('/promociones/activas', { productos })
  return response.data
}

export const toggleEstadoPromocion = async (id) => {
  const response = await instancia.patch(`/promociones/${id}/toggle-estado`)
  return response.data
}