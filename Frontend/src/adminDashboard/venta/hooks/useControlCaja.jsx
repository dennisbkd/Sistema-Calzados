import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { obtenerControlCaja } from '../../../api/venta/controlCajaApi'

export const useControlCaja = ({ fecha } = {}) => {
  const fechaConsulta = fecha ? dayjs(fecha).subtract(1, 'day').format('YYYY-MM-DD') : undefined
  return useQuery({
    queryKey: ['controlCaja', fecha],
    queryFn: () => obtenerControlCaja({ fecha: fechaConsulta }),
    staleTime: 5 * 60 * 1000
  })
}
