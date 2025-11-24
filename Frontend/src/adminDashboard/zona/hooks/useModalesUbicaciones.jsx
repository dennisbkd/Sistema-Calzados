import { useState } from 'react'

export const useModalesUbicaciones = () => {
  const [modalAgregarAbierto, setModalAgregarAbierto] = useState(false)
  const [modalRemoverAbierto, setModalRemoverAbierto] = useState(false)
  const [modalCrearUbicacionAbierto, setModalCrearUbicacionAbierto] = useState(false)
  const [modalCrearZonaAbierto, setModalCrearZonaAbierto] = useState(false)
  const [ubicacionSeleccionada, setUbicacionSeleccionada] = useState(null)
  const [modalEliminarZonaAbierto, setModalEliminarZonaAbierto] = useState(false)
  const [modalEliminarUbicacionAbierto, setModalEliminarUbicacionAbierto] = useState(false)
  const [zonaSeleccionada, setZonaSeleccionada] = useState(null)

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

  const abrirModalEliminarZona = (zona) => {
    setZonaSeleccionada(zona)
    setModalEliminarZonaAbierto(true)
  }

  const abrirModalEliminarUbicacion = (ubicacion) => {
    setUbicacionSeleccionada(ubicacion)
    setModalEliminarUbicacionAbierto(true)
  }

  const cerrarModales = () => {
    setModalAgregarAbierto(false)
    setModalRemoverAbierto(false)
    setModalCrearUbicacionAbierto(false)
    setModalCrearZonaAbierto(false)
    setModalEliminarZonaAbierto(false)
    setModalEliminarUbicacionAbierto(false)
    setUbicacionSeleccionada(null)
    setZonaSeleccionada(null)
  }

  return {
    // Estados
    modalAgregarAbierto,
    modalRemoverAbierto,
    modalCrearUbicacionAbierto,
    modalCrearZonaAbierto,
    ubicacionSeleccionada,
    modalEliminarZonaAbierto,
    modalEliminarUbicacionAbierto,
    zonaSeleccionada,

    // Handlers
    abrirModalAgregar,
    abrirModalRemover,
    abrirModalCrearUbicacion,
    abrirModalCrearZona,
    abrirModalEliminarZona,
    abrirModalEliminarUbicacion,
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
    },
    modalEliminarZona: {
      abierto: modalEliminarZonaAbierto,
      cambiarEstado: () => setModalEliminarZonaAbierto(false),
      zona: zonaSeleccionada
    },
    modalEliminarUbicacion: {
      abierto: modalEliminarUbicacionAbierto,
      cambiarEstado: () => setModalEliminarUbicacionAbierto(false),
      ubicacion: ubicacionSeleccionada
    }
  }
}