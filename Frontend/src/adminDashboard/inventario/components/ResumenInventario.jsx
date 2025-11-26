"use client"

import { motion } from "motion/react"
import { Package, TrendingUp, AlertTriangle, DollarSign, BarChart3, Calendar } from "lucide-react"

const ResumenInventario = ({ datos, tipo }) => {
  const esEstado = tipo === 'estado'
  const esReporteMovimientos = datos?.tipo === 'MOVIMIENTOS'
  const esReporteStockBajo = datos?.tipo === 'STOCK_BAJO'
  
  const estadisticas = datos?.estadisticas || {}
  const resumenMovimientos = datos?.resumenPorTipo || {}

  const CardEstadistica = ({ titulo, valor, icono, color = "blue", esMoneda = false, subtexto }) => {
    // Definir los colores dinámicamente
    const colorClasses = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600',
      orange: 'bg-orange-100 text-orange-600',
      red: 'bg-red-100 text-red-600',
      indigo: 'bg-indigo-100 text-indigo-600',
      gray: 'bg-gray-100 text-gray-600'
    }

    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{titulo}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {esMoneda ? `Bs. ${Number(valor).toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : valor}
            </p>
            {subtexto && <p className="text-xs text-gray-500 mt-1">{subtexto}</p>}
          </div>
          <div className={`p-3 rounded-full ${colorClasses[color]}`}>
            {icono}
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      {/* Header del Resumen */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-600 rounded-lg">
          <BarChart3 className="text-white" size={20} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            {esEstado ? 'Resumen del Inventario' : `Reporte - ${datos?.tipoReporte}`}
          </h2>
          <p className="text-gray-600 text-sm">
            {esEstado 
              ? 'Estadísticas generales del inventario actual' 
              : `Generado el ${new Date(datos?.fechaGeneracion).toLocaleDateString()}`
            }
          </p>
        </div>
      </div>

      {/* Estadísticas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <CardEstadistica
          titulo="Total Productos"
          valor={estadisticas.totalProductos || 0}
          icono={<Package size={24} />}
          color="blue"
        />
        
        <CardEstadistica
          titulo="Total Variantes"
          valor={estadisticas.totalVariantes || 0}
          icono={<Package size={24} />}
          color="green"
        />
        
        <CardEstadistica
          titulo="Stock Total"
          valor={estadisticas.stockTotal || 0}
          icono={<TrendingUp size={24} />}
          color="purple"
        />
        
        <CardEstadistica
          titulo="Valor Total"
          valor={estadisticas.valorTotalInventario || 0}
          icono={<DollarSign size={24} />}
          color="orange"
          esMoneda={true}
        />
      </div>

      {/* Estadísticas Secundarias */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <CardEstadistica
          titulo="Productos Stock Bajo"
          valor={estadisticas.productosStockBajo || 0}
          icono={<AlertTriangle size={24} />}
          color="red"
          subtexto="Requieren atención"
        />

        {esReporteMovimientos && (
          <>
            <CardEstadistica
              titulo="Total Movimientos"
              valor={datos.totalMovimientos || 0}
              icono={<Calendar size={24} />}
              color="indigo"
            />
            
            <CardEstadistica
              titulo="Periodo Analizado"
              valor={datos.periodo || 'N/A'}
              icono={<Calendar size={24} />}
              color="gray"
            />
          </>
        )}

        {esReporteStockBajo && (
          <CardEstadistica
            titulo="Productos Sin Stock"
            valor={datos.totalProductosSinStock || 0}
            icono={<AlertTriangle size={24} />}
            color="red"
            subtexto="Crítico - Reabastecer"
          />
        )}
      </div>

      {/* Resumen de Movimientos por Tipo */}
      {esReporteMovimientos && Object.keys(resumenMovimientos).length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Resumen por Tipo de Movimiento</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(resumenMovimientos).map(([tipo, datos]) => (
              <div key={tipo} className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-600 capitalize">{tipo.replace('_', ' ')}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{datos.cantidad}</p>
                <p className="text-xs text-gray-500">unidades</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Alerta de Stock Bajo */}
      {estadisticas.productosStockBajo > 0 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-orange-50 border border-orange-200 rounded-xl p-4 mt-4"
        >
          <div className="flex items-center gap-3">
            <AlertTriangle className="text-orange-600" size={20} />
            <div>
              <h4 className="font-semibold text-orange-800">Alerta de Stock Bajo</h4>
              <p className="text-orange-700 text-sm">
                {estadisticas.productosStockBajo} producto(s) requieren reabastecimiento inmediato
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default ResumenInventario