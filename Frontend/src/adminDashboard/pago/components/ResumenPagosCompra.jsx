import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { CreditCard, Calendar, Hash, FileText, DollarSign } from 'lucide-react'
import { getPagosPorCompra, getResumenCompra } from '../../../api/pago/transaccionPagoApi'
import { BadgeEstadoPago } from './BadgeEstadoPago'

export const ResumenPagosCompra = ({ compraId }) => {
  const [pagos, setPagos] = useState([])
  const [resumen, setResumen] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (compraId) {
      cargarDatos()
    }
  }, [compraId])

  const cargarDatos = async () => {
    try {
      setLoading(true)
      const [pagosData, resumenData] = await Promise.all([
        getPagosPorCompra(compraId),
        getResumenCompra(compraId)
      ])
      setPagos(pagosData)
      setResumen(resumenData)
    } catch (error) {
      console.error('Error al cargar pagos:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!resumen) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden"
    >
      {/* Resumen General */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b border-blue-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-gray-900">Estado de Pagos</h3>
          <BadgeEstadoPago estado={resumen.estadoCompra} />
        </div>

        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-600 text-xs mb-1">Total Compra</p>
            <p className="text-xl font-bold text-gray-900">
              Bs. {resumen.totalCompra.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-gray-600 text-xs mb-1">Pagado</p>
            <p className="text-xl font-bold text-green-600">
              Bs. {resumen.totalPagado.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-gray-600 text-xs mb-1">Pendiente</p>
            <p className="text-xl font-bold text-red-600">
              Bs. {resumen.montoPendiente.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Lista de Pagos */}
      <div className="px-6 py-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <DollarSign className="w-4 h-4" />
          Pagos Realizados ({pagos.length})
        </h4>

        {pagos.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">
            No se han registrado pagos aún
          </p>
        ) : (
          <div className="space-y-3">
            {pagos.map((pago, index) => (
              <motion.div
                key={pago.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-blue-600" />
                    <span className="font-semibold text-gray-900">
                      {pago.metodoPago}
                    </span>
                  </div>
                  <span className="text-lg font-bold text-green-600">
                    Bs. {parseFloat(pago.monto).toFixed(2)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                  {pago.referencia && (
                    <div className="flex items-center gap-1">
                      <Hash className="w-3 h-3" />
                      <span>{pago.referencia}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{pago.fecha} {pago.hora}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}