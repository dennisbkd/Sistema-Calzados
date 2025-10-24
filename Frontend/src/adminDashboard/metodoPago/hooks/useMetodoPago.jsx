import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import {
  getMetodosPago,
  getMetodoPagoById,
  createMetodoPago,
  updateMetodoPago,
  toggleMetodoPago,
  deleteMetodoPago
} from '../../../api/pago/metodoPagoApi'

export const useMetodosPago = () => {
  return useQuery({
    queryKey: ['metodosPago'],
    queryFn: getMetodosPago,
    staleTime: 5 * 60 * 1000,
  })
}

export const useToggleEstadoMetodoPago = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id) => toggleMetodoPago(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['metodosPago'])
      toast.success('Estado del método de pago actualizado')
    },
    onError: (error) => {
      toast.error('Error al cambiar el estado')
      console.error('Error cambiando estado método de pago:', error)
    },
  })
}

export default function useMetodoPago() {
  const { data: items = [], isLoading: loading, error } = useMetodosPago()
  const toggleMutation = useToggleEstadoMetodoPago()

  return {
    items,
    loading,
    error,
    toggle: (id) => toggleMutation.mutateAsync(id),
  }
}