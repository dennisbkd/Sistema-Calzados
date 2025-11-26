import instancia from "../../../config/axios"

export const registrarNotaSalida = async (data) => {
  const response = await instancia.post('/inventario/nota-salida', data)
  return response.data
}
