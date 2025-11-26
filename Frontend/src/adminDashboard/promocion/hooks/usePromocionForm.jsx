// hooks/usePromocionForm.js
import { useState, useEffect } from 'react'
import { useCrearPromocion, useActualizarPromocion } from './usePromocionesQueries'

export const usePromocionForm = (promocionExistente = null) => {
  const crearMutation = useCrearPromocion()
  const actualizarMutation = useActualizarPromocion()

  const isEdit = !!promocionExistente
  const mutation = isEdit ? actualizarMutation : crearMutation
  const isLoading = mutation.isLoading

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    tipo: 'PORCENTAJE',
    valorDescuento: 0,
    fechaInicio: '',
    fechaFin: '',
    aplicaTodo: false,
    aplicaCategoria: false,
    categoriaId: '',
    aplicaProducto: false,
    productoId: ''
  })

  const [errores, setErrores] = useState({})

  // Inicializar formulario cuando hay una promoción existente
  useEffect(() => {
    if (promocionExistente) {
      setFormData({
        nombre: promocionExistente.nombre || '',
        descripcion: promocionExistente.descripcion || '',
        tipo: promocionExistente.tipo || 'PORCENTAJE',
        valorDescuento: promocionExistente.valorDescuento || 0,
        fechaInicio: promocionExistente.fechaInicio || '',
        fechaFin: promocionExistente.fechaFin || '',
        aplicaTodo: promocionExistente.aplicaTodo || false,
        aplicaCategoria: promocionExistente.aplicaCategoria || false,
        categoriaId: promocionExistente.categoriaId || '',
        aplicaProducto: promocionExistente.aplicaProducto || false,
        productoId: promocionExistente.productoId || ''
      })
    }
  }, [promocionExistente])

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Limpiar error del campo cuando se modifica
    if (errores[field]) {
      setErrores(prev => ({
        ...prev,
        [field]: null
      }))
    }
  }

  const handleAplicacionChange = (tipo) => {
    setFormData(prev => ({
      ...prev,
      aplicaTodo: tipo === 'todo',
      aplicaCategoria: tipo === 'categoria',
      aplicaProducto: tipo === 'producto',
      categoriaId: tipo === 'categoria' ? prev.categoriaId : '',
      productoId: tipo === 'producto' ? prev.productoId : ''
    }))
  }

  const validarFormulario = () => {
    const nuevosErrores = {}

    // Validar campos requeridos
    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es requerido'
    } else if (formData.nombre.length < 2) {
      nuevosErrores.nombre = 'El nombre debe tener al menos 2 caracteres'
    }

    if (!formData.fechaInicio) {
      nuevosErrores.fechaInicio = 'La fecha de inicio es requerida'
    }

    if (!formData.fechaFin) {
      nuevosErrores.fechaFin = 'La fecha de fin es requerida'
    }

    if (formData.fechaInicio && formData.fechaFin && new Date(formData.fechaInicio) >= new Date(formData.fechaFin)) {
      nuevosErrores.fechaFin = 'La fecha de fin debe ser posterior a la fecha de inicio'
    }

    // Validar valor de descuento según el tipo
    if (formData.tipo === 'PORCENTAJE' && (formData.valorDescuento < 0 || formData.valorDescuento > 100)) {
      nuevosErrores.valorDescuento = 'El porcentaje debe estar entre 0 y 100'
    }

    if (formData.tipo === 'MONTO_FIJO' && formData.valorDescuento < 0) {
      nuevosErrores.valorDescuento = 'El monto debe ser mayor a 0'
    }

    // Validar opción de aplicación
    const opcionesActivas = [formData.aplicaTodo, formData.aplicaCategoria, formData.aplicaProducto].filter(Boolean).length
    if (opcionesActivas !== 1) {
      nuevosErrores.aplicacion = 'Debe seleccionar exactamente una opción de aplicación'
    }

    if (formData.aplicaCategoria && !formData.categoriaId) {
      nuevosErrores.categoriaId = 'La categoría es requerida'
    }

    if (formData.aplicaProducto && !formData.productoId) {
      nuevosErrores.productoId = 'El producto es requerido'
    }

    setErrores(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  const guardarPromocion = async () => {
    if (!validarFormulario()) {
      return
    }

    const datos = {
      ...formData,
      valorDescuento: parseFloat(formData.valorDescuento),
      categoriaId: formData.aplicaCategoria ? parseInt(formData.categoriaId) : null,
      productoId: formData.aplicaProducto ? parseInt(formData.productoId) : null
    }

    if (isEdit) {
      await actualizarMutation.mutateAsync({ id: promocionExistente.id, data: datos })
    } else {
      await crearMutation.mutateAsync(datos)
    }
  }

  const limpiarFormulario = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      tipo: 'PORCENTAJE',
      valorDescuento: 0,
      fechaInicio: '',
      fechaFin: '',
      aplicaTodo: false,
      aplicaCategoria: false,
      categoriaId: '',
      aplicaProducto: false,
      productoId: ''
    })
    setErrores({})
  }

  return {
    formData,
    errores,
    handleChange,
    handleAplicacionChange,
    guardarPromocion,
    limpiarFormulario,
    isLoading,
    isEdit
  }
}