// components/ModalPromocionForm.jsx
import { useState, useEffect } from 'react'
import { Tag, X, Percent, DollarSign, Gift } from "lucide-react"
import { SpinnerCargando } from "../../../global/components/SpinnerCargando"
import { Modal } from '../../../global/components/modal/Modal'

const TIPOS_PROMOCION = [
  { value: 'PORCENTAJE', label: 'Porcentaje', icon: Percent },
  { value: 'MONTO_FIJO', label: 'Monto Fijo', icon: DollarSign },
  { value: '2X1', label: '2x1', icon: Gift },
  { value: '3X2', label: '3x2', icon: Gift }
]

export const ModalPromocionForm = ({
  abierto,
  cambiarEstado,
  promocion,
  categorias = [],
  productos = [],
  onGuardar,
  isLoading = false
}) => {
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

  const isEdit = !!promocion

  // Inicializar formulario
  useEffect(() => {
    if (promocion) {
      setFormData({
        nombre: promocion.nombre || '',
        descripcion: promocion.descripcion || '',
        tipo: promocion.tipo || 'PORCENTAJE',
        valorDescuento: promocion.valorDescuento || 0,
        fechaInicio: promocion.fechaInicio || '',
        fechaFin: promocion.fechaFin || '',
        aplicaTodo: promocion.aplicaTodo || false,
        aplicaCategoria: promocion.aplicaCategoria || false,
        categoriaId: promocion.categoriaId || '',
        aplicaProducto: promocion.aplicaProducto || false,
        productoId: promocion.productoId || ''
      })
    } else {
      // Resetear formulario
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
    }
    setErrores({})
  }, [promocion, abierto])

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Limpiar error del campo
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

    // Limpiar error de aplicación
    if (errores.aplicacion) {
      setErrores(prev => ({
        ...prev,
        aplicacion: null
      }))
    }
  }

  const validarFormulario = () => {
    const nuevosErrores = {}

    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es requerido'
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

    if (formData.tipo === 'PORCENTAJE' && (formData.valorDescuento < 0 || formData.valorDescuento > 100)) {
      nuevosErrores.valorDescuento = 'El porcentaje debe estar entre 0 y 100'
    }

    if (formData.tipo === 'MONTO_FIJO' && formData.valorDescuento < 0) {
      nuevosErrores.valorDescuento = 'El monto debe ser mayor a 0'
    }

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

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validarFormulario()) {
      return
    }

    const datos = {
      ...formData,
      valorDescuento: parseFloat(formData.valorDescuento),
      categoriaId: formData.aplicaCategoria ? parseInt(formData.categoriaId) : null,
      productoId: formData.aplicaProducto ? parseInt(formData.productoId) : null
    }

    await onGuardar(datos)
  }

  const getPlaceholderValor = () => {
    switch (formData.tipo) {
      case 'PORCENTAJE': return '0-100'
      case 'MONTO_FIJO': return '0.00'
      default: return ''
    }
  }

  const isValorDisabled = formData.tipo === '2X1' || formData.tipo === '3X2'

  return (
    <Modal
      abierto={abierto}
      cambiarEstado={cambiarEstado}
      titulo={isEdit ? 'Editar Promoción' : 'Crear Nueva Promoción'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nombre */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre de la Promoción *
          </label>
          <input
            type="text"
            value={formData.nombre}
            onChange={(e) => handleChange('nombre', e.target.value)}
            placeholder="Ej: Descuento de Verano, 2x1 en Zapatillas"
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errores.nombre ? 'border-red-500' : 'border-gray-300'
              }`}
          />
          {errores.nombre && (
            <p className="mt-1 text-sm text-red-600">{errores.nombre}</p>
          )}
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descripción
          </label>
          <textarea
            value={formData.descripcion}
            onChange={(e) => handleChange('descripcion', e.target.value)}
            placeholder="Describe los detalles de la promoción..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Tipo y Valor */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Promoción *
            </label>
            <select
              value={formData.tipo}
              onChange={(e) => handleChange('tipo', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {TIPOS_PROMOCION.map(tipo => (
                <option key={tipo.value} value={tipo.value}>
                  {tipo.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Valor de Descuento {!isValorDisabled && '*'}
            </label>
            <input
              type="number"
              value={formData.valorDescuento}
              onChange={(e) => handleChange('valorDescuento', e.target.value)}
              placeholder={getPlaceholderValor()}
              step="0.01"
              disabled={isValorDisabled}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errores.valorDescuento ? 'border-red-500' : 'border-gray-300'
                } ${isValorDisabled ? 'bg-gray-100 text-gray-500' : ''}`}
            />
            {errores.valorDescuento && (
              <p className="mt-1 text-sm text-red-600">{errores.valorDescuento}</p>
            )}
          </div>
        </div>

        {/* Fechas */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha de Inicio *
            </label>
            <input
              type="date"
              value={formData.fechaInicio}
              onChange={(e) => handleChange('fechaInicio', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errores.fechaInicio ? 'border-red-500' : 'border-gray-300'
                }`}
            />
            {errores.fechaInicio && (
              <p className="mt-1 text-sm text-red-600">{errores.fechaInicio}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha de Fin *
            </label>
            <input
              type="date"
              value={formData.fechaFin}
              onChange={(e) => handleChange('fechaFin', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errores.fechaFin ? 'border-red-500' : 'border-gray-300'
                }`}
            />
            {errores.fechaFin && (
              <p className="mt-1 text-sm text-red-600">{errores.fechaFin}</p>
            )}
          </div>
        </div>

        {/* Opciones de Aplicación */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Aplicar a: *
          </label>

          {errores.aplicacion && (
            <p className="text-sm text-red-600">{errores.aplicacion}</p>
          )}

          <div className="space-y-3">
            {/* Todo */}
            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="aplicacion"
                checked={formData.aplicaTodo}
                onChange={() => handleAplicacionChange('todo')}
                className="rounded-full border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <div className="font-medium text-gray-900">Todos los productos</div>
                <div className="text-sm text-gray-500">La promoción aplica a todo el catálogo</div>
              </div>
            </label>

            {/* Categoría */}
            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="aplicacion"
                checked={formData.aplicaCategoria}
                onChange={() => handleAplicacionChange('categoria')}
                className="rounded-full border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div className="flex-1">
                <div className="font-medium text-gray-900">Categoría específica</div>
                <div className="text-sm text-gray-500 mb-2">Selecciona una categoría</div>
                {formData.aplicaCategoria && (
                  <select
                    value={formData.categoriaId}
                    onChange={(e) => handleChange('categoriaId', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errores.categoriaId ? 'border-red-500' : 'border-gray-300'
                      }`}
                  >
                    <option value="">Selecciona una categoría</option>
                    {categorias.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.value}
                      </option>
                    ))}
                  </select>
                )}
                {errores.categoriaId && (
                  <p className="mt-1 text-sm text-red-600">{errores.categoriaId}</p>
                )}
              </div>
            </label>

            {/* Producto */}
            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="aplicacion"
                checked={formData.aplicaProducto}
                onChange={() => handleAplicacionChange('producto')}
                className="rounded-full border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div className="flex-1">
                <div className="font-medium text-gray-900">Producto específico</div>
                <div className="text-sm text-gray-500 mb-2">Selecciona un producto</div>
                {formData.aplicaProducto && (
                  <select
                    value={formData.productoId}
                    onChange={(e) => handleChange('productoId', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errores.productoId ? 'border-red-500' : 'border-gray-300'
                      }`}
                  >
                    <option value="">Selecciona un producto</option>
                    {productos.map(prod => (
                      <option key={prod.id} value={prod.id}>
                        {prod.nombre} - {prod.marca}
                      </option>
                    ))}
                  </select>
                )}
                {errores.productoId && (
                  <p className="mt-1 text-sm text-red-600">{errores.productoId}</p>
                )}
              </div>
            </label>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={cambiarEstado}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <SpinnerCargando tamaño="sm" />
            ) : (
              <>
                <Tag className="w-4 h-4" />
                {isEdit ? 'Guardar Cambios' : 'Crear Promoción'}
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  )
}