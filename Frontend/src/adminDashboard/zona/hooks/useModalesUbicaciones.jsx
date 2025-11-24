import { useState } from 'react'

export const useModalesUbicaciones = () => {
  const [modalAgregarAbierto, setModalAgregarAbierto] = useState(false)
  const [modalRemoverAbierto, setModalRemoverAbierto] = useState(false)
  const [modalCrearUbicacionAbierto, setModalCrearUbicacionAbierto] = useState(false)
  const [modalCrearZonaAbierto, setModalCrearZonaAbierto] = useState(false)
  const [ubicacionSeleccionada, setUbicacionSeleccionada] = useState(null)

  const abrirModalAgregar = (ubicacion) => {
    setUbicacionSeleccionada(ubicacion)
    setModalAgregarAbierto(true)
  }

  const abrirModalRemover = (ubicacion) => {
    setUbicacionSeleccionada(ubicacion)
    setModalRemoverAbierto(true)
  }

  const abrirModalCrearUbicacion = () => {
    setModalCrearUbicacionAbierto(true)
  }

  const abrirModalCrearZona = () => {
    setModalCrearZonaAbierto(true)
  }

  const cerrarModales = () => {
    setModalAgregarAbierto(false)
    setModalRemoverAbierto(false)
    setModalCrearUbicacionAbierto(false)
    setModalCrearZonaAbierto(false)
    setUbicacionSeleccionada(null)
  }

  return {
    // Estados
    modalAgregarAbierto,
    modalRemoverAbierto,
    modalCrearUbicacionAbierto,
    modalCrearZonaAbierto,
    ubicacionSeleccionada,

    // Handlers
    abrirModalAgregar,
    abrirModalRemover,
    abrirModalCrearUbicacion,
    abrirModalCrearZona,
    cerrarModales,

    // Para pasar a los componentes
    modalAgregar: {
      abierto: modalAgregarAbierto,
      cambiarEstado: () => setModalAgregarAbierto(false),
      ubicacion: ubicacionSeleccionada
    },
    modalRemover: {
      abierto: modalRemoverAbierto,
      cambiarEstado: () => setModalRemoverAbierto(false),
      ubicacion: ubicacionSeleccionada
    },
    modalCrearUbicacion: {
      abierto: modalCrearUbicacionAbierto,
      cambiarEstado: () => setModalCrearUbicacionAbierto(false)
    },
    modalCrearZona: {
      abierto: modalCrearZonaAbierto,
      cambiarEstado: () => setModalCrearZonaAbierto(false)
    }
  }
}