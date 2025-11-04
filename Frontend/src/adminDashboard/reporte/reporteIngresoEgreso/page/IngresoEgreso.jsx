"use client"

import { useState, useEffect } from "react"
import { motion } from "motion/react"
import { useReportes } from "../hooks/useReporteIngresoEgreso"
import { FileText, TrendingUp, Filter } from "lucide-react"
import FiltrosReportes from "./../components/FiltrosReportes"
import ResumenReporte from "./../components/ResumenReportes"
import TablaCompras from "./TablaCompras"
import TablaVentas from "./TablaVentas"
import TabsReportes from "../components/TabsReportes"
import toast from "react-hot-toast"
import { generarPDFReporte } from "./../../../../utils/generarPDFReporte"
import { MenuExportar } from "./../../../../global/components/Menu/MenuExportar"

const IngresoEgreso = () => {
  const { obtenerIngresosEgresos, listarPorFecha, listarVentaPorFecha } = useReportes()

  const getFechasPorDefecto = () => {
    const ahora = new Date()
    const primerDiaMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1)
    const ultimoDiaMes = new Date(ahora.getFullYear(), ahora.getMonth() + 1, 0)
    
    return {
      inicio: primerDiaMes.toISOString().split('T')[0],
      fin: ultimoDiaMes.toISOString().split('T')[0]
    }
  }

  const fechasPorDefecto = getFechasPorDefecto()
  const [fechaInicio, setFechaInicio] = useState(fechasPorDefecto.inicio)
  const [fechaFin, setFechaFin] = useState(fechasPorDefecto.fin)
  const [reporteGenerado, setReporteGenerado] = useState(false)
  const [tabActivo, setTabActivo] = useState('compras')

  const reporte = obtenerIngresosEgresos.data
  const compras = listarPorFecha.data || []
  const ventas = listarVentaPorFecha.data || []

  const handleTabChange = (tab) => {
    setTabActivo(tab)
  }

  useEffect(() => {
    generarReporteAutomatico()
  }, [])

  const generarReporteAutomatico = async () => {
    try {
      console.log(fechasPorDefecto.inicio)
      await Promise.all([
        obtenerIngresosEgresos.mutateAsync({ fechaInicio: fechasPorDefecto.inicio, fechaFin: fechasPorDefecto.fin }),
        listarPorFecha.mutateAsync({ fechaInicio: fechasPorDefecto.inicio, fechaFin: fechasPorDefecto.fin }),
        listarVentaPorFecha.mutateAsync({ fechaInicio: fechasPorDefecto.inicio, fechaFin: fechasPorDefecto.fin })
      ])
      setReporteGenerado(true)
    } catch (error) {
      console.error("Error generando reporte automático:", error)
    }
  }

  const generarReporte = async () => {
    if (!fechaInicio || !fechaFin) {
      toast.error("Seleccione ambas fechas")
      return
    }

    try {
      await Promise.all([
        obtenerIngresosEgresos.mutateAsync({ fechaInicio, fechaFin }),
        listarPorFecha.mutateAsync({ fechaInicio, fechaFin }),
        listarVentaPorFecha.mutateAsync({ fechaInicio, fechaFin })
      ])
      setReporteGenerado(true)
      toast.success("Reporte generado exitosamente")
    } catch (error) {
      console.error("Error generando reporte:", error)
      toast.error("Error al generar el reporte")
    }
  }

  const limpiarReporte = () => {
    setReporteGenerado(false)
    setTabActivo('compras')
    setFechaInicio(fechasPorDefecto.inicio)
    setFechaFin(fechasPorDefecto.fin)
    listarPorFecha.reset()
    listarVentaPorFecha.reset()
    obtenerIngresosEgresos.reset()
    toast.success("Filtros restablecidos al mes actual")
  }

  const handleDescargarPDF = () => {
    if (!reporteGenerado || !reporte) {
      toast.error("Primero genere un reporte")
      return
    }

    try {
      generarPDFReporte(
        reporte,
        compras,
        ventas,
        { fechaInicio, fechaFin },
        "descargar",
        "completo"
      )
      toast.success("PDF descargado exitosamente")
    } catch (error) {
      console.error("Error generando PDF:", error)
      toast.error("Error al descargar PDF")
    }
  }

  const handleImprimir = () => {
    if (!reporteGenerado || !reporte) {
      toast.error("Primero genere un reporte")
      return
    }

    try {
      generarPDFReporte(
        reporte,
        compras,
        ventas,
        { fechaInicio, fechaFin },
        "imprimir",
        "completo"
      )
    } catch (error) {
      console.error("Error imprimiendo:", error)
      toast.error("Error al imprimir")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-600 rounded-lg">
              <TrendingUp className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Reporte de Ingresos y Egresos</h1>
          </div>
          <p className="text-gray-600 ml-11">Análisis financiero del periodo seleccionado</p>
          <div className="w-20 h-1 bg-blue-600 mt-2 ml-11 rounded-full"></div>
        </motion.div>

        {/* Filtros con botón de exportar integrado */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <MenuExportar 
              onDescargarPDF={handleDescargarPDF}
              onImprimir={handleImprimir}
              disabled={!reporteGenerado}
            />
          </div>

          {/* Componente FiltrosReportes integrado */}
          <FiltrosReportes
            fechaInicio={fechaInicio}
            fechaFin={fechaFin}
            onFechaInicioChange={setFechaInicio}
            onFechaFinChange={setFechaFin}
            onGenerarReporte={generarReporte}
            onLimpiarReporte={limpiarReporte}
            loading={obtenerIngresosEgresos.isPending || listarPorFecha.isPending || listarVentaPorFecha.isPending}
          />
        </div>

        {/* Estado de carga inicial */}
        {(obtenerIngresosEgresos.isPending || listarPorFecha.isPending || listarVentaPorFecha.isPending) && !reporteGenerado && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Cargando reporte del mes actual...</h3>
            <p className="text-gray-600">Generando análisis financiero</p>
          </motion.div>
        )}

        {/* Resumen del Reporte */}
        {reporteGenerado && reporte && (
          <ResumenReporte reporte={reporte} />
        )}

        {/* Tabs de Compras y Ventas */}
        {reporteGenerado && (compras.length > 0 || ventas.length > 0) && (
          <TabsReportes
            compras={compras}
            ventas={ventas}
            loadingCompras={listarPorFecha.isPending}
            loadingVentas={listarVentaPorFecha.isPending}
            onTabChange={handleTabChange}
          />
        )}

        {/* Renderizar la tabla correspondiente según el tab activo */}
        {reporteGenerado && tabActivo === 'compras' && compras.length > 0 && (
          <TablaCompras 
            compras={compras} 
            loading={listarPorFecha.isPending}
          />
        )}

        {reporteGenerado && tabActivo === 'ventas' && ventas.length > 0 && (
          <TablaVentas 
            ventas={ventas} 
            loading={listarVentaPorFecha.isPending}
          />
        )}

        {/* Estado vacío */}
        {reporteGenerado && compras.length === 0 && ventas.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl shadow-lg p-8 text-center">
            <FileText size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No hay datos en el periodo seleccionado</h3>
            <p className="text-gray-600">No se encontraron compras ni ventas entre {fechaInicio} y {fechaFin}</p>
          </motion.div>
        )}

      </div>
    </div>
  )
}

export default IngresoEgreso