import { useFormModal } from '../../../global/hooks/useFormModal'
import { useMemo } from 'react'
import { useCrearProveedor, useActualizarProveedor } from './useProveedores'

export const useProveedorForm = () => {
  const modal = useFormModal()
  const crearMutation = useCrearProveedor()
  const actualizarMutation = useActualizarProveedor()

  const guardarProveedor = async (datos) => {
    console.log('💾 Guardando proveedor con datos:', datos)
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
      console.error('❌ Error guardando proveedor:', error)
      throw error
    }
  }

  const formConfig = useMemo(() => ({
    defaultValues: {
      nombre: modal.data?.nombre || '',
      contacto: modal.data?.contacto || '',
      telefono: modal.data?.telefono || '',
      direccion: modal.data?.direccion || '',
      activo: modal.data?.activo ?? true
    }
  }), [modal.data])

  return {
    modal,
    guardarProveedor,
    formConfig,
    isLoading: crearMutation.isPending || actualizarMutation.isPending
  }
}