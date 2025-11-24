import instancia from "../../../config/axios"

export const listarZonas = async () => {
  const response = await instancia.get('/zonas/listar')
  return response.data
}

export const obtenerUbicacionesPorZona = async (zonaId) => {
  console.log('zonaId en API:', zonaId)
  const response = await instancia.get(`/zonas/${zonaId}/ubicaciones`)
  return response.data
}

export const agregarVariantesUbicacion = async (ubicacionId, variantes) => {
  const response = await instancia.post(`/zonas/ubicaciones/${ubicacionId}/variantes`, {
    variantes
  })
  return response.data
}

export const removerVariantesUbicacion = async (ubicacionId, variantesIds) => {
  const response = await instancia.delete(`/zonas/ubicaciones/${ubicacionId}/variantes`, {
    data: { variantesIds }
  })
  return response.data
}

export const obtenerVariantesDisponibles = async (ubicacionId, search = '') => {
  const response = await instancia.get(`/zonas/ubicaciones/${ubicacionId}/variantes-disponibles`, {
    params: { search }
  })
  return response.data
}

export const obtenerVariantesEnUbicacion = async (ubicacionId, search = '') => {
  const response = await instancia.get(`/zonas/ubicaciones/${ubicacionId}/variantes`, {
    params: { search }
  })
  return response.data
}

export const crearZona = async (data) => {
  const response = await instancia.post('/zonas/crear', data)
  return response.data
}

export const crearUbicacion = async (data) => {
  const response = await instancia.post('/zonas/crear-ubicacion', data)
  return response.data
}