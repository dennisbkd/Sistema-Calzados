"use client"

import { useState, useMemo, useEffect } from "react"
import { motion } from "motion/react"
import { useCompra } from "./hooks/useCompra"
import useProductoManager from "./../producto.jsx/hook/query/useProductoManager"
import { useProveedores } from "./../proveedor/hooks/useProveedores"
import HeaderCompras from "./components/HeaderCompras"
import FiltrosCompras from "./components/FiltrosCompras"
import EstadisticasCompras from "./components/EstadisticasCompras"
import TablaCompras from "./components/TablaCompras"
import ModalCompras from "./components/ModalCompras"
import ModalDetalles from "./components/ModalDetalles"
import { SpinnerCargando } from "./../../global/components/SpinnerCargando"
import { MenuExportar } from "./../../global/components/Menu/MenuExportar"
import { generarPDF } from "./../../utils/servicePDF"
import { generarExcel } from "./../../utils/serviceExcel"
import toast from "react-hot-toast"

const GestionCompras = () => {
  const {
    listar,
    crear,
    editar,
    eliminar,
    generateCodigoFactura,
    cambiarEstadoCompra
  } = useCompra()

  const { productos = [], isLoading: cargandoProductos } = useProductoManager()
  const { data: proveedoresData = [], isLoading: cargandoProveedores } = useProveedores()
  const usuario = JSON.parse(localStorage.getItem("usuario")) || { id: 1 }
  
  // Usar los datos del hook useCompra
  const compras = useMemo(() => listar?.data || [], [listar?.data])
  const proveedores = proveedoresData || []

  // Estados principales
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCompras, setSelectedCompras] = useState([])
  const [editingCompra, setEditingCompra] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedCompraDetails, setSelectedCompraDetails] = useState(null)
  const [menuEstadoAbierto, setMenuEstadoAbierto] = useState(null)

  // Estados de filtros
  const [filtroEstado, setFiltroEstado] = useState("TODAS")
  const [filtroMes, setFiltroMes] = useState("")
  const [filtroAnio, setFiltroAnio] = useState("")
  const [menuFiltrosAbierto, setMenuFiltrosAbierto] = useState(false)

  // Estados de paginación
  const [paginaActual, setPaginaActual] = useState(1)
  const [itemsPorPagina, setItemsPorPagina] = useState(10)

  // Obtener todas las variantes de productos
  const todasLasVariantes = useMemo(() => {
    return productos.flatMap(producto =>
      (producto.variantes || []).map(variante => ({
        ...variante,
        productoId: producto.id,
        productoNombre: producto.nombre,
        productoMarca: producto.marca,
        productoCategoria: producto.categoria
      }))
    )
  }, [productos])

  // Obtener años y meses únicos para filtros
  const { años, meses } = useMemo(() => {
    const añosUnicos = [...new Set(compras.map(c => new Date(c.fechaCompra).getFullYear()))].sort((a, b) => b - a)
    const mesesUnicos = [
      { value: "01", label: "Enero" }, { value: "02", label: "Febrero" }, { value: "03", label: "Marzo" },
      { value: "04", label: "Abril" }, { value: "05", label: "Mayo" }, { value: "06", label: "Junio" },
      { value: "07", label: "Julio" }, { value: "08", label: "Agosto" }, { value: "09", label: "Septiembre" },
      { value: "10", label: "Octubre" }, { value: "11", label: "Noviembre" }, { value: "12", label: "Diciembre" }
    ]
    return { años: añosUnicos, meses: mesesUnicos }
  }, [compras])

  // Filtrar compras
  const filteredCompras = useMemo(() => {
    return compras.filter((c) => {
      const matchesSearch =
        c.nroFactura?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.proveedor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.usuario?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesEstado = filtroEstado === "TODAS" || c.estado === filtroEstado

      const fechaCompra = new Date(c.fechaCompra)
      const matchesMes = !filtroMes || (fechaCompra.getMonth() + 1).toString().padStart(2, '0') === filtroMes
      const matchesAnio = !filtroAnio || fechaCompra.getFullYear().toString() === filtroAnio

      return matchesSearch && matchesEstado && matchesMes && matchesAnio
    })
  }, [compras, searchTerm, filtroEstado, filtroMes, filtroAnio])

  // Resetear paginación cuando cambian los filtros
  useEffect(() => {
    setPaginaActual(1)
  }, [searchTerm, filtroEstado, filtroMes, filtroAnio])

  // Handlers para exportación
  const handleExportarPDF = (opcion = "descargar") => {
    if (filteredCompras.length === 0) {
      toast.error("No hay compras para exportar")
      return
    }

    try {
      const mapearDatosCompras = (compra) => {
        return [
          compra.nroFactura || '-',
          compra.proveedor || '-',
          compra.usuario || '-',
          compra.fechaCompra ? new Date(compra.fechaCompra).toLocaleDateString('es-ES') : '-',
          `Bs. ${parseFloat(compra.total || 0).toFixed(2)}`,
          compra.estado || '-'
        ]
      }

      generarPDF({
        titulo: "REPORTE DE COMPRAS",
        metadata: {
          "Generado por": "Sistema",
          "Fecha generación": new Date().toLocaleDateString(),
          "Sucursal": "Central",
          "Total de Compras": filteredCompras.length.toString(),
          "Periodo": `${filtroMes ? meses.find(m => m.value === filtroMes)?.label + ' ' : ''}${filtroAnio || 'Todos los años'}`,
          "Estado": filtroEstado === "TODAS" ? "Todos" : filtroEstado
        },
        secciones: [
          {
            titulo: "Resumen de Compras",
            tipo: "resumen",
            datos: {
              "Total Compras": filteredCompras.length.toString(),
              "Compras Pagadas": filteredCompras.filter(c => c.estado === "PAGADA").length.toString(),
              "Compras Registradas": filteredCompras.filter(c => c.estado === "REGISTRADA").length.toString(),
              "Compras Anuladas": filteredCompras.filter(c => c.estado === "ANULADA").length.toString(),
              "Monto Total": `Bs. ${filteredCompras.reduce((total, compra) => total + parseFloat(compra.total || 0), 0).toFixed(2)}`
            }
          },
          {
            titulo: "Detalle de Compras",
            tipo: "tabla",
            datos: filteredCompras,
            columnas: ['NRO FACTURA', 'PROVEEDOR', 'USUARIO', 'FECHA', 'TOTAL', 'ESTADO'],
            mapearDatos: mapearDatosCompras,
            color: [41, 128, 185]
          }
        ],
        nombreArchivo: `reporte_compras_${new Date().toISOString().split('T')[0]}.pdf`,
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
    if (filteredCompras.length === 0) {
      toast.error("No hay compras para exportar")
      return
    }

    try {
      const mapearDatosComprasExcel = (compra) => {
        return {
          'NRO FACTURA': compra.nroFactura || '-',
          'PROVEEDOR': compra.proveedor || '-',
          'USUARIO': compra.usuario || '-',
          'FECHA': compra.fechaCompra ? new Date(compra.fechaCompra).toLocaleDateString('es-ES') : '-',
          'TOTAL': parseFloat(compra.total || 0),
          'ESTADO': compra.estado || '-'
        }
      }

      generarExcel({
        titulo: "REPORTE DE COMPRAS",
        metadata: {
          "Generado por": "Sistema",
          "Fecha generación": new Date().toLocaleDateString(),
          "Sucursal": "Central",
          "Total de Compras": filteredCompras.length.toString(),
          "Periodo": `${filtroMes ? meses.find(m => m.value === filtroMes)?.label + ' ' : ''}${filtroAnio || 'Todos los años'}`,
          "Estado": filtroEstado === "TODAS" ? "Todos" : filtroEstado
        },
        secciones: [
          {
            titulo: "Resumen de Compras",
            tipo: "resumen",
            datos: {
              "Total Compras": filteredCompras.length.toString(),
              "Compras Pagadas": filteredCompras.filter(c => c.estado === "PAGADA").length.toString(),
              "Compras Registradas": filteredCompras.filter(c => c.estado === "REGISTRADA").length.toString(),
              "Compras Anuladas": filteredCompras.filter(c => c.estado === "ANULADA").length.toString(),
              "Monto Total": `Bs. ${filteredCompras.reduce((total, compra) => total + parseFloat(compra.total || 0), 0).toFixed(2)}`
            }
          },
          {
            titulo: "Detalle de Compras",
            tipo: "tabla",
            datos: filteredCompras,
            columnas: ['NRO FACTURA', 'PROVEEDOR', 'USUARIO', 'FECHA', 'TOTAL', 'ESTADO'],
            mapearDatos: mapearDatosComprasExcel // ✅ Agregar esta línea
          }
        ],
        nombreArchivo: `reporte_compras_${new Date().toISOString().split('T')[0]}.xlsx`
      })

      toast.success("Excel descargado exitosamente")
    } catch (error) {
      console.error("Error al exportar Excel:", error)
      toast.error("Error al descargar Excel")
    }
  }

  // Handlers
  const openModal = (compra = null) => {
    setEditingCompra(compra)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingCompra(null)
    setSelectedCompras([])
  }

  const openDetailsModal = (compra) => {
    setSelectedCompraDetails(compra)
    setShowDetailsModal(true)
  }

  const closeDetailsModal = () => {
    setShowDetailsModal(false)
    setSelectedCompraDetails(null)
  }

  const limpiarFiltros = () => {
    setFiltroEstado("TODAS")
    setFiltroMes("")
    setFiltroAnio("")
    setSearchTerm("")
  }

  // Handler para cambiar estado de compra
  const handleCambiarEstado = (compra, nuevoEstado) => {
    cambiarEstadoCompra.mutate({
      id: compra.id,
      estado: nuevoEstado
    }, {
      onSuccess: () => {
        toast.success(`Estado cambiado a ${nuevoEstado.toLowerCase()}`)
        setMenuEstadoAbierto(null)
      }
    })
  }

  // Handler para eliminar compra
  const handleDelete = (compra) => {
    if (compra?.id && eliminar?.mutate) {
      eliminar.mutate(compra.id, {
        onSuccess: () => {
          toast.success("Compra anulada correctamente")
        }
      })
    }
  }

  // Formatear moneda
  const formatCurrency = (amount) => {
    const numAmount = parseFloat(amount) || 0
    return new Intl.NumberFormat('es-BO', {
      style: 'currency',
      currency: 'BOB'
    }).format(numAmount)
  }

  // Obtener color según estado
  const getEstadoColor = (estado) => {
    switch (estado) {
      case "PAGADA": return "bg-green-100 text-green-800 border border-green-200"
      case "REGISTRADA": return "bg-blue-100 text-blue-800 border border-blue-200"
      case "ANULADA": return "bg-red-100 text-red-800 border border-red-200"
      default: return "bg-gray-100 text-gray-800 border border-gray-200"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <HeaderCompras />
        
        {/* Barra de herramientas con MenuExportar */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ delay: 0.1 }} 
          className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 border border-blue-100"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <MenuExportar 
              onDescargarPDF={() => handleExportarPDF("descargar")}
              onImprimir={() => handleExportarPDF("imprimir")}
              onDescargarExcel={handleExportarExcel}
              disabled={filteredCompras.length === 0}
            />
          </div>
        </motion.div>
        
        <FiltrosCompras
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filtroEstado={filtroEstado}
          setFiltroEstado={setFiltroEstado}
          filtroMes={filtroMes}
          setFiltroMes={setFiltroMes}
          filtroAnio={filtroAnio}
          setFiltroAnio={setFiltroAnio}
          menuFiltrosAbierto={menuFiltrosAbierto}
          setMenuFiltrosAbierto={setMenuFiltrosAbierto}
          meses={meses}
          años={años}
          limpiarFiltros={limpiarFiltros}
          openModal={openModal}
        />

        <EstadisticasCompras compras={filteredCompras} />

        <TablaCompras
          compras={filteredCompras}
          paginaActual={paginaActual}
          setPaginaActual={setPaginaActual}
          itemsPorPagina={itemsPorPagina}
          setItemsPorPagina={setItemsPorPagina}
          selectedCompras={selectedCompras}
          setSelectedCompras={setSelectedCompras}
          menuEstadoAbierto={menuEstadoAbierto}
          setMenuEstadoAbierto={setMenuEstadoAbierto}
          openModal={openModal}
          openDetailsModal={openDetailsModal}
          cambiarEstado={handleCambiarEstado}
          eliminarCompra={handleDelete}
          formatCurrency={formatCurrency}
          getEstadoColor={getEstadoColor}
          isLoading={listar.isLoading}
        />

        {/* Modales */}
        <ModalCompras
          showModal={showModal}
          closeModal={closeModal}
          editingCompra={editingCompra}
          proveedores={proveedores}
          cargandoProveedores={cargandoProveedores}
          todasLasVariantes={todasLasVariantes}
          cargandoProductos={cargandoProductos}
          generateCodigoFactura={generateCodigoFactura}
          crear={crear}
          editar={editar}
          usuario={usuario}
        />

        <ModalDetalles
          showDetailsModal={showDetailsModal}
          closeDetailsModal={closeDetailsModal}
          selectedCompraDetails={selectedCompraDetails}
          formatCurrency={formatCurrency}
          getEstadoColor={getEstadoColor}
        />

        {/* Overlay de carga cuando se está creando/editando */}
        {(crear.isPending || editar.isPending) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50"
          >
            <div className="bg-white rounded-xl p-6 flex flex-col items-center gap-4 border-1 border-gray-300 shadow-lg">
              <SpinnerCargando
                tamaño="lg"
                texto={
                  crear.isPending
                    ? "Creando Compra..."
                    : "Editando Compra..."
                }
              />
              <p className="text-sm text-gray-600">
                {crear.isPending
                  ? "Estamos procesando tu compra..."
                  : "Estamos editando la compra..."}
              </p>
            </div>
          </motion.div>
        )}

        {/* Loading inicial */}
        {listar.isLoading && (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <SpinnerCargando tamaño="lg" texto="Cargando compras..." />
          </div>
        )}
      </div>
    </div>
  )
}

export default GestionCompras