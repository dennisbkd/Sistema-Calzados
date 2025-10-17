import { useMemo } from 'react'
import { useFormModal } from '../../../global/hooks/useFormModal'
import { useActualizarVariante, useCrearVariante } from './query/useVarianteQuery'

export const useFormVariante = () => {
  const modal = useFormModal()
  const actualizarVarianteMutation = useActualizarVariante()
  const crearVarianteMutation = useCrearVariante()

  const guardarVariante = (data) => {
    // Extraer la información correctamente
    const productoId = modal.data?.productoId
    const varianteData = modal.data?.varianteData

    if (modal.data) {
      if (varianteData && varianteData.id) {
        // Estamos editando una variante existente
        console.log("Editando variante:", {
          ...data,
          id: varianteData.id,
          productoId: productoId
        })
        actualizarVarianteMutation.mutate({
          id: varianteData.id, data: {
            ...data,
            productoId: productoId
          }
        })
      } else {
        // Estamos creando una nueva variante
        crearVarianteMutation.mutate({
          ...data,
          productoId: productoId
        })
      }
      modal.cerrar()
    }
  }

  const formConfigVariante = useMemo(() => {
    // Manejar la estructura anidada correctamente
    let varianteData = modal.data?.varianteData

    // Si varianteData tiene otra varianteData anidada, usar esa
    if (varianteData && varianteData.varianteData) {
      varianteData = varianteData.varianteData
    }

    return {
      defaultValues: {
        productoId: modal.data?.productoId || null,
        talla: varianteData?.talla || 0,
        color: varianteData?.color || '',
        codigo: varianteData?.codigo || '',
        precioCompra: varianteData?.precioCompra || 0,
        precioVenta: varianteData?.precioVenta || 0,
        stockActual: varianteData?.stockActual || 0,
        stockMinimo: varianteData?.stockMinimo || 0,
        activo: varianteData?.activo !== undefined ? varianteData.activo : true
      }
    }
  }, [modal.data])

  return {
    modal,
    guardarVariante,
    formConfigVariante
  }
}