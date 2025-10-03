import { useFormModal } from '../../../global/hooks/useFormModal'
import { useMemo } from 'react'
import { useCrearCategoria, useActualizarCategoria } from './useCategorias'

export const useCategoriaForm = () => {
  const modal = useFormModal()
  const crearMutation = useCrearCategoria()
  const actualizarMutation = useActualizarCategoria()

  const guardarCategoria = async (datos) => {
    console.log('💾 Guardando categoría con datos:', datos)
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
      console.error('❌ Error guardando categoría:', error)
      throw error
    }
  }

  const formConfig = useMemo(() => ({
    defaultValues: {
      nombre: modal.data?.nombre || '',
      descripcion: modal.data?.descripcion || '',
      genero: modal.data?.genero || '',
      activo: modal.data?.activo ?? true
    }
  }), [modal.data])

  return {
    modal,
    guardarCategoria,
    formConfig,
    isLoading: crearMutation.isPending || actualizarMutation.isPending
  }
}