import { useQuery } from "@tanstack/react-query"
import { obtenerHistorialNotasSalida } from "../../../api/inventario/historialNotasSalidaApi"

export const useHistorialNotasSalida = ({ pagina = 1, limite = 20 } = {}) => {
  return useQuery({
    queryKey: ['historialNotasSalida', { pagina, limite }],
    queryFn: () => obtenerHistorialNotasSalida({ pagina, limite }),
    staleTime: 5 * 60 * 1000
  })
}
