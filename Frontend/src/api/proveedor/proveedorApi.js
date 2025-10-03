import instancia from "../../../config/axios"

export const listar = async () => {
  const response = await instancia.get('/proveedores/listar')
  return response.data
}
export const obtener = async (id) => {
  const response = await instancia.get(`/proveedores/obtener/${id}`)
  return response.data
}
export const crear = async (data) => {
  const response = await instancia.post('/proveedores/crear', data)
  return response.data
}
export const actualizar = async (id, data) => {
  const response = await instancia.put(`/proveedores/actualizar/${id}`, data)
  return response.data
}
export const eliminar = async (id) => {
  const response = await instancia.delete(`/proveedores/eliminar/${id}`)
  return response.data
}
export const toggleEstado = async (id) => {
  const response = await instancia.patch(`/proveedores/toggle-estado/${id}`)
  return response.data
}
