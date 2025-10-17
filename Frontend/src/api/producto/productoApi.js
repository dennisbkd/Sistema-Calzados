import instancia from "../../../config/axios"

export const ObtenerProductos = async () => {
  const response = await instancia.get('/productos/listar')
  return response.data 
}
export const CrearProducto = async (data) => {
  const response = await instancia.post('/productos/crear', data)
  return response.data 
}
export const ActualizarProducto = async (id, data) => {
  console.log("API - ActualizarProducto", id, data)
  const response = await instancia.put(`/productos/actualizar/${id}`, data)
  return response.data 
}
export const ToggleEstadoProducto = async (id) => {
  const response = await instancia.patch(`/productos/estado/${id}`)
  return response.data 
}
export const EliminarProducto = async (id) => {
  const response = await instancia.delete(`/productos/eliminar/${id}`)
  return response.data 
}
