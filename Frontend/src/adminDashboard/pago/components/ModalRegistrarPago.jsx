import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X, CreditCard, DollarSign, FileText, Calendar, Hash } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { registrarPagoCompra } from '../../../api/pago/transaccionPagoApi'
import { getMetodosPagoActivos } from '../../../api/pago/metodoPagoApi'
import { getResumenCompra } from '../../../api/pago/transaccionPagoApi'

export const ModalRegistrarPago = ({ isOpen, onClose, compra, onSuccess }) => {
  const [loading, setLoading] = useState(false)
  const [metodosPago, setMetodosPago] = useState([])
  const [resumen, setResumen] = useState(null)
  const [formData, setFormData] = useState({
    metodoPagoId: '',
    monto: '',
    referencia: '',
    observacion: ''
  })

  useEffect(() => {
    if (isOpen && compra) {
      cargarDatos()
    }
  }, [isOpen, compra])

  const cargarDatos = async () => {
    try {
      const [metodos, resumenData] = await Promise.all([
        getMetodosPagoActivos(),
        getResumenCompra(compra.id)
      ])
      setMetodosPago(metodos)
      setResumen(resumenData)

      // Si hay saldo pendiente, pre-llenar el monto
      if (resumenData && resumenData.montoPendiente > 0) {
        setFormData(prev => ({ ...prev, monto: resumenData.montoPendiente.toString() }))
      }
    } catch (error) {
      console.error('Error al cargar datos:', error)
      toast.error('Error al cargar información del pago')
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.metodoPagoId) {
      toast.error('Selecciona un método de pago')
      return
    }

    if (!formData.monto || parseFloat(formData.monto) <= 0) {
      toast.error('Ingresa un monto válido')
      return
    }

    if (resumen && parseFloat(formData.monto) > resumen.montoPendiente) {
      toast.error(`El monto no puede ser mayor al pendiente (Bs. ${resumen.montoPendiente.toFixed(2)})`)
      return
    }

    setLoading(true)
    try {
      await registrarPagoCompra({
        compraId: compra.id,
        metodoPagoId: parseInt(formData.metodoPagoId),
        monto: parseFloat(formData.monto),
        referencia: formData.referencia || null,
        observacion: formData.observacion || null
      })

      toast.success('Pago registrado correctamente')
      onSuccess?.()
      onClose()

      // Reset form
      setFormData({
        metodoPagoId: '',
        monto: '',
        referencia: '',
        observacion: ''
      })
    } catch (error) {
      console.error('Error al registrar pago:', error)
      toast.error(error.response?.data?.error || 'Error al registrar el pago')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Registrar Pago</h2>
              <p className="text-sm text-gray-500">Compra #{compra?.nroFactura || compra?.id}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Resumen de la compra */}
          {resumen && (
            <div className="px-6 py-4 bg-blue-50 border-b border-blue-100">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Total Compra:</p>
                  <p className="text-lg font-bold text-gray-900">Bs. {resumen.totalCompra.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-gray-600">Ya Pagado:</p>
                  <p className="text-lg font-bold text-green-600">Bs. {resumen.totalPagado.toFixed(2)}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-600">Saldo Pendiente:</p>
                  <p className="text-2xl font-bold text-red-600">Bs. {resumen.montoPendiente.toFixed(2)}</p>
                </div>
              </div>
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
            {/* Método de Pago */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <CreditCard className="w-4 h-4 inline mr-2" />
                Método de Pago *
              </label>
              <select
                name="metodoPagoId"
                value={formData.metodoPagoId}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Seleccionar método...</option>
                {metodosPago.map(metodo => (
                  <option key={metodo.id} value={metodo.id}>
                    {metodo.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Monto */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="w-4 h-4 inline mr-2" />
                Monto (Bs.) *
              </label>
              <input
                type="number"
                name="monto"
                value={formData.monto}
                onChange={handleChange}
                step="0.01"
                min="0.01"
                max={resumen?.montoPendiente}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>

            {/* Referencia */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Hash className="w-4 h-4 inline mr-2" />
                Número de Referencia (Opcional)
              </label>
              <input
                type="text"
                name="referencia"
                value={formData.referencia}
                onChange={handleChange}
                maxLength={100}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: TRX-12345"
              />
            </div>

            {/* Observaciones */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4 inline mr-2" />
                Observaciones (Opcional)
              </label>
              <textarea
                name="observacion"
                value={formData.observacion}
                onChange={handleChange}
                rows={3}
                maxLength={255}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Información adicional del pago..."
              />
            </div>

            {/* Botones */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Registrando...' : 'Registrar Pago'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}