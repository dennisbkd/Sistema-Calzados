import instancia from "../../../config/axios"

export const listar = async () => {
  const response = await instancia.get('/categorias/listar')
  return response.data
}
export const obtener = async (id) => {
  const response = await instancia.get(`/categorias/obtener/${id}`)
  return response.data
}
export const crear = async (data) => {
  const response = await instancia.post('/categorias/crear', data)
  return response.data
}
export const actualizar = async (id, data) => {
  const response = await instancia.put(`/categorias/actualizar/${id}`, data)
  return response.data
}
export const toggleEstado = async (id) => {
  const response = await instancia.patch(`/categorias/toggle-estado/${id}`)
  return response.data
}
export const eliminar = async (id) => {
  const response = await instancia.delete(`/categorias/eliminar/${id}`)
  return response.data
}