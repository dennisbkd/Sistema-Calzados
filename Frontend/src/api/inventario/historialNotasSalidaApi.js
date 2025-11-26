import instancia from "../../../config/axios"

export const obtenerHistorialNotasSalida = async ({ pagina = 1, limite = 20 } = {}) => {
  const response = await instancia.get('/inventario/nota-salida/registros', {
    params: { pagina, limite }
  })
  return response.data
}
