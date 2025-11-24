import { useState } from 'react'
import { useAgregarVariantesUbicacion, useRemoverVariantesUbicacion, useUbicacionesPorZona, useZonas } from './useZonas'


export const useUbicacionesManager = () => {
  const [zonaSeleccionada, setZonaSeleccionada] = useState(null)
  const [ubicacionSeleccionada, setUbicacionSeleccionada] = useState(null)

  // Queries
  const {
    data: zonasData,
    isLoading: isLoadingZonas,
    error: errorZonas
  } = useZonas()

  const {
    data: ubicacionesData,
    isLoading: isLoadingUbicaciones,
    error: errorUbicaciones,
    refetch: refetchUbicaciones
  } = useUbicacionesPorZona(zonaSeleccionada)

  // Mutations
  const {
    mutate: agregarVariantes,
    isPending: isAgregandoVariantes
  } = useAgregarVariantesUbicacion()

  const {
    mutate: removerVariantes,
    isPending: isRemoviendoVariantes
  } = useRemoverVariantesUbicacion()

  // Datos procesados
  const zonas = zonasData?.error ? [] : (zonasData || [])
  const ubicaciones = ubicacionesData?.error ? [] : (ubicacionesData || [])

  // Handlers
  const seleccionarZona = (zonaId) => {
    setZonaSeleccionada(zonaId)
    setUbicacionSeleccionada(null)
  }

  const seleccionarUbicacion = (ubicacionId) => {
    setUbicacionSeleccionada(ubicacionId)
  }

  const handleAgregarVariantes = (ubicacionId, variantes) => {
    agregarVariantes({ ubicacionId, variantes })
    
  }

  const handleRemoverVariantes = (ubicacionId, variantesIds) => {
    removerVariantes({ ubicacionId, variantesIds })
  }

  return {
    // Estado
    zonaSeleccionada,
    ubicacionSeleccionada,

    // Datos
    zonas,
    ubicaciones,

    // Loading states
    isLoadingZonas,
    isLoadingUbicaciones,
    isAgregandoVariantes,
    isRemoviendoVariantes,
    isPending: isAgregandoVariantes || isRemoviendoVariantes,

    // Errors
    errorZonas,
    errorUbicaciones,

    // Handlers
    seleccionarZona,
    seleccionarUbicacion,
    handleAgregarVariantes,
    handleRemoverVariantes,
    refetchUbicaciones
  }
}