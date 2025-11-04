import { motion } from "motion/react"
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, CreditCard, BarChart3 } from "lucide-react"

const ResumenReporte = ({ reporte }) => {
  // Validar que el reporte tenga la estructura esperada
  if (!reporte || !reporte.resumen) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
        <p className="text-yellow-800">Datos del reporte no disponibles</p>
      </div>
    )
  }

  const { resumen, periodo } = reporte
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-BO', {
      style: 'currency',
      currency: 'BOB'
    }).format(amount)
  }

  const esBalancePositivo = resumen.balance >= 0
  const esMargenPositivo = resumen.margen >= 0

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="mb-6"
    >
      {/* Tarjetas de Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Tarjeta Ingresos */}
        <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-green-500">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="text-green-600" size={20} />
            </div>
            <div>
              <div className="text-sm text-gray-600">Total Ingresos</div>
              <div className="text-xl font-bold text-gray-800">{formatCurrency(resumen.totalIngresos)}</div>
            </div>
          </div>
        </div>

        {/* Tarjeta Egresos */}
        <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-red-500">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <TrendingDown className="text-red-600" size={20} />
            </div>
            <div>
              <div className="text-sm text-gray-600">Total Egresos</div>
              <div className="text-xl font-bold text-gray-800">{formatCurrency(resumen.totalEgresos)}</div>
            </div>
          </div>
        </div>

        {/* Tarjeta Balance */}
        <div className={`bg-white rounded-xl shadow-lg p-4 border-l-4 ${esBalancePositivo ? 'border-green-500' : 'border-red-500'}`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${esBalancePositivo ? 'bg-green-100' : 'bg-red-100'}`}>
              <DollarSign className={esBalancePositivo ? 'text-green-600' : 'text-red-600'} size={20} />
            </div>
            <div>
              <div className="text-sm text-gray-600">Balance Neto</div>
              <div className={`text-xl font-bold ${esBalancePositivo ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(resumen.balance)}
              </div>
            </div>
          </div>
        </div>

        {/* Tarjeta Margen - CORREGIDA */}
        <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-blue-500">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 className="text-blue-600" size={20} />
            </div>
            <div>
              <div className="text-sm text-gray-600">Margen</div>
              <div className={`text-xl font-bold ${esMargenPositivo ? 'text-green-600' : 'text-red-600'}`}>
                {resumen.margen}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas Adicionales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Actividad Comercial */}
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <ShoppingCart className="text-blue-600" size={20} />
            <h4 className="font-semibold text-gray-800">Actividad Comercial</h4>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Ventas realizadas:</span>
              <span className="font-semibold text-green-600">{resumen.cantidadVentas}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Compras realizadas:</span>
              <span className="font-semibold text-blue-600">{resumen.cantidadCompras}</span>
            </div>
          </div>
        </div>

        {/* Resumen Financiero */}
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <CreditCard className="text-purple-600" size={20} />
            <h4 className="font-semibold text-gray-800">Resumen Financiero</h4>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Periodo analizado:</span>
              <span className="font-semibold text-gray-800">
                {periodo.fechaInicio} a {periodo.fechaFin}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Estado:</span>
              <span className={`font-semibold ${esBalancePositivo ? 'text-green-600' : 'text-red-600'}`}>
                {esBalancePositivo ? 'Positivo' : 'Negativo'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ResumenReporte