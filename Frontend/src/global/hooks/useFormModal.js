// hooks/useFormModal.js
import { useState } from 'react'

export const useFormModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState)
  const [data, setData] = useState(null)

  const abrir = (datos = null) => {
    setData(datos)
    setIsOpen(true)
  }

  const cerrar = () => {
    setIsOpen(false)
    setData([])
  }

  return {
    isOpen,
    data,
    abrir,
    cerrar,
    setIsOpen
  }
}