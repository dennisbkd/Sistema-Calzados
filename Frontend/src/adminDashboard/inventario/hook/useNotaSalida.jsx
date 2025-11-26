import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { registrarNotaSalida } from '../../../api/inventario/notaSalidaApi'

export const useRegistrarNotaSalida = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload) => registrarNotaSalida(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries(['productos'])
      toast.success(data?.mensaje || 'Nota de salida registrada con éxito')
    },
    onError: (error) => {
      const mensaje = error?.response?.data?.error || 'No se pudo registrar la nota de salida'
      toast.error(mensaje)
    }
  })
}
