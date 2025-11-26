"use client"

import { useState, useEffect } from "react"
import { motion } from "motion/react"
import { useReportes } from "../hooks/useReporteIngresoEgreso"
import { FileText, TrendingUp, Filter } from "lucide-react"
import FiltrosReportes from "./../components/FiltrosReportes"
import ResumenReporte from "./../components/ResumenReportes"
import TablaCompras from "./../components/TablaCompras"
import TablaVentas from "./../components/TablaVentas"
import TabsReportes from "../components/TabsReportes"
import toast from "react-hot-toast"
import { generarPDF } from "./../../../../utils/servicePDF"
import { generarExcel } from "./../../../../utils/serviceExcel" // ✅ Agregar import
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
  const [inicializado, setInicializado] = useState(false) // ✅ Nuevo estado para controlar inicialización

  const reporte = obtenerIngresosEgresos.data
  const compras = listarPorFecha.data || []
  const ventas = listarVentaPorFecha.data || []

  const handleTabChange = (tab) => {
    setTabActivo(tab)
  }

  // ✅ Efecto para generar reporte automático al cargar el componente
  useEffect(() => {
    const generarReporteAutomatico = async () => {
      if (!inicializado) {
        try {
          await Promise.all([
            obtenerIngresosEgresos.mutateAsync({ fechaInicio: '', fechaFin: '' }), // ✅ Fechas vacías para todos los datos
            listarPorFecha.mutateAsync({ fechaInicio: '', fechaFin: '' }),
            listarVentaPorFecha.mutateAsync({ fechaInicio: '', fechaFin: '' })
          ])
          setReporteGenerado(true)
          setInicializado(true)
          console.log("Reporte inicializado automáticamente - Mostrando todos los registros")
        } catch (error) {
          console.error("Error generando reporte automático:", error)
          setInicializado(true) // Marcar como inicializado aunque falle
        }
      }
    }

    generarReporteAutomatico()
  }, []) 

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
    
    // ✅ Recargar datos sin filtros (todos los registros)
    obtenerIngresosEgresos.mutate({ fechaInicio: '', fechaFin: '' })
    listarPorFecha.mutate({ fechaInicio: '', fechaFin: '' })
    listarVentaPorFecha.mutate({ fechaInicio: '', fechaFin: '' })
    
    setReporteGenerado(true)
    toast.success("Mostrando todos los registros disponibles")
  }

  // ✅ Función para exportar PDF
  const handleExportarPDF = (opcion = "descargar") => {
    if (!reporteGenerado || !reporte) {
      toast.error("Primero genere un reporte")
      return
    }

    try {
      // ✅ Función para mapear datos de compras
      const mapearDatosCompras = (compra) => {
        return [
          compra.nroFactura || '-',
          compra.proveedor || '-',
          compra.usuario || '-',
          compra.fechaCompra ? new Date(compra.fechaCompra).toLocaleDateString('es-ES') : '-',
          compra.horaCompra || '-',
          compra.estado || '-',
          `Bs. ${parseFloat(compra.total || 0).toFixed(2)}`
        ]
      }

      // ✅ Función para mapear datos de ventas
      const mapearDatosVentas = (venta) => {
        return [
          venta.nroFactura || '-',
          venta.cliente || '-',
          venta.usuario || '-',
          venta.fechaVenta ? new Date(venta.fechaVenta).toLocaleDateString('es-ES') : '-',
          venta.horaVenta || '-',
          venta.estado || '-',
          `Bs. ${parseFloat(venta.subtotal || 0).toFixed(2)}`,
          `Bs. ${parseFloat(venta.descuento || 0).toFixed(2)}`,
          `Bs. ${parseFloat(venta.total || 0).toFixed(2)}`
        ]
      }

      generarPDF({
        titulo: "REPORTE DE INGRESOS Y EGRESOS",
        metadata: {
          "Periodo": fechaInicio && fechaFin ? `${fechaInicio} a ${fechaFin}` : "Todos los registros",
          "Generado por": "Sistema",
          "Fecha generación": new Date().toLocaleDateString(),
          "Sucursal": "Central"
        },
        secciones: [
          {
            titulo: "Resumen Financiero",
            tipo: "resumen",
            datos: {
              "Total Ingresos": `Bs. ${reporte.resumen?.totalIngresos?.toFixed(2) || '0.00'}`,
              "Total Egresos": `Bs. ${reporte.resumen?.totalEgresos?.toFixed(2) || '0.00'}`,
              "Balance Neto": `Bs. ${reporte.resumen?.balance?.toFixed(2) || '0.00'}`,
              "Margen": `${reporte.resumen?.margen || '0'}%`,
              "Ventas realizadas": reporte.resumen?.cantidadVentas || '0',
              "Compras realizadas": reporte.resumen?.cantidadCompras || '0'
            }
          },
          ...(compras.length > 0 ? [{
            titulo: "Compras del Periodo",
            tipo: "tabla",
            datos: compras,
            columnas: ['FACTURA', 'PROVEEDOR','USUARIO', 'FECHA','HORA', 'ESTADO', 'TOTAL'],
            mapearDatos: mapearDatosCompras, // ✅ Agregar mapeo personalizado
            color: [41, 128, 185]
          }] : []),
          ...(ventas.length > 0 ? [{
            titulo: "Ventas del Periodo",
            tipo: "tabla",
            datos: ventas,
            columnas: ['FACTURA', 'CLIENTE','USUARIO' ,'FECHA', 'HORA','ESTADO','SUBTOTAL', 'DESCUENTO', 'TOTAL'],
            mapearDatos: mapearDatosVentas, // ✅ Agregar mapeo personalizado
            color: [34, 153, 84]
          }] : [])
        ],
        nombreArchivo: `reporte_ingresos_egresos_${new Date().toISOString().split('T')[0]}.pdf`,
        opcion: opcion
      })

      if (opcion === "descargar") {
        toast.success("PDF descargado exitosamente")
      }
    } catch (error) {
      console.error("Error generando PDF:", error)
      toast.error(`Error al ${opcion === 'descargar' ? 'descargar' : 'imprimir'} PDF`)
    }
  }

  // ✅ Nueva función para exportar Excel
  const handleExportarExcel = () => {
    if (!reporteGenerado || !reporte) {
      toast.error("Primero genere un reporte")
      return
    }

    try {
      // ✅ Función para mapear datos de compras para Excel
      const mapearDatosComprasExcel = (compra) => {
        return {
          'FACTURA': compra.nroFactura || '-',
          'PROVEEDOR': compra.proveedor || '-',
          'USUARIO': compra.usuario || '-',
          'FECHA': compra.fechaCompra ? new Date(compra.fechaCompra).toLocaleDateString('es-ES') : '-',
          'HORA': compra.horaCompra || '-',
          'ESTADO': compra.estado || '-',
          'TOTAL': parseFloat(compra.total || 0)
        }
      }

      // ✅ Función para mapear datos de ventas para Excel
      const mapearDatosVentasExcel = (venta) => {
        return {
          'FACTURA': venta.nroFactura || '-',
          'CLIENTE': venta.cliente || '-',
          'USUARIO': venta.usuario || '-',
          'FECHA': venta.fechaVenta ? new Date(venta.fechaVenta).toLocaleDateString('es-ES') : '-',
          'HORA': venta.horaVenta || '-',
          'ESTADO': venta.estado || '-',
          'SUBTOTAL': parseFloat(venta.subtotal || 0),
          'DESCUENTO': parseFloat(venta.descuento || 0),
          'TOTAL': parseFloat(venta.total || 0)
        }
      }

      generarExcel({
        titulo: "REPORTE DE INGRESOS Y EGRESOS",
        metadata: {
          "Periodo": fechaInicio && fechaFin ? `${fechaInicio} a ${fechaFin}` : "Todos los registros",
          "Generado por": "Sistema",
          "Fecha generación": new Date().toLocaleDateString(),
          "Sucursal": "Central"
        },
        secciones: [
          {
            titulo: "Resumen Financiero",
            tipo: "resumen",
            datos: {
              "Total Ingresos": `Bs. ${reporte.resumen?.totalIngresos?.toFixed(2) || '0.00'}`,
              "Total Egresos": `Bs. ${reporte.resumen?.totalEgresos?.toFixed(2) || '0.00'}`,
              "Balance Neto": `Bs. ${reporte.resumen?.balance?.toFixed(2) || '0.00'}`,
              "Margen": `${reporte.resumen?.margen || '0'}%`,
              "Ventas realizadas": reporte.resumen?.cantidadVentas || '0',
              "Compras realizadas": reporte.resumen?.cantidadCompras || '0'
            }
          },
          ...(compras.length > 0 ? [{
            titulo: "Compras del Periodo",
            tipo: "tabla",
            datos: compras,
            columnas: ['FACTURA', 'PROVEEDOR','USUARIO', 'FECHA','HORA', 'ESTADO', 'TOTAL'],
            mapearDatos: mapearDatosComprasExcel // ✅ Agregar mapeo personalizado
          }] : []),
          ...(ventas.length > 0 ? [{
            titulo: "Ventas del Periodo",
            tipo: "tabla",
            datos: ventas,
            columnas: ['FACTURA', 'CLIENTE','USUARIO' ,'FECHA', 'HORA','ESTADO','SUBTOTAL', 'DESCUENTO', 'TOTAL'],
            mapearDatos: mapearDatosVentasExcel // ✅ Agregar mapeo personalizado
          }] : [])
        ],
        nombreArchivo: `reporte_ingresos_egresos_${new Date().toISOString().split('T')[0]}.xlsx`
      })

      toast.success("Excel descargado exitosamente")
    } catch (error) {
      console.error("Error generando Excel:", error)
      toast.error("Error al descargar Excel")
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
              onDescargarPDF={() => handleExportarPDF("descargar")}
              onImprimir={() => handleExportarPDF("imprimir")}
              onDescargarExcel={handleExportarExcel} // ✅ Agregar Excel
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
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Cargando reporte completo...</h3>
            <p className="text-gray-600">Generando análisis financiero de todos los registros</p>
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
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No hay datos disponibles</h3>
            <p className="text-gray-600">No se encontraron compras ni ventas en el sistema</p>
          </motion.div>
        )}

      </div>
    </div>
  )
}

export default IngresoEgreso