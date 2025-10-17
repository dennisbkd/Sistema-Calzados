import { useState } from 'react'
import { useEliminarVariante, useToggleEstadoVariante } from './useVarianteQuery'

export const useVarianteManager = () => {
  const [varianteEnProceso, setVarianteEnProceso] = useState(null)
  const toggleEstadoVarianteMutation = useToggleEstadoVariante()
  const eliminarVarianteMutation = useEliminarVariante()

  const cambiarEstadoVariante = (id) => {
    setVarianteEnProceso(id)
    toggleEstadoVarianteMutation.mutate(id, {
      onSettled: () => setVarianteEnProceso(null)
    })
  }

  const eliminarVariante = (id) => {
    setVarianteEnProceso(id)
    eliminarVarianteMutation.mutate(id, {
      onSettled: () => setVarianteEnProceso(null)
    })
  }


  return {
    varianteEnProceso,
    cambiarEstadoVariante,
    estaCambiandoEstado: toggleEstadoVarianteMutation.isPending || eliminarVarianteMutation.isPending,
    eliminarVariante,
  }
}
