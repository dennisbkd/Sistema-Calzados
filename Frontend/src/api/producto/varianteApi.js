import instancia from "../../../config/axios"

export const ToggleEstadoVariante = async (id) => {
  const response = await instancia.patch(`/variantes/estado/${id}`)
  return response.data
}
export const CrearVariante = async (data) => {
  const response = await instancia.post('/variantes/crear', data)
  return response.data 
}
export const ActualizarVariante = async (id, data) => {
  console.log("API ActualizarVariante:","ID:" ,id,"data:", data)
  const response = await instancia.put(`/variantes/actualizar/${id}`, data)
  return response.data 
}
export const EliminarVariante = async (id) => {
  const response = await instancia.delete(`/variantes/eliminar/${id}`)
  return response.data 
}