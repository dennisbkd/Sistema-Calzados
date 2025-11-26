
import { motion } from "motion/react"
import { Calendar, DollarSign, TrendingUp, TrendingDown, CreditCard, Wallet, ArrowUpDown } from "lucide-react"

import { useFiltros } from "../../../global/hooks/useFiltros"
import { PageCabecera } from "../../../global/components/cabecera/PageCabecera"
import { BuscarInput } from "../../../global/components/filtros/BuscarInput"
import { FiltrarFIlas } from "../../../global/components/filtros/FiltrarFIlas"
import { SeleccionarFiltros } from "../../../global/components/filtros/SeleccionarFiltros"
import { BotonAccion } from "../../../global/components/Boton/BotonAccion"
import { SpinnerCargando } from "../../../global/components/SpinnerCargando"
import { ErrorMessage } from "../../../global/components/ErrorMessage"

import { TablaMovimientos } from "../components/TablaMovimientos"
// import { GraficoMetodosPago } from "../components/GraficoMetodosPago"
import { useResumenHoy, useMovimientosPorRango } from "../hooks/useCajaDiaria"
import { TarjetaResumen } from "../components/TarjetaResumen"

export const GestionCajaDiaria = () => {
  const {
    data: resumenHoy,
    isLoading: isLoadingHoy,
    error: errorHoy
  } = useResumenHoy()

  const {
    filtros,
    menuFiltrosAbierto,
    actualizarFiltro,
    toggleMenuFiltros
  } = useFiltros({
    fechaInicio: new Date().toISOString().split('T')[0],
    fechaFin: new Date().toISOString().split('T')[0],
    tipoMovimiento: 'todos'
  })

  const {
    data: movimientos,
    isLoading: isLoadingMovimientos,
    error: errorMovimientos
  } = useMovimientosPorRango(filtros.fechaInicio, filtros.fechaFin)

  // Filtrar movimientos
  const movimientosFiltrados = movimientos?.filter(movimiento => {
    const coincideTipo = filtros.tipoMovimiento === 'todos' ||
      movimiento.tipo.toLowerCase() === filtros.tipoMovimiento.toLowerCase()

    const coincideBusqueda = !filtros.searchTerm ||
      movimiento.nroFactura?.toLowerCase().includes(filtros.searchTerm.toLowerCase()) ||
      movimiento.metodoPago.toLowerCase().includes(filtros.searchTerm.toLowerCase()) ||
      movimiento.usuario?.toLowerCase().includes(filtros.searchTerm.toLowerCase())

    return coincideTipo && coincideBusqueda
  }) || []

  if (isLoadingHoy) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <PageCabecera
            titulo="Control de Caja Diaria"
            subtitulo="Resumen financiero y movimientos del día"
            icono={DollarSign}
          />
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-8">
            <SpinnerCargando
              tamaño="lg"
              texto="Cargando resumen de caja..."
            />
          </div>
        </div>
      </div>
    )
  }

  if (errorHoy) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <PageCabecera
            titulo="Control de Caja Diaria"
            subtitulo="Resumen financiero y movimientos del día"
            icono={DollarSign}
          />
          <ErrorMessage
            titulo="Error al cargar el resumen de caja"
            mensaje="No se pudo cargar la información financiera. Por favor, intenta nuevamente."
            onRetry={() => window.location.reload()}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header de la página */}
        <PageCabecera
          titulo="Control de Caja Diaria"
          subtitulo="Resumen financiero y movimientos del día"
          icono={DollarSign}
        />

        {/* Panel de controles */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 mb-6"
        >
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Fecha inicio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha Inicio
                </label>
                <input
                  type="date"
                  value={filtros.fechaInicio}
                  onChange={(e) => actualizarFiltro('fechaInicio', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Fecha fin */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha Fin
                </label>
                <input
                  type="date"
                  value={filtros.fechaFin}
                  onChange={(e) => actualizarFiltro('fechaFin', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Filtros adicionales */}
              <div className="flex items-end gap-2">
                <FiltrarFIlas
                  menuFiltrosAbierto={menuFiltrosAbierto}
                  onToggleMenu={toggleMenuFiltros}
                >
                  <SeleccionarFiltros
                    value={filtros.tipoMovimiento}
                    onChange={(e) => actualizarFiltro('tipoMovimiento', e.target.value)}
                    options={[
                      { value: 'todos', label: 'Todos los movimientos' },
                      { value: 'venta', label: 'Solo ventas' },
                      { value: 'compra', label: 'Solo compras' }
                    ]}
                    placeholder="Tipo de movimiento"
                  />
                </FiltrarFIlas>

                <BotonAccion
                  onClick={() => {
                    // Refrescar datos
                    window.location.reload()
                  }}
                  icon={ArrowUpDown}
                  label="Actualizar"
                  variant="secondary"
                />
              </div>
            </div>

            {/* Búsqueda */}
            <BuscarInput
              value={filtros.searchTerm}
              onChange={(value) => actualizarFiltro('searchTerm', value)}
              placeholder="Buscar por factura, método de pago o usuario..."
            />
          </div>
        </motion.div>

        {/* Resumen de caja */}
        {resumenHoy && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6"
          >
            <TarjetaResumen
              titulo="Ventas Totales"
              valor={resumenHoy.ventas?.total || 0}
              icono={TrendingUp}
              variacion="+12%"
              color="verde"
              formato="moneda"
            />

            <TarjetaResumen
              titulo="Compras Totales"
              valor={resumenHoy.compras?.total || 0}
              icono={TrendingDown}
              variacion="+5%"
              color="rojo"
              formato="moneda"
            />

            <TarjetaResumen
              titulo="Saldo Final"
              valor={resumenHoy.saldoFinalTotal || 0}
              icono={Wallet}
              variacion={resumenHoy.saldoFinalTotal >= 0 ? "positivo" : "negativo"}
              color={resumenHoy.saldoFinalTotal >= 0 ? "azul" : "naranja"}
              formato="moneda"
            />

            <TarjetaResumen
              titulo="Total Transacciones"
              valor={resumenHoy.totalTransacciones || 0}
              icono={CreditCard}
              variacion="+8%"
              color="purpura"
              formato="numero"
            />
          </motion.div>
        )}

        {/* Gráfico y detalles por método de pago */}
        {resumenHoy?.resumenPorMetodo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6"
          >
            {/* <GraficoMetodosPago data={resumenHoy.resumenPorMetodo} /> */}

            {/* Detalles por método de pago */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Detalles por Método de Pago
              </h3>
              <div className="space-y-4">
                {Object.entries(resumenHoy.resumenPorMetodo).map(([metodo, datos]) => (
                  <div key={metodo} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${metodo === 'efectivo' ? 'bg-green-500' :
                        metodo === 'tarjeta' ? 'bg-blue-500' : 'bg-purple-500'
                        }`} />
                      <span className="capitalize font-medium text-gray-700">{metodo}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">
                        ${datos.saldo?.toFixed(2) || 0}
                      </div>
                      <div className="text-sm text-gray-500">
                        V: ${datos.ventas?.toFixed(2) || 0} | C: ${datos.compras?.toFixed(2) || 0}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Tabla de movimientos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <TablaMovimientos
            movimientos={movimientosFiltrados}
            isLoading={isLoadingMovimientos}
            error={errorMovimientos}
          />
        </motion.div>
      </div>
    </div>
  )
}