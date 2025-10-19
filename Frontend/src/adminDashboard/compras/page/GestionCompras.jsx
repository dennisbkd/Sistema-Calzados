"use client"

import { useState, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import { useCompra } from "../hooks/useCompra"
import useProductoManager from "../../producto.jsx/hook/query/useProductoManager"
import { useProveedores } from "../../proveedor/hooks/useProveedores"
import { 
  Pencil, 
  Plus, 
  RefreshCcw, 
  Save, 
  Search, 
  Trash2, 
  FileText, 
  Calendar, 
  User, 
  Building,
  Filter,
  ChevronDown,
  X,
  Package,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  AlertTriangle,
  Download,
  Printer
} from "lucide-react"
import toast from "react-hot-toast"
import { generarPDFCompra } from "../facturaCompra/FacturaCompra"

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
  
  const compras = listar.data || []
  const proveedores = proveedoresData || []

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCompras, setSelectedCompras] = useState([])
  const [editingCompra, setEditingCompra] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedCompraDetails, setSelectedCompraDetails] = useState(null)
  const [menuEstadoAbierto, setMenuEstadoAbierto] = useState(null)
  
  const [filtroEstado, setFiltroEstado] = useState("TODAS")
  const [filtroMes, setFiltroMes] = useState("")
  const [filtroAnio, setFiltroAnio] = useState("")
  const [menuFiltrosAbierto, setMenuFiltrosAbierto] = useState(false)

  const [paginaActual, setPaginaActual] = useState(1)
  const [itemsPorPagina, setItemsPorPagina] = useState(10)

  const [nroFacturaInput, setNroFacturaInput] = useState("")
  const [/*totalInput*/, setTotalInput] = useState("")
  const [estadoInput, setEstadoInput] = useState("REGISTRADA")
  const [proveedorInput, setProveedorInput] = useState("")
  const [fechaCompraInput, setFechaCompraInput] = useState("")
  const [detallesInput, setDetallesInput] = useState([])
  const [generandoCodigo, setGenerandoCodigo] = useState(false)

  const [nuevoDetalle, setNuevoDetalle] = useState({
    varianteId: "",
    cantidad: "",
    precioUnitario: "",
    varianteSeleccionada: null
  })

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

  // Calcular total automáticamente
  const totalCalculado = useMemo(() => {
    return detallesInput.reduce((total, detalle) => {
      return total + (detalle.cantidad * detalle.precioUnitario)
    }, 0)
  }, [detallesInput])

  useEffect(() => {
    setTotalInput(totalCalculado.toFixed(2))
  }, [totalCalculado])

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

  // Generar código de factura
  const generarCodigoFacturaF = async () => {
    if (!generateCodigoFactura) return
    setGenerandoCodigo(true)
    generateCodigoFactura.mutate(undefined, {
      onSuccess: (data) => setNroFacturaInput(data || "FAC-"),
      onSettled: () => setGenerandoCodigo(false)
    })
  }

  // Generar factura PDF
  const generarFactura = (compra, opcion) => {
    try {
      const datosParaFactura = {
        nroFactura: compra.nroFactura,
        fecha: compra.fechaCompra,
        hora: compra.horaCompra,
        proveedor: compra.proveedor,
        usuario: compra.usuario,
        total: compra.total,
        detalles: compra.detalles?.map(detalle => ({
          descripcion: detalle.producto,
          marca: detalle.marca,
          codigo: detalle.codigo,
          color: detalle.color,
          talla: detalle.talla,
          cantidad: detalle.cantidad,
          precioUnitario: detalle.precioUnitario,
          subtotal: detalle.subtotal
        })) || []
      }

      generarPDFCompra(datosParaFactura, opcion)
    } catch (error) {
      console.error("Error al generar factura:", error)
      toast.error("Error al generar la factura")
    }
  }

  // Abrir modal para crear/editar
  const openModal = (compra = null) => {
    setNroFacturaInput("")
    setTotalInput("")
    setEstadoInput("REGISTRADA")
    setProveedorInput("")
    setFechaCompraInput(new Date().toISOString().split('T')[0])
    setDetallesInput([])
    setNuevoDetalle({
      varianteId: "",
      cantidad: "",
      precioUnitario: "",
      varianteSeleccionada: null
    })
    
    setEditingCompra(compra)
    
    if (compra) {
      setNroFacturaInput(compra.nroFactura || "")
      setTotalInput(compra.total?.toString() || "")
      setEstadoInput(compra.estado || "REGISTRADA")
      setProveedorInput(compra.proveedor || "")
      
      const fecha = compra.fechaCompra ? compra.fechaCompra.split('T')[0] : new Date().toISOString().split('T')[0]
      setFechaCompraInput(fecha)
      
      if (compra.detalles && Array.isArray(compra.detalles)) {
        const detallesCargados = compra.detalles.map(detalle => ({
          id: detalle.id,
          varianteId: detalle.varianteId?.toString() || "",
          producto: detalle.producto || "",
          marca: detalle.marca || "",
          codigo: detalle.codigo || "",
          color: detalle.color || "",
          talla: detalle.talla || "",
          cantidad: detalle.cantidad || 1,
          precioUnitario: detalle.precioUnitario || 0,
          subtotal: detalle.subtotal || 0
        }))
        setDetallesInput(detallesCargados)
      } else {
        setDetallesInput([])
      }
    } else {
      generarCodigoFacturaF()
    }
    setShowModal(true)
  }

  // Cerrar modal
  const closeModal = () => {
    setShowModal(false)
    setEditingCompra(null)
    setSelectedCompras([])
    setTimeout(() => {
      setNroFacturaInput("")
      setTotalInput("")
      setEstadoInput("REGISTRADA")
      setProveedorInput("")
      setFechaCompraInput(new Date().toISOString().split('T')[0])
      setDetallesInput([])
      setNuevoDetalle({
        varianteId: "",
        cantidad: "",
        precioUnitario: "",
        varianteSeleccionada: null
      })
    }, 300)
  }

  // Abrir modal de detalles
  const openDetailsModal = (compra) => {
    setSelectedCompraDetails(compra)
    setShowDetailsModal(true)
  }

  // Cerrar modal de detalles
  const closeDetailsModal = () => {
    setShowDetailsModal(false)
    setSelectedCompraDetails(null)
  }

  // Cambiar estado de compra
  const cambiarEstado = (compra, nuevoEstado) => {
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

  // Agregar detalle a la compra
  const agregarDetalle = () => {
    if (!nuevoDetalle.varianteId || !nuevoDetalle.cantidad || nuevoDetalle.cantidad <= 0 || !nuevoDetalle.precioUnitario || nuevoDetalle.precioUnitario <= 0) {
      toast.error("Complete todos los campos del detalle correctamente")
      return
    }

    const varianteSeleccionada = todasLasVariantes.find(v => v.id === parseInt(nuevoDetalle.varianteId))
    if (!varianteSeleccionada) {
      toast.error("Variante no encontrada")
      return
    }

    const detalle = {
      id: Date.now(),
      varianteId: nuevoDetalle.varianteId,
      producto: varianteSeleccionada.productoNombre,
      marca: varianteSeleccionada.productoMarca,
      codigo: varianteSeleccionada.codigo,
      color: varianteSeleccionada.color,
      talla: varianteSeleccionada.talla,
      cantidad: parseInt(nuevoDetalle.cantidad),
      precioUnitario: parseFloat(nuevoDetalle.precioUnitario),
      subtotal: parseInt(nuevoDetalle.cantidad) * parseFloat(nuevoDetalle.precioUnitario)
    }

    setDetallesInput([...detallesInput, detalle])
    setNuevoDetalle({
      varianteId: "",
      cantidad: "",
      precioUnitario: "",
      varianteSeleccionada: null
    })
  }

  // Eliminar detalle
  const eliminarDetalle = (index) => {
    const nuevosDetalles = detallesInput.filter((_, i) => i !== index)
    setDetallesInput(nuevosDetalles)
  }

  // Manejar cambio de variante
  const handleVarianteChange = (varianteId) => {
    const varianteSeleccionada = todasLasVariantes.find(v => v.id === parseInt(varianteId))
    if (varianteSeleccionada) {
      setNuevoDetalle({
        ...nuevoDetalle,
        varianteId,
        precioUnitario: parseFloat(varianteSeleccionada.precioCompra) || "",
        varianteSeleccionada
      })
    }
  }

  // Crear o editar compra
  const handleCreateOrEdit = () => {
    if (!nroFacturaInput.trim()) {
      toast.error("El número de factura es requerido")
      return
    }
    if (!proveedorInput.trim()) {
      toast.error("El proveedor es requerido")
      return
    }
    if (detallesInput.length === 0) {
      toast.error("Debe agregar al menos un producto a la compra")
      return
    }

    const proveedorSeleccionado = proveedores.find(p => p.nombre === proveedorInput)
    if (!proveedorSeleccionado) {
      toast.error("Proveedor no válido")
      return
    }

    if (editingCompra) {
      const detallesOriginales = editingCompra.detalles || []
      
      const detallesEliminar = detallesOriginales
        .filter(detalleOriginal => 
          !detallesInput.some(detalleActual => 
            detalleActual.id === detalleOriginal.id
          )
        )
        .map(detalle => detalle.id)

      const detallesNuevos = detallesInput
        .filter(detalle => !detalle.id || detalle.id >= 1000)
        .map(detalle => ({
          varianteId: parseInt(detalle.varianteId),
          cantidad: parseInt(detalle.cantidad),
          precioUnitario: parseFloat(detalle.precioUnitario),
          subtotal: parseFloat(detalle.cantidad * detalle.precioUnitario)
        }))

      const compraData = {
        id: editingCompra.id,
        nroFactura: nroFacturaInput.trim(),
        total: parseFloat(totalCalculado),
        estado: estadoInput,
        proveedorId: proveedorSeleccionado.id,
        usuarioId: 4,
        detallesEliminar: detallesEliminar,
        detallesNuevos: detallesNuevos
      }

      editar.mutate(compraData, {
        onSuccess: () => {
          toast.success("Compra actualizada correctamente")
          closeModal()
        },
        onError: (error) => {
          toast.error(`Error al actualizar compra: ${error.message}`)
        }
      })

    } else {
      const detallesNuevos = detallesInput.map(detalle => ({
        varianteId: parseInt(detalle.varianteId),
        cantidad: parseInt(detalle.cantidad),
        precioUnitario: parseFloat(detalle.precioUnitario),
        subtotal: parseFloat(detalle.cantidad * detalle.precioUnitario)
      }))

      const compraData = {
        nroFactura: nroFacturaInput.trim(),
        total: parseFloat(totalCalculado),
        estado: estadoInput,
        proveedorId: proveedorSeleccionado.id,
        usuarioId: 4,
        detalles: detallesNuevos
      }

      crear.mutate(compraData, {
        onSuccess: () => {
          toast.success("Compra creada correctamente")
          closeModal()
        },
        onError: (error) => {
          toast.error(`Error al crear compra: ${error.message}`)
        }
      })
    }
  }

  // Eliminar compra
  const handleDelete = (compra) => {
    if (compra?.id && eliminar?.mutate) {
      eliminar.mutate(compra.id, {
        onSuccess: () => {
          toast.success("Compra anulada correctamente")
        },
        onError: (error) => {
          toast.error(`Error al anular compra: ${error.message}`)
        }
      })
    }
  }

  // Seleccionar todas las compras
  const handleSelectAll = () => {
    setSelectedCompras(
      selectedCompras.length === filteredCompras.length
        ? []
        : filteredCompras.map((c) => c.id)
    )
  }

  // Seleccionar compra individual
  const handleSelectSingle = (id) => {
    setSelectedCompras((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    )
  }

  // Limpiar filtros
  const limpiarFiltros = () => {
    setFiltroEstado("TODAS")
    setFiltroMes("")
    setFiltroAnio("")
    setSearchTerm("")
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

  // Formatear moneda
  const formatCurrency = (amount) => {
    const numAmount = parseFloat(amount) || 0
    return new Intl.NumberFormat('es-BO', {
      style: 'currency',
      currency: 'BOB'
    }).format(numAmount)
  }

  // Toggle menú de filtros
  const toggleMenuFiltros = () => {
    setMenuFiltrosAbierto(!menuFiltrosAbierto)
  }

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

  // Paginación
  const comprasPaginadas = useMemo(() => {
    const startIndex = (paginaActual - 1) * itemsPorPagina
    const endIndex = startIndex + itemsPorPagina
    return filteredCompras.slice(startIndex, endIndex)
  }, [filteredCompras, paginaActual, itemsPorPagina])

  const totalPaginas = Math.ceil(filteredCompras.length / itemsPorPagina)

  const paginasParaMostrar = useMemo(() => {
    const paginas = []
    const paginasTotales = totalPaginas
    const paginaActualNum = paginaActual
    
    paginas.push(1)
    
    for (let i = Math.max(2, paginaActualNum - 1); i <= Math.min(paginasTotales - 1, paginaActualNum + 1); i++) {
      if (!paginas.includes(i)) paginas.push(i)
    }
    
    if (paginasTotales > 1) {
      paginas.push(paginasTotales)
    }
    
    return [...new Set(paginas)].sort((a, b) => a - b)
  }, [paginaActual, totalPaginas])

  const irAPagina = (pagina) => {
    setPaginaActual(pagina)
  }

  const paginaAnterior = () => {
    if (paginaActual > 1) {
      setPaginaActual(paginaActual - 1)
    }
  }

  const paginaSiguiente = () => {
    if (paginaActual < totalPaginas) {
      setPaginaActual(paginaActual + 1)
    }
  }

  const irAPrimeraPagina = () => {
    setPaginaActual(1)
  }

  const irAUltimaPagina = () => {
    setPaginaActual(totalPaginas)
  }

  // Resetear paginación cuando cambian los filtros
  useEffect(() => {
    setPaginaActual(1)
  }, [searchTerm, filtroEstado, filtroMes, filtroAnio])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-600 rounded-lg">
              <FileText className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Gestión de Compras</h1>
          </div>
          <p className="text-gray-600 ml-11">Administra las compras y facturas del sistema</p>
          <div className="w-20 h-1 bg-blue-600 mt-2 ml-11 rounded-full"></div>
        </motion.div>

        {/* Barra de búsqueda y filtros */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 border border-blue-100">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar por factura, proveedor o usuario..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="relative">
                <button onClick={toggleMenuFiltros} className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Filter size={20} />
                  <span>Filtros</span>
                  <ChevronDown size={16} className={`transition-transform ${menuFiltrosAbierto ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {menuFiltrosAbierto && (
                    <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 p-4">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Estado de Compra</label>
                          <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="TODAS">Todos los estados</option>
                            <option value="REGISTRADA">Registradas</option>
                            <option value="PAGADA">Pagadas</option>
                            <option value="ANULADA">Anuladas</option>
                          </select>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Mes</label>
                            <select value={filtroMes} onChange={(e) => setFiltroMes(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                              <option value="">Todos los meses</option>
                              {meses.map(mes => (
                                <option key={mes.value} value={mes.value}>{mes.label}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Año</label>
                            <select value={filtroAnio} onChange={(e) => setFiltroAnio(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                              <option value="">Todos los años</option>
                              {años.map(año => (
                                <option key={año} value={año}>{año}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <button onClick={limpiarFiltros} className="flex-1 px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">Limpiar</button>
                          <button onClick={toggleMenuFiltros} className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Aplicar</button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button onClick={() => openModal()} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/25">
                <Plus size={20} />
                <span>Nueva Compra</span>
              </button>
            </div>

            {/* Filtros activos */}
            {(filtroEstado !== "TODAS" || filtroMes || filtroAnio) && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="flex flex-wrap gap-2 text-sm">
                <span className="text-gray-600">Filtros activos:</span>
                {filtroEstado !== "TODAS" && (<span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Estado: {filtroEstado}</span>)}
                {filtroMes && (<span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Mes: {meses.find(m => m.value === filtroMes)?.label}</span>)}
                {filtroAnio && (<span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">Año: {filtroAnio}</span>)}
                <button onClick={limpiarFiltros} className="text-red-600 hover:text-red-700 text-xs underline">Limpiar todos</button>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Estadísticas */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-blue-500"><div className="text-sm text-gray-600">Total Compras</div><div className="text-2xl font-bold text-gray-800">{filteredCompras.length}</div></div>
          <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-green-500"><div className="text-sm text-gray-600">Pagadas</div><div className="text-2xl font-bold text-gray-800">{filteredCompras.filter(c => c.estado === "PAGADA").length}</div></div>
          <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-yellow-500"><div className="text-sm text-gray-600">Registradas</div><div className="text-2xl font-bold text-gray-800">{filteredCompras.filter(c => c.estado === "REGISTRADA").length}</div></div>
          <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-red-500"><div className="text-sm text-gray-600">Anuladas</div><div className="text-2xl font-bold text-gray-800">{filteredCompras.filter(c => c.estado === "ANULADA").length}</div></div>
        </motion.div>

        {/* Tabla de compras */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-xl shadow-lg overflow-hidden border border-blue-100">
          <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-4 mb-3 sm:mb-0">
              <div className="text-sm text-gray-600">
                Mostrando <span className="font-semibold">{comprasPaginadas.length}</span> de{" "}
                <span className="font-semibold">{filteredCompras.length}</span> compras
              </div>
              
              <select 
                value={itemsPorPagina} 
                onChange={(e) => {
                  setItemsPorPagina(Number(e.target.value))
                  setPaginaActual(1)
                }}
                className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={5}>5 por página</option>
                <option value={10}>10 por página</option>
                <option value={20}>20 por página</option>
                <option value={50}>50 por página</option>
              </select>
            </div>

            {/* Controles de paginación superiores */}
            <div className="flex items-center gap-2">
              <button
                onClick={irAPrimeraPagina}
                disabled={paginaActual === 1}
                className="p-1 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                title="Primera página"
              >
                <ChevronsLeft size={16} />
              </button>
              
              <button
                onClick={paginaAnterior}
                disabled={paginaActual === 1}
                className="p-1 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                title="Página anterior"
              >
                <ChevronLeft size={16} />
              </button>

              <div className="flex items-center gap-1">
                {paginasParaMostrar.map((pagina, index) => (
                  <div key={pagina} className="flex items-center">
                    {index > 0 && paginasParaMostrar[index - 1] !== pagina - 1 && (
                      <span className="px-1 text-gray-400">...</span>
                    )}
                    <button
                      onClick={() => irAPagina(pagina)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                        pagina === paginaActual
                          ? "bg-blue-600 text-white"
                          : "text-gray-600 hover:bg-gray-100 border border-gray-300"
                      }`}
                    >
                      {pagina}
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={paginaSiguiente}
                disabled={paginaActual === totalPaginas}
                className="p-1 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                title="Página siguiente"
              >
                <ChevronRight size={16} />
              </button>
              
              <button
                onClick={irAUltimaPagina}
                disabled={paginaActual === totalPaginas}
                className="p-1 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                title="Última página"
              >
                <ChevronsRight size={16} />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                  <th className="text-left p-4">
                    <input 
                      type="checkbox" 
                      checked={selectedCompras.length === comprasPaginadas.length && comprasPaginadas.length > 0} 
                      onChange={handleSelectAll} 
                      className="h-4 w-4 rounded border-white text-blue-600 focus:ring-blue-500 bg-white" 
                    />
                  </th>
                  <th className="text-left p-4 text-xs font-medium uppercase tracking-wider">
                    <div className="flex items-center gap-1"><FileText size={16} />Factura</div>
                  </th>
                  <th className="text-left p-4 text-xs font-medium uppercase tracking-wider">
                    <div className="flex items-center gap-1"><Building size={16} />Proveedor</div>
                  </th>
                  <th className="text-left p-4 text-xs font-medium uppercase tracking-wider">
                    <div className="flex items-center gap-1"><User size={16} />Usuario</div>
                  </th>
                  <th className="text-left p-4 text-xs font-medium uppercase tracking-wider">
                    <div className="flex items-center gap-1"><Calendar size={16} />Fecha</div>
                  </th>
                  <th className="text-left p-4 text-xs font-medium uppercase tracking-wider">Total</th>
                  <th className="text-left p-4 text-xs font-medium uppercase tracking-wider">Estado</th>
                  <th className="text-left p-4 text-xs font-medium uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {comprasPaginadas.map((compra, index) => (
                  <motion.tr 
                    key={compra.id} 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: index * 0.05 }} 
                    className="hover:bg-blue-50 transition-colors"
                  >
                    <td className="p-4">
                      <input 
                        type="checkbox" 
                        checked={selectedCompras.includes(compra.id)} 
                        onChange={() => handleSelectSingle(compra.id)} 
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                      />
                    </td>
                    <td className="p-4">
                      <div className="text-sm font-semibold text-gray-900">{compra.nroFactura}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-gray-900">{compra.proveedor}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-gray-600">{compra.usuario}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-gray-600">{compra.fechaCompra}</div>
                      <div className="text-xs text-gray-400">{compra.horaCompra}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm font-semibold text-gray-900">{formatCurrency(compra.total)}</div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getEstadoColor(compra.estado)}`}>
                        {compra.estado}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => openDetailsModal(compra)} 
                          className="text-blue-600 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 transition-colors" 
                          title="Ver detalles"
                        >
                          <FileText size={16} />
                        </button>
                        
                        <button 
                          onClick={() => generarFactura(compra)} 
                          className="text-purple-600 hover:text-purple-700 p-2 rounded-lg hover:bg-purple-50 transition-colors"
                          title="Generar factura PDF"
                        >
                          <Download size={16} />
                        </button>
                        
                        <button 
                          onClick={() => openModal(compra)} 
                          disabled={compra.estado === 'PAGADA' || compra.estado === 'ANULADA'}
                          className={`p-2 rounded-lg transition-colors ${
                            compra.estado === 'PAGADA' || compra.estado === 'ANULADA'
                              ? 'text-gray-400 cursor-not-allowed'
                              : 'text-green-600 hover:text-green-700 hover:bg-green-50'
                          }`}
                          title={
                            compra.estado === 'PAGADA' || compra.estado === 'ANULADA'
                              ? 'No se puede editar compras pagadas o anuladas'
                              : 'Editar compra'
                          }
                        >
                          <Pencil size={16} />
                        </button>
                        
                        <div className="relative">
                          <button 
                            onClick={() => setMenuEstadoAbierto(menuEstadoAbierto === compra.id ? null : compra.id)}
                            disabled={compra.estado === 'PAGADA' || compra.estado === 'ANULADA'}
                            className={`p-2 rounded-lg transition-colors ${
                              compra.estado === 'PAGADA' || compra.estado === 'ANULADA'
                                ? 'text-gray-400 cursor-not-allowed'
                                : compra.estado === "REGISTRADA" 
                                  ? "text-blue-600 hover:bg-blue-50" 
                                  : "text-gray-600 hover:bg-gray-50"
                            }`}
                            title={
                              compra.estado === 'PAGADA' || compra.estado === 'ANULADA'
                                ? 'No se puede cambiar el estado de compras pagadas o anuladas'
                                : `Cambiar estado (Actual: ${compra.estado})`
                            }
                          >
                            <RefreshCcw size={16} />
                          </button>
                          
                          {menuEstadoAbierto === compra.id && compra.estado === 'REGISTRADA' && (
                            <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                              <button 
                                onClick={() => cambiarEstado(compra, "PAGADA")} 
                                className="w-full text-left px-3 py-2 text-sm rounded-t-lg text-green-600 hover:bg-green-50"
                              >
                                Pagada
                              </button>
                              <button 
                                onClick={() => cambiarEstado(compra, "ANULADA")} 
                                className="w-full text-left px-3 py-2 text-sm rounded-b-lg text-red-600 hover:bg-red-50"
                              >
                                Anulada
                              </button>
                            </div>
                          )}
                        </div>
                        
                        <button 
                          onClick={() => handleDelete(compra)} 
                          disabled={compra.estado === 'PAGADA'}
                          className={`p-2 rounded-lg transition-colors ${
                            compra.estado === 'PAGADA'
                              ? 'text-gray-400 cursor-not-allowed'
                              : 'text-red-600 hover:text-red-700 hover:bg-red-50'
                          }`}
                          title={
                            compra.estado === 'PAGADA'
                              ? 'No se puede anular compras pagadas'
                              : 'Anular compra'
                          }
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
                {comprasPaginadas.length === 0 && (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <FileText size={48} className="text-gray-300 mb-4" />
                        {searchTerm || filtroEstado !== "TODAS" || filtroMes || filtroAnio ? "No se encontraron compras con los filtros aplicados" : "No hay compras registradas"}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Paginación inferior */}
          <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-t border-gray-200 bg-gray-50">
            <div className="text-sm text-gray-600 mb-3 sm:mb-0">
              Mostrando <span className="font-semibold">{(paginaActual - 1) * itemsPorPagina + 1}</span> -{" "}
              <span className="font-semibold">
                {Math.min(paginaActual * itemsPorPagina, filteredCompras.length)}
              </span> de <span className="font-semibold">{filteredCompras.length}</span> compras
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={irAPrimeraPagina}
                disabled={paginaActual === 1}
                className="px-3 py-1 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors flex items-center gap-1 text-sm"
              >
                <ChevronsLeft size={16} />
                <span className="hidden sm:inline">Primera</span>
              </button>
              
              <button
                onClick={paginaAnterior}
                disabled={paginaActual === 1}
                className="px-3 py-1 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors flex items-center gap-1 text-sm"
              >
                <ChevronLeft size={16} />
                <span className="hidden sm:inline">Anterior</span>
              </button>

              <div className="flex items-center gap-1 mx-2">
                <span className="text-sm text-gray-600">Página</span>
                <span className="font-semibold">{paginaActual}</span>
                <span className="text-sm text-gray-600">de</span>
                <span className="font-semibold">{totalPaginas}</span>
              </div>

              <button
                onClick={paginaSiguiente}
                disabled={paginaActual === totalPaginas}
                className="px-3 py-1 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors flex items-center gap-1 text-sm"
              >
                <span className="hidden sm:inline">Siguiente</span>
                <ChevronRight size={16} />
              </button>
              
              <button
                onClick={irAUltimaPagina}
                disabled={paginaActual === totalPaginas}
                className="px-3 py-1 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors flex items-center gap-1 text-sm"
              >
                <span className="hidden sm:inline">Última</span>
                <ChevronsRight size={16} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Modal para crear/editar compra */}
        <AnimatePresence>
          {showModal && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-xl shadow-2xl w-full max-w-6xl mx-auto border border-blue-200 max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  {editingCompra && (editingCompra.estado === 'PAGADA' || editingCompra.estado === 'ANULADA') && (
                    <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="text-yellow-600" size={24} />
                        <div>
                          <h4 className="font-semibold text-yellow-800">Compra {editingCompra.estado.toLowerCase()}</h4>
                          <p className="text-yellow-700 text-sm">
                            Esta compra está {editingCompra.estado.toLowerCase()} y no puede ser editada.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-800">{editingCompra ? "Editar Compra" : "Registrar Nueva Compra"}</h3>
                    <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                      <X size={24} />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Número de Factura *</label>
                      <div className="relative">
                        <input 
                          type="text" 
                          value={nroFacturaInput} 
                          onChange={(e) => setNroFacturaInput(e.target.value)} 
                          placeholder="Generando código..." 
                          disabled={editingCompra && (editingCompra.estado === 'PAGADA' || editingCompra.estado === 'ANULADA') || generandoCodigo}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10 disabled:bg-gray-100 disabled:cursor-not-allowed" 
                        />
                        {generandoCodigo && (<div className="absolute right-3 top-1/2 transform -translate-y-1/2"><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div></div>)}
                        {!generandoCodigo && nroFacturaInput && (<CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500" size={16} />)}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Código generado automáticamente</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Proveedor *</label>
                      {cargandoProveedores ? (<div className="flex items-center gap-2 text-gray-500"><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>Cargando proveedores...</div>) : (
                        <select 
                          value={proveedorInput} 
                          onChange={(e) => setProveedorInput(e.target.value)} 
                          disabled={editingCompra && (editingCompra.estado === 'PAGADA' || editingCompra.estado === 'ANULADA')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        >
                          <option value="">Seleccionar proveedor</option>
                          {proveedores.map(proveedor => (
                            <option key={proveedor.id} value={proveedor.nombre}>{proveedor.nombre}</option>
                          ))}
                        </select>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                      <select 
                        value={estadoInput} 
                        onChange={(e) => setEstadoInput(e.target.value)} 
                        disabled={editingCompra && (editingCompra.estado === 'PAGADA' || editingCompra.estado === 'ANULADA')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      >
                        <option value="REGISTRADA">Registrada</option>
                        <option value="PAGADA">Pagada</option>
                        <option value="ANULADA">Anulada</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Compra</label>
                      <input 
                        type="date" 
                        value={fechaCompraInput} 
                        onChange={(e) => setFechaCompraInput(e.target.value)} 
                        disabled={editingCompra && (editingCompra.estado === 'PAGADA' || editingCompra.estado === 'ANULADA')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed" 
                      />
                    </div>
                  </div>

                  <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-blue-50/50">
                    <h4 className="text-md font-semibold mb-3 text-gray-800 flex items-center gap-2">
                      <Package size={20} className="text-blue-600" />
                      Agregar Productos
                      {editingCompra && (editingCompra.estado === 'PAGADA' || editingCompra.estado === 'ANULADA') && (
                        <span className="text-sm text-yellow-600 font-normal">(No disponible para compras {editingCompra.estado.toLowerCase()}s)</span>
                      )}
                    </h4>
                    {cargandoProductos ? (
                      <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="text-gray-600 mt-2">Cargando productos...</p>
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Producto/Variante *</label>
                            <select 
                              value={nuevoDetalle.varianteId} 
                              onChange={(e) => handleVarianteChange(e.target.value)} 
                              disabled={editingCompra && (editingCompra.estado === 'PAGADA' || editingCompra.estado === 'ANULADA')}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                            >
                              <option value="">Seleccionar variante</option>
                              {todasLasVariantes.map(variante => (
                                <option key={variante.id} value={variante.id}>
                                  {variante.productoNombre} - {variante.color} - {variante.talla} ({variante.codigo})
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Cantidad *</label>
                            <input 
                              type="number" 
                              min="1" 
                              value={nuevoDetalle.cantidad} 
                              onChange={(e) => setNuevoDetalle({...nuevoDetalle, cantidad: e.target.value})} 
                              disabled={editingCompra && (editingCompra.estado === 'PAGADA' || editingCompra.estado === 'ANULADA')}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed" 
                              placeholder="Ingrese cantidad" 
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Precio Unitario (Bs) *</label>
                            <input 
                              type="number" 
                              step="0.01" 
                              min="0" 
                              value={nuevoDetalle.precioUnitario} 
                              onChange={(e) => setNuevoDetalle({...nuevoDetalle, precioUnitario: e.target.value})} 
                              disabled={editingCompra && (editingCompra.estado === 'PAGADA' || editingCompra.estado === 'ANULADA')}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed" 
                              placeholder="0.00" 
                            />
                          </div>
                          <div className="flex items-end">
                            <button 
                              onClick={agregarDetalle} 
                              disabled={editingCompra && (editingCompra.estado === 'PAGADA' || editingCompra.estado === 'ANULADA')}
                              className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-lg shadow-green-600/25 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Plus size={16} />
                              Agregar
                            </button>
                          </div>
                        </div>
                        {nuevoDetalle.varianteSeleccionada && (
                          <div className="text-sm text-gray-600 bg-white p-3 rounded-md border border-blue-200">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                              <div><strong>Producto:</strong> {nuevoDetalle.varianteSeleccionada.productoNombre}</div>
                              <div><strong>Marca:</strong> {nuevoDetalle.varianteSeleccionada.productoMarca}</div>
                              <div><strong>Color:</strong> {nuevoDetalle.varianteSeleccionada.color}</div>
                              <div><strong>Talla:</strong> {nuevoDetalle.varianteSeleccionada.talla}</div>
                            </div>
                            <div className="mt-1 text-blue-600"><strong>Código:</strong> {nuevoDetalle.varianteSeleccionada.codigo}</div>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  <div className="mb-6">
                    <h4 className="text-md font-semibold mb-3 text-gray-800">
                      Productos en la Compra ({detallesInput.length})
                    </h4>
                    
                    {detallesInput.length === 0 ? (
                      <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                        <Package size={48} className="text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500">No hay productos agregados a la compra</p>
                        <p className="text-sm text-gray-400 mt-1">Agregue productos usando el formulario superior</p>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {detallesInput.map((detalle, index) => (
                          <div key={detalle.id || index} className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 text-sm">
                                  <div>
                                    <label className="font-medium text-gray-700 text-xs">Producto</label>
                                    <div className="text-sm text-gray-900 p-1">
                                      {detalle.producto} - {detalle.color} - {detalle.talla}
                                    </div>
                                  </div>

                                  <div>
                                    <label className="font-medium text-gray-700 text-xs">Cantidad</label>
                                    <div className="text-sm text-gray-900 p-1">{detalle.cantidad}</div>
                                  </div>

                                  <div>
                                    <label className="font-medium text-gray-700 text-xs">Precio Unit.</label>
                                    <div className="text-sm text-gray-900 p-1">{formatCurrency(detalle.precioUnitario)}</div>
                                  </div>

                                  <div className="md:col-span-2">
                                    <div className="text-xs text-gray-600">
                                      <div><strong>Marca:</strong> {detalle.marca}</div>
                                      <div><strong>Variante:</strong> {detalle.color} - {detalle.talla}</div>
                                      <div className="flex justify-between">
                                        <span><strong>Código:</strong> {detalle.codigo}</span>
                                        <span className={`${detalle.id && detalle.id < 1000 ? 'text-blue-600 font-semibold' : 'text-green-600 font-semibold'}`}>
                                          {detalle.id && detalle.id < 1000 ? `Existente` : 'Nuevo'}
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  <div>
                                    <label className="font-medium text-gray-700 text-xs">Subtotal</label>
                                    <div className="text-green-600 font-bold text-sm">
                                      {formatCurrency(detalle.subtotal)}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <button 
                                onClick={() => eliminarDetalle(index)} 
                                disabled={editingCompra && (editingCompra.estado === 'PAGADA' || editingCompra.estado === 'ANULADA')}
                                className={`p-2 rounded-lg transition-colors ml-2 ${
                                  editingCompra && (editingCompra.estado === 'PAGADA' || editingCompra.estado === 'ANULADA')
                                    ? 'text-gray-400 cursor-not-allowed'
                                    : 'text-red-600 hover:text-red-700 hover:bg-red-50'
                                }`}
                                title={
                                  editingCompra && (editingCompra.estado === 'PAGADA' || editingCompra.estado === 'ANULADA')
                                    ? 'No se puede eliminar productos de compras pagadas o anuladas'
                                    : 'Eliminar producto'
                                }
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg mb-6 text-white">
                    <span className="text-lg font-semibold">Total de la Compra:</span>
                    <span className="text-2xl font-bold">{formatCurrency(totalCalculado)}</span>
                  </div>

                  <div className="flex gap-3">
                    <button 
                      onClick={handleCreateOrEdit} 
                      disabled={
                        crear.isLoading || 
                        editar.isLoading || 
                        detallesInput.length === 0 ||
                        (editingCompra && (editingCompra.estado === 'PAGADA' || editingCompra.estado === 'ANULADA'))
                      }
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-lg shadow-green-600/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {crear.isLoading || editar.isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Procesando...</span>
                        </>
                      ) : editingCompra ? (
                        <>
                          <Save size={20} />
                          <span>Guardar Cambios</span>
                        </>
                      ) : (
                        <>
                          <Plus size={20} />
                          <span>Registrar Compra</span>
                        </>
                      )}
                    </button>
                    <button 
                      onClick={closeModal} 
                      disabled={crear.isLoading || editar.isLoading}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal de detalles */}
        <AnimatePresence>
          {showDetailsModal && selectedCompraDetails && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-xl shadow-2xl w-full max-w-6xl mx-auto border border-blue-200 max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                      <FileText className="text-blue-600" size={24} />
                      Detalles de Compra - {selectedCompraDetails.nroFactura}
                    </h3>
                    <button onClick={closeDetailsModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                      <X size={24} />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-3">
                      <Building size={18} className="text-blue-600" />
                      <div>
                        <div className="text-sm text-gray-600">Proveedor</div>
                        <div className="font-semibold text-gray-800">{selectedCompraDetails.proveedor}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <User size={18} className="text-blue-600" />
                      <div>
                        <div className="text-sm text-gray-600">Usuario</div>
                        <div className="font-semibold text-gray-800">{selectedCompraDetails.usuario}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar size={18} className="text-blue-600" />
                      <div>
                        <div className="text-sm text-gray-600">Fecha y Hora</div>
                        <div className="font-semibold text-gray-800">
                          {selectedCompraDetails.fechaCompra} {selectedCompraDetails.horaCompra}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${getEstadoColor(selectedCompraDetails.estado)}`}>
                        <FileText size={18} className={
                          selectedCompraDetails.estado === "PAGADA" ? "text-green-600" : 
                          selectedCompraDetails.estado === "ANULADA" ? "text-red-600" : "text-blue-600"
                        } />
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Estado</div>
                        <div className="font-semibold text-gray-800">{selectedCompraDetails.estado}</div>
                      </div>
                    </div>
                    <div className="md:col-span-2 flex items-center gap-3 p-3 bg-white rounded-lg border">
                      <div className="text-lg font-bold text-blue-600">
                        {formatCurrency(selectedCompraDetails.total)}
                      </div>
                      <div className="text-sm text-gray-600 ml-auto">Total de la compra</div>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                          <th className="text-left p-4 text-xs font-medium uppercase">Producto</th>
                          <th className="text-left p-4 text-xs font-medium uppercase">Marca</th>
                          <th className="text-left p-4 text-xs font-medium uppercase">Código</th>
                          <th className="text-left p-4 text-xs font-medium uppercase">Color</th>
                          <th className="text-left p-4 text-xs font-medium uppercase">Talla</th>
                          <th className="text-left p-4 text-xs font-medium uppercase">Cantidad</th>
                          <th className="text-left p-4 text-xs font-medium uppercase">Precio Unit.</th>
                          <th className="text-left p-4 text-xs font-medium uppercase">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {selectedCompraDetails.detalles?.map((detalle) => (
                          <tr key={detalle.id} className="hover:bg-blue-50 transition-colors">
                            <td className="p-4 text-sm text-gray-900">{detalle.producto}</td>
                            <td className="p-4 text-sm text-gray-600">{detalle.marca}</td>
                            <td className="p-4 text-sm text-gray-600 font-mono">{detalle.codigo}</td>
                            <td className="p-4 text-sm text-gray-600">{detalle.color}</td>
                            <td className="p-4 text-sm text-gray-600">{detalle.talla}</td>
                            <td className="p-4 text-sm text-gray-600 text-center">{detalle.cantidad}</td>
                            <td className="p-4 text-sm text-gray-600">{formatCurrency(detalle.precioUnitario)}</td>
                            <td className="p-4 text-sm font-semibold text-green-600">{formatCurrency(detalle.subtotal)}</td>
                          </tr>
                        ))}
                        {(!selectedCompraDetails.detalles || selectedCompraDetails.detalles.length === 0) && (
                          <tr>
                            <td colSpan={8} className="p-8 text-center text-gray-500">
                              <div className="flex flex-col items-center">
                                <Package size={48} className="text-gray-300 mb-4" />
                                No hay detalles disponibles para esta compra
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex justify-end gap-3 mt-6">
                    <button 
                      onClick={() => generarFactura(selectedCompraDetails,"descargar")} 
                      className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Download size={16} />
                      Generar Factura PDF
                    </button>

                    <button 
                      onClick={() => generarFactura(selectedCompraDetails,"imprimir")} 
                      className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2"
                      title="Imprimir factura"
                    >
                      <Printer size={16} />
                      Imprimir Factura PDF
                    </button>

                    <button onClick={closeDetailsModal} className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg transition-colors">
                      Cerrar
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default GestionCompras