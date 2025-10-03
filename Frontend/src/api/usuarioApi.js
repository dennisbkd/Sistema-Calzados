import instancia from "../../config/axios"

export const listar = async () => {
  const response = await instancia.get('/usuario/listar')
  return response.data
}

export const obtener = async (id) => {
  const response = await instancia.get(`/usuario/${id}`)
  return response.data
}

export const crear = async (data) => {
  console.log(data)
  const response = await instancia.post('/usuario/crear',data)
  return response.data
}

export const actualizar = async (id,data) => {
  const response = await instancia.put(`/usuario/editar/${id}`,data)
  return response.data
}

export const toggleEstado = async (id,data) => {
  const response = await instancia.put(`/usuario/editar/${id}`,{activo:data})
  return response.data
}

export const actualizarRoles = async (id,roles) => {
  console.log('api',id,roles)
  const response = await instancia.put(`/usuario/roles/${id}`,roles)
  return response.data
}
