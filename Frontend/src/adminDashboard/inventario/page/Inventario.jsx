"use client"

import { useState, useEffect, useMemo } from "react"
import { motion } from "motion/react"
import { useInventario } from "../hooks/useInventario"
import { Package, Calendar } from "lucide-react"
import FiltrosInventario from "./../components/FiltrosInventario"
import ResumenInventario from "./../components/ResumenInventario"
import TablaInventario from "./../components/TablaInventario"
import TablaMovimientos from "./../components/TablaMovimientos"
import TabsInventario from "../components/TabsInventario"
import toast from "react-hot-toast"
import { generarPDF } from "./../../../utils/servicePDF"
import { MenuExportar } from "./../../../global/components/Menu/MenuExportar"
import { generarExcel } from "../../../utils/serviceExcel"

export const Inventario = () => {
  const { 
    estadoInventario, 
    reporteInventario, 
    movimientosInventario,
    estadoAutomatico,
    productos,
    categorias,
    productosPorCategoria
  } = useInventario()

  const estado = estadoInventario.data || estadoAutomatico.data
  const reporte = reporteInventario.data
  const movimientos = movimientosInventario.data

  const [filtros, setFiltros] = useState({
    categoriaId: '',
    productoId: '',
    conStockBajo: false,
    activos: true
  })
  
  const [filtrosReporte, setFiltrosReporte] = useState({
    tipoReporte: 'DETALLADO',
    fechaInicio: '',
    fechaFin: '',
    categoriaId: '',
    productoId: '',
    conStockBajo: false,
    activos: true
  })

  const [filtrosMovimientos, setFiltrosMovimientos] = useState({
    fechaInicio: '',
    fechaFin: '',
    tipoMovimiento: ''
  })

  const [reporteGenerado, setReporteGenerado] = useState(false)
  const [tabActivo, setTabActivo] = useState('estado')
  const [inicializado, setInicializado] = useState(false)

  const opcionesCategorias = useMemo(() => categorias.data || [], [categorias.data])
  const opcionesProductos = useMemo(() => productos.data || [], [productos.data])

  const [productosFiltrados, setProductosFiltrados] = useState(opcionesProductos)
  const [productosFiltradosReporte, setProductosFiltradosReporte] = useState(opcionesProductos)

  useEffect(() => {
    setProductosFiltrados(opcionesProductos)
    setProductosFiltradosReporte(opcionesProductos)
  }, [opcionesProductos])

  // Efecto para inicialización automática de todos los datos
  useEffect(() => {
    const inicializarDatos = async () => {
      if (!inicializado && categorias.data && productos.data) {
        try {
          // Ejecutar todas las consultas sin filtros de fecha
          await Promise.all([
            // Reporte sin filtros de fecha (todos los datos)
            reporteInventario.mutateAsync({
              tipoReporte: 'DETALLADO',
              fechaInicio: '',
              fechaFin: '',
              categoriaId: '',
              productoId: '',
              conStockBajo: false,
              activos: true
            }),
            // Movimientos sin filtros de fecha (todos los movimientos)
            movimientosInventario.mutateAsync({
              fechaInicio: '',
              fechaFin: '',
              tipoMovimiento: ''
            })
          ])

          setReporteGenerado(true)
          setInicializado(true)
          
          console.log("Datos inicializados automáticamente - Mostrando todos los registros")
        } catch (error) {
          console.error("Error en inicialización automática:", error)
          // Aún así marcamos como inicializado para no reintentar
          setInicializado(true)
        }
      }
    }

    inicializarDatos()
  }, [categorias.data, productos.data, inicializado, reporteInventario, movimientosInventario])

  const handleCategoriaChange = async (categoriaId, esReporte = false) => {
    if (esReporte) {
      const nuevosFiltros = { 
        ...filtrosReporte, 
        categoriaId,
        productoId: '' 
      }
      setFiltrosReporte(nuevosFiltros)
      
      if (categoriaId) {
        const resultado = await productosPorCategoria.mutateAsync(categoriaId)
        setProductosFiltradosReporte(Array.isArray(resultado) ? resultado : [])
      } else {
        setProductosFiltradosReporte(opcionesProductos)
      }
    } else {
      const nuevosFiltros = { 
        ...filtros, 
        categoriaId,
        productoId: '' 
      }
      setFiltros(nuevosFiltros)
      
      if (categoriaId) {
        const resultado = await productosPorCategoria.mutateAsync(categoriaId)
        setProductosFiltrados(Array.isArray(resultado) ? resultado : [])
      } else {
        setProductosFiltrados(opcionesProductos)
      }
    }
  }

  const handleFiltrosChange = (nuevosFiltros) => {
    if (nuevosFiltros.categoriaId !== undefined && nuevosFiltros.categoriaId !== filtros.categoriaId) {
      handleCategoriaChange(nuevosFiltros.categoriaId, false)
    } else {
      setFiltros(nuevosFiltros)
    }
  }

  const handleFiltrosReporteChange = (nuevosFiltros) => {
    if (nuevosFiltros.categoriaId !== undefined && nuevosFiltros.categoriaId !== filtrosReporte.categoriaId) {
      handleCategoriaChange(nuevosFiltros.categoriaId, true)
    } else {
      setFiltrosReporte(nuevosFiltros)
    }
  }

  const handleTabChange = (tab) => {
    setTabActivo(tab)
  }

  const consultarEstado = async () => {
    try {
      const filtrosLimpios = {}
      
      if (filtros.categoriaId) filtrosLimpios.categoriaId = filtros.categoriaId
      if (filtros.productoId) filtrosLimpios.productoId = filtros.productoId
      if (filtros.conStockBajo) filtrosLimpios.conStockBajo = filtros.conStockBajo
      if (filtros.activos !== undefined) filtrosLimpios.activos = filtros.activos
      
      await estadoInventario.mutateAsync(filtrosLimpios)
      
      setTabActivo('estado')
      setReporteGenerado(true)
      toast.success("Estado del inventario actualizado")
    } catch (error) {
      console.error("Error al consultar el inventario:", error)
      toast.error("Error al consultar el inventario")
    }
  }

  const generarReporte = async () => {
    try {
      const filtrosLimpios = {}
      
      if (filtrosReporte.tipoReporte) filtrosLimpios.tipoReporte = filtrosReporte.tipoReporte
      if (filtrosReporte.fechaInicio) filtrosLimpios.fechaInicio = filtrosReporte.fechaInicio
      if (filtrosReporte.fechaFin) filtrosLimpios.fechaFin = filtrosReporte.fechaFin
      if (filtrosReporte.categoriaId) filtrosLimpios.categoriaId = filtrosReporte.categoriaId
      if (filtrosReporte.productoId) filtrosLimpios.productoId = filtrosReporte.productoId
      if (filtrosReporte.conStockBajo) filtrosLimpios.conStockBajo = filtrosReporte.conStockBajo
      if (filtrosReporte.activos !== undefined) filtrosLimpios.activos = filtrosReporte.activos

      await reporteInventario.mutateAsync(filtrosLimpios)
      setTabActivo('reporte')
      setReporteGenerado(true)
      toast.success("Reporte generado exitosamente")
    } catch (error) {
      console.error("Error al generar reporte:", error)
      toast.error("Error al generar el reporte")
    }
  }

  const consultarMovimientos = async () => {
    try {
      const filtrosLimpios = {}
      if (filtrosMovimientos.fechaInicio) filtrosLimpios.fechaInicio = filtrosMovimientos.fechaInicio
      if (filtrosMovimientos.fechaFin) filtrosLimpios.fechaFin = filtrosMovimientos.fechaFin
      if (filtrosMovimientos.tipoMovimiento) filtrosLimpios.tipoMovimiento = filtrosMovimientos.tipoMovimiento

      await movimientosInventario.mutateAsync(filtrosLimpios)
      setTabActivo('movimientos')
      setReporteGenerado(true)
      toast.success("Movimientos cargados exitosamente")
    } catch (error) {
      console.error("Error al cargar movimientos:", error)
      toast.error("Error al cargar movimientos")
    }
  }

  const limpiarFiltros = () => {
    setFiltros({
      categoriaId: '',
      productoId: '',
      conStockBajo: false,
      activos: true
    })
    setFiltrosReporte({
      tipoReporte: 'DETALLADO',
      fechaInicio: '',
      fechaFin: '',
      categoriaId: '',
      productoId: '',
      conStockBajo: false,
      activos: true
    })
    setFiltrosMovimientos({
      fechaInicio: '',
      fechaFin: '',
      tipoMovimiento: ''
    })
    
    setProductosFiltrados(opcionesProductos)
    setProductosFiltradosReporte(opcionesProductos)
    
    // Recargar datos sin filtros
    estadoAutomatico.refetch()
    reporteInventario.mutate({
      tipoReporte: 'DETALLADO',
      fechaInicio: '',
      fechaFin: '',
      categoriaId: '',
      productoId: '',
      conStockBajo: false,
      activos: true
    })
    movimientosInventario.mutate({
      fechaInicio: '',
      fechaFin: '',
      tipoMovimiento: ''
    })
    
    setTabActivo('estado')
    toast.success("Filtros limpiados")
  }

  // Resto del código permanece igual...
  const handleExportarPDF = (opcion = "descargar") => {
    if (!reporteGenerado || (!estado && !reporte && !movimientos)) {
      toast.error("Primero genere un estado o reporte")
      return
    }

    try {
      const datosExportar = tabActivo === 'estado' ? estado : 
                           tabActivo === 'reporte' ? reporte : 
                           { tipo: 'MOVIMIENTOS', movimientosDetallados: movimientos }
      
      const estadisticasExportar = datosExportar?.estadisticas

    generarPDF({
        titulo: tabActivo === 'estado' ? "REPORTE DE ESTADO DE INVENTARIO" : 
                tabActivo === 'reporte' ? `REPORTE DE INVENTARIO - ${reporte?.tipoReporte}` :
                "REPORTE DE MOVIMIENTOS DE INVENTARIO",
        metadata: {
          "Generado por": "Sistema",
          "Fecha generación": new Date().toLocaleDateString(),
          "Sucursal": "Central",
          ...(tabActivo === 'reporte' && reporte?.parametros ? {
            "Tipo Reporte": reporte.parametros.tipoReporte,
            ...(reporte.parametros.fechaInicio && {
              "Periodo": `${reporte.parametros.fechaInicio} a ${reporte.parametros.fechaFin}`
            })
          } : {}),
          ...(tabActivo === 'movimientos' && {
            "Periodo": `${filtrosMovimientos.fechaInicio} a ${filtrosMovimientos.fechaFin}`
          })
        },
        secciones: [
          ...(estadisticasExportar ? [{
            titulo: "Resumen del Inventario",
            tipo: "resumen",
            datos: {
              "Total Productos": estadisticasExportar.totalProductos?.toString() || '0',
              "Total Variantes": estadisticasExportar.totalVariantes?.toString() || '0',
              "Stock Total": estadisticasExportar.stockTotal?.toString() || '0',
              "Valor Total Inventario": `Bs. ${estadisticasExportar.valorTotalInventario?.toFixed(2) || '0.00'}`,
              "Productos con Stock Bajo": estadisticasExportar.productosStockBajo?.toString() || '0'
            }
          }] : []),
          ...(tabActivo === 'estado' && datosExportar?.inventario && datosExportar.inventario.length > 0 ? [{
            titulo: "Detalle del Inventario",
            tipo: "tabla",
            datos: datosExportar.inventario,
            columnas: ['PRODUCTO', 'MARCA', 'CATEGORIA', 'TALLA', 'COLOR', 'STOCK', 'MINIMO', 'ESTADO', 'PRECIO', 'VALOR TOTAL'],
            color: [41, 128, 185]
          }] : []),
          ...(tabActivo === 'reporte' && datosExportar?.inventario && datosExportar.inventario.length > 0 ? [{
            titulo: "Detalle del Reporte",
            tipo: "tabla",
            datos: datosExportar.inventario,
            columnas: ['PRODUCTO', 'MARCA', 'CATEGORIA', 'TALLA', 'COLOR', 'STOCK', 'MINIMO', 'ESTADO', 'PRECIO', 'VALOR TOTAL'],
            color: [41, 128, 185]
          }] : []),
          ...(tabActivo === 'movimientos' && movimientos && movimientos.length > 0 ? [{
            titulo: "Movimientos de Inventario",
            tipo: "tabla",
            datos: movimientos,
            columnas: ['FECHA', 'TIPO', 'PRODUCTO', 'CATEGORIA', 'TALLA', 'COLOR', 'CANTIDAD', 'MOTIVO', 'DOCUMENTO'],
            color: [34, 153, 84]
          }] : [])
        ],
        nombreArchivo: `${tabActivo === 'estado' ? 'estado_inventario' : 
                       tabActivo === 'reporte' ? `reporte_${filtrosReporte.tipoReporte.toLowerCase()}` :
                       'movimientos_inventario'}_${new Date().toISOString().split('T')[0]}.pdf`,
        opcion: opcion
      })

      if (opcion === "descargar") {
        toast.success("PDF descargado exitosamente")
      }
    } catch (error) {
      console.error("Error al exportar PDF:", error)
      toast.error(`Error al ${opcion === 'descargar' ? 'descargar' : 'imprimir'} PDF`)
    }
  }

  const handleExportarExcel = () => {
    if (!reporteGenerado || (!estado && !reporte && !movimientos)) {
      toast.error("Primero genere un estado o reporte")
      return
    }

    try {
      const datosExportar = tabActivo === 'estado' ? estado : 
                          tabActivo === 'reporte' ? reporte : 
                          { tipo: 'MOVIMIENTOS', movimientosDetallados: movimientos }
      
      const estadisticasExportar = datosExportar?.estadisticas

      generarExcel({
        titulo: tabActivo === 'estado' ? "REPORTE DE ESTADO DE INVENTARIO" : 
                tabActivo === 'reporte' ? `REPORTE DE INVENTARIO - ${reporte?.tipoReporte}` :
                "REPORTE DE MOVIMIENTOS DE INVENTARIO",
        metadata: {
          "Generado por": "Sistema",
          "Fecha generación": new Date().toLocaleDateString(),
          "Sucursal": "Central",
          ...(tabActivo === 'reporte' && reporte?.parametros ? {
            "Tipo Reporte": reporte.parametros.tipoReporte,
            ...(reporte.parametros.fechaInicio && {
              "Periodo": `${reporte.parametros.fechaInicio} a ${reporte.parametros.fechaFin}`
            })
          } : {}),
          ...(tabActivo === 'movimientos' && {
            "Periodo": `${filtrosMovimientos.fechaInicio} a ${filtrosMovimientos.fechaFin}`
          })
        },
        secciones: [
          ...(estadisticasExportar ? [{
            titulo: "Resumen del Inventario",
            tipo: "resumen",
            datos: {
              "Total Productos": estadisticasExportar.totalProductos?.toString() || '0',
              "Total Variantes": estadisticasExportar.totalVariantes?.toString() || '0',
              "Stock Total": estadisticasExportar.stockTotal?.toString() || '0',
              "Valor Total Inventario": `Bs. ${estadisticasExportar.valorTotalInventario?.toFixed(2) || '0.00'}`,
              "Productos con Stock Bajo": estadisticasExportar.productosStockBajo?.toString() || '0'
            }
          }] : []),
          ...(tabActivo === 'estado' && datosExportar?.inventario && datosExportar.inventario.length > 0 ? [{
            titulo: "Detalle del Inventario",
            tipo: "tabla",
            datos: datosExportar.inventario,
            columnas: ['PRODUCTO', 'MARCA', 'CATEGORIA', 'TALLA', 'COLOR', 'STOCK', 'MINIMO', 'ESTADO', 'PRECIO', 'VALOR TOTAL']
          }] : []),
          ...(tabActivo === 'reporte' && datosExportar?.inventario && datosExportar.inventario.length > 0 ? [{
            titulo: "Detalle del Reporte",
            tipo: "tabla",
            datos: datosExportar.inventario,
            columnas: ['PRODUCTO', 'MARCA', 'CATEGORIA', 'TALLA', 'COLOR', 'STOCK', 'MINIMO', 'ESTADO', 'PRECIO', 'VALOR TOTAL']
          }] : []),
          ...(tabActivo === 'movimientos' && movimientos && movimientos.length > 0 ? [{
            titulo: "Movimientos de Inventario",
            tipo: "tabla",
            datos: movimientos,
            columnas: ['FECHA', 'TIPO', 'PRODUCTO', 'CATEGORIA', 'TALLA', 'COLOR', 'CANTIDAD', 'MOTIVO', 'DOCUMENTO']
          }] : [])
        ],
        nombreArchivo: `${tabActivo === 'estado' ? 'estado_inventario' : 
                      tabActivo === 'reporte' ? `reporte_${filtrosReporte.tipoReporte.toLowerCase()}` :
                      'movimientos_inventario'}_${new Date().toISOString().split('T')[0]}.xlsx`
      })

      toast.success("Excel descargado exitosamente")
    } catch (error) {
      console.error("Error al exportar Excel:", error)
      toast.error("Error al descargar Excel")
    }
  }

  const renderContenidoTab = () => {
    switch (tabActivo) {
      case 'estado':
        return (
          <>
            <ResumenInventario datos={estado} tipo="estado" />
            {estado?.inventario && estado.inventario.length > 0 && (
              <TablaInventario 
                inventario={estado.inventario} 
                loading={estadoInventario.isPending}
              />
            )}
          </>
        )
      
      case 'reporte':
        return (
          <>
            <ResumenInventario datos={reporte} tipo="reporte" />
            {reporte?.inventario && reporte.inventario.length > 0 && (
              <TablaInventario 
                inventario={reporte.inventario} 
                loading={reporteInventario.isPending}
              />
            )}
          </>
        )
      
      case 'movimientos':
        return (
          <>
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Movimientos de Inventario</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={filtrosMovimientos.fechaInicio}
                    onChange={(e) => setFiltrosMovimientos({...filtrosMovimientos, fechaInicio: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Fin</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={filtrosMovimientos.fechaFin}
                    onChange={(e) => setFiltrosMovimientos({...filtrosMovimientos, fechaFin: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo Movimiento</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={filtrosMovimientos.tipoMovimiento}
                    onChange={(e) => setFiltrosMovimientos({...filtrosMovimientos, tipoMovimiento: e.target.value})}
                  >
                    <option value="">Todos los tipos</option>
                    <option value="ENTRADA_COMPRA">Entrada por Compra</option>
                    <option value="SALIDA_VENTA">Salida por Venta</option>
                    <option value="ENTRADA_DEVOLUCION">Entrada por Devolución</option>
                    <option value="SALIDA_AJUSTE">Salida por Ajuste</option>
                    <option value="ENTRADA_AJUSTE">Entrada por Ajuste</option>
                  </select>
                </div>
                <div className="flex items-end gap-2">
                  <button
                    onClick={consultarMovimientos}
                    disabled={movimientosInventario.isPending}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {movimientosInventario.isPending ? 'Cargando...' : 'Consultar Movimientos'}
                  </button>
                  <button
                    onClick={() => {
                      setFiltrosMovimientos({ fechaInicio: '', fechaFin: '', tipoMovimiento: '' })
                      // Recargar movimientos sin filtros
                      movimientosInventario.mutate({
                        fechaInicio: '',
                        fechaFin: '',
                        tipoMovimiento: ''
                      })
                    }}
                    className="px-3 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Limpiar
                  </button>
                </div>
              </div>
            </div>

            {movimientos && movimientos.length > 0 && (
              <TablaMovimientos 
                movimientos={movimientos} 
                loading={movimientosInventario.isPending}
              />
            )}

            {movimientosInventario.isIdle && !movimientos && (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <Calendar size={48} className="text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Cargando movimientos...</h3>
                <p className="text-gray-600">Obteniendo todos los movimientos de inventario</p>
              </div>
            )}
          </>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-600 rounded-lg">
              <Package className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Gestión de Inventario</h1>
          </div>
          <p className="text-gray-600 ml-11">Control y análisis del stock de productos</p>
          <div className="w-20 h-1 bg-green-600 mt-2 ml-11 rounded-full"></div>
        </motion.div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <MenuExportar 
              onDescargarPDF={() => handleExportarPDF("descargar")}
              onImprimir={() => handleExportarPDF("imprimir")}
              onDescargarExcel={handleExportarExcel}
              disabled={!reporteGenerado || (!estado && !reporte && !movimientos)}
            />
          </div>

          <TabsInventario
            tabActivo={tabActivo}
            onTabChange={handleTabChange}
          />

          {tabActivo === 'estado' && (
            <FiltrosInventario
              filtros={filtros}
              onFiltrosChange={handleFiltrosChange}
              onConsultar={consultarEstado}
              onLimpiar={limpiarFiltros}
              loading={estadoInventario.isPending}
              categorias={opcionesCategorias}
              productos={productosFiltrados}
              categoriasLoading={categorias.isLoading}
              productosLoading={productosPorCategoria.isPending || productos.isLoading}
            />
          )}

          {tabActivo === 'reporte' && (
            <FiltrosInventario
              filtros={filtrosReporte}
              onFiltrosChange={handleFiltrosReporteChange}
              onConsultar={generarReporte}
              onLimpiar={limpiarFiltros}
              loading={reporteInventario.isPending}
              esReporte={true}
              categorias={opcionesCategorias}
              productos={productosFiltradosReporte}
              categoriasLoading={categorias.isLoading}
              productosLoading={productosPorCategoria.isPending || productos.isLoading}
            />
          )}
        </div>

        {renderContenidoTab()}

        {/* Estados de carga mejorados */}
        {(estadoAutomatico.isLoading && !estado) && (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando estado del inventario...</p>
          </div>
        )}

        {(reporteInventario.isPending && !reporte && tabActivo === 'reporte') && (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando reporte general...</p>
          </div>
        )}

        {(movimientosInventario.isPending && !movimientos && tabActivo === 'movimientos') && (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando todos los movimientos...</p>
          </div>
        )}

        {reporteGenerado && (
          <>
            {tabActivo === 'estado' && estado?.inventario?.length === 0 && (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <Package size={48} className="text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {estadoInventario.isPending ? 'Cargando...' : 'No hay productos en el inventario'}
                </h3>
                <p className="text-gray-600">
                  {estadoInventario.isPending ? 'Buscando productos...' : 'No se encontraron productos con los filtros aplicados'}
                </p>
              </div>
            )}

            {tabActivo === 'reporte' && reporte?.inventario?.length === 0 && (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <Package size={48} className="text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">No hay datos para el reporte</h3>
                <p className="text-gray-600">No se encontraron productos con los filtros aplicados</p>
              </div>
            )}

            {tabActivo === 'movimientos' && movimientos?.length === 0 && !movimientosInventario.isPending && (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <Calendar size={48} className="text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">No hay movimientos</h3>
                <p className="text-gray-600">No se encontraron movimientos en el sistema</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}