import { useFormModal } from '../../../global/hooks/useFormModal'
import { useMemo } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { createMetodoPago, updateMetodoPago } from '../../../api/pago/metodoPagoApi'

export const useMetodoPagoForm = () => {
  const modal = useFormModal()
  const queryClient = useQueryClient()

  const crearMutation = useMutation({
    mutationFn: (data) => createMetodoPago(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['metodosPago'])
      toast.success('Método de pago creado correctamente')
      modal.cerrar()
    },
    onError: (error) => {
      toast.error('Error al crear el método de pago')
      console.error('Error creando método de pago:', error)
    },
  })

  const actualizarMutation = useMutation({
    mutationFn: ({ id, data }) => updateMetodoPago(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['metodosPago'])
      queryClient.invalidateQueries(['metodosPago', variables.id])
      toast.success('Método de pago actualizado correctamente')
      modal.cerrar()
    },
    onError: (error) => {
      toast.error('Error al actualizar el método de pago')
      console.error('Error actualizando método de pago:', error)
    },
  })

  const guardarMetodoPago = async (datos) => {
    console.log('💾 Guardando método de pago con datos:', datos)
    try {
      if (modal.data) {
        await actualizarMutation.mutateAsync({
          id: modal.data.id,
          data: datos
        })
      } else {
        await crearMutation.mutateAsync(datos)
      }
    } catch (error) {
      console.error('❌ Error guardando método de pago:', error)
      throw error
    }
  }

  const formConfig = useMemo(() => ({
    defaultValues: {
      nombre: modal.data?.nombre || '',
      descripcion: modal.data?.descripcion || '',
      activo: modal.data?.activo ?? true
    }
  }), [modal.data])

  return {
    modal,
    guardarMetodoPago,
    formConfig,
    isLoading: crearMutation.isPending || actualizarMutation.isPending
  }
}