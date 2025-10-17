"use client"

import { useState } from "react"
import { useCompra } from "../hooks/useCompra"
import { Eye, EyeOff, Pencil, Plus, RefreshCcw, Save, Search, Trash2, FileText, Calendar, User, Building } from "lucide-react"

// Cambia el nombre del componente y asegúrate de exportarlo correctamente
const GestionCompras = () => {
  const { listar, crear, editar, eliminar, generateCodigoFactura } = useCompra()
  const compras = listar.data || []

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCompras, setSelectedCompras] = useState([])
  const [editingCompra, setEditingCompra] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedCompraDetails, setSelectedCompraDetails] = useState(null)
  const [viewAnuladas, setViewAnuladas] = useState(false)
  
  // Estados para el formulario
  const [nroFacturaInput, setNroFacturaInput] = useState("")
  const [totalInput, setTotalInput] = useState("")
  const [estadoInput, setEstadoInput] = useState("REGISTRADA")
  const [proveedorInput, setProveedorInput] = useState("")
  const [fechaCompraInput, setFechaCompraInput] = useState("")
  const [detallesInput, setDetallesInput] = useState([])

  const filteredCompras = compras.filter((c) => {
    const matchesSearch = 
      c.nroFactura?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.proveedor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.usuario?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesView = viewAnuladas ? c.estado === "ANULADA" : c.estado !== "ANULADA"
    return matchesSearch && matchesView
  })

  const openModal = (compra = null) => {
    setEditingCompra(compra)
    if (compra) {
      setNroFacturaInput(compra.nroFactura || "")
      setTotalInput(compra.total || "")
      setEstadoInput(compra.estado || "REGISTRADA")
      setProveedorInput(compra.proveedor || "")
      setFechaCompraInput(compra.fechaCompra || "")
      setDetallesInput(compra.detalles || [])
    } else {
      setNroFacturaInput("")
      setTotalInput("")
      setEstadoInput("REGISTRADA")
      setProveedorInput("")
      setFechaCompraInput(new Date().toISOString().split('T')[0])
      setDetallesInput([])
      
      // Generar código de factura automáticamente para nueva compra
      if (generateCodigoFactura?.mutate) {
        generateCodigoFactura.mutate(undefined, {
          onSuccess: (data) => {
            setNroFacturaInput(data?.codigo || "")
          }
        })
      }
    }
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

  const handleCreateOrEdit = () => {
    if (editingCompra) {
      editar.mutate({
        id: editingCompra.id,
        nroFactura: nroFacturaInput,
        total: parseFloat(totalInput) || 0,
        estado: estadoInput,
        proveedor: proveedorInput,
        fechaCompra: fechaCompraInput,
        detalles: detallesInput
      })
    } else {
      crear.mutate({
        nroFactura: nroFacturaInput,
        total: parseFloat(totalInput) || 0,
        estado: estadoInput,
        proveedor: proveedorInput,
        fechaCompra: fechaCompraInput,
        detalles: detallesInput
      })
    }
    closeModal()
  }

  const handleDelete = (compra) => {
    if (compra?.id && eliminar?.mutate) {
      eliminar.mutate(compra.id)
    }
  }

  const handleReactivate = (compra) => {
    if (editar?.mutate) {
      editar.mutate({
        id: compra.id,
        nroFactura: compra.nroFactura,
        total: parseFloat(compra.total) || 0,
        estado: "REGISTRADA",
        proveedor: compra.proveedor,
        fechaCompra: compra.fechaCompra,
        detalles: compra.detalles || []
      })
    }
  }

  const handleSelectAll = () => {
    setSelectedCompras(
      selectedCompras.length === filteredCompras.length
        ? []
        : filteredCompras.map((c) => c.id)
    )
  }

  const handleSelectSingle = (id) => {
    setSelectedCompras((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    )
  }

  const getEstadoColor = (estado) => {
    switch (estado) {
      case "PAGADA": return "bg-green-100 text-green-800"
      case "REGISTRADA": return "bg-blue-100 text-blue-800"
      case "ANULADA": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const formatCurrency = (amount) => {
    const numAmount = parseFloat(amount) || 0
    return new Intl.NumberFormat('es-PY', {
      style: 'currency',
      currency: 'PYG'
    }).format(numAmount)
  }

  return (
    <div className="flex min-h-screen bg-white">
      {/* Modal para crear/editar compra */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 border border-gray-200 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                {editingCompra ? "Editar Compra" : "Registrar Nueva Compra"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número de Factura
                  </label>
                  <input
                    type="text"
                    value={nroFacturaInput}
                    onChange={(e) => setNroFacturaInput(e.target.value)}
                    placeholder="Ej: FAC-001"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={totalInput}
                    onChange={(e) => setTotalInput(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado
                  </label>
                  <select
                    value={estadoInput}
                    onChange={(e) => setEstadoInput(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="REGISTRADA">Registrada</option>
                    <option value="PAGADA">Pagada</option>
                    {!editingCompra && <option value="ANULADA">Anulada</option>}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Proveedor
                  </label>
                  <input
                    type="text"
                    value={proveedorInput}
                    onChange={(e) => setProveedorInput(e.target.value)}
                    placeholder="Nombre del proveedor"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de Compra
                  </label>
                  <input
                    type="date"
                    value={fechaCompraInput}
                    onChange={(e) => setFechaCompraInput(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              {/* Sección para detalles de compra */}
              <div className="mt-6">
                <h4 className="text-md font-semibold mb-3 text-gray-800">Detalles de la Compra</h4>
                <div className="space-y-3">
                  {detallesInput.map((detalle, index) => (
                    <div key={index} className="p-3 border border-gray-200 rounded-md">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                        <div>
                          <span className="font-medium">Producto:</span> {detalle.producto}
                        </div>
                        <div>
                          <span className="font-medium">Cantidad:</span> {detalle.cantidad}
                        </div>
                        <div>
                          <span className="font-medium">Precio Unit.:</span> {formatCurrency(detalle.precioUnitario)}
                        </div>
                        <div>
                          <span className="font-medium">Subtotal:</span> {formatCurrency(detalle.subtotal)}
                        </div>
                      </div>
                    </div>
                  ))}
                  {detallesInput.length === 0 && (
                    <p className="text-gray-500 text-sm text-center py-4">
                      No hay detalles agregados
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <button
                  onClick={handleCreateOrEdit}
                  className="bg-green-600 flex justify-center hover:bg-green-700 text-white px-4 py-2 rounded-md flex-1"
                >
                  {editingCompra ?
                    <div className="flex items-center gap-x-2"><Save size={20} /><span>Guardar Cambios</span></div> :
                    <div className="flex items-center gap-x-2"><Plus size={20} /><span>Registrar Compra</span></div>}
                </button>
                <button
                  onClick={closeModal}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para ver detalles */}
      {showDetailsModal && selectedCompraDetails && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 border border-gray-200 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Detalles de Compra - {selectedCompraDetails.nroFactura}
              </h3>
              
              {/* Información general */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Building size={16} className="text-gray-600" />
                  <span><strong>Proveedor:</strong> {selectedCompraDetails.proveedor}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User size={16} className="text-gray-600" />
                  <span><strong>Usuario:</strong> {selectedCompraDetails.usuario}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-gray-600" />
                  <span><strong>Fecha:</strong> {selectedCompraDetails.fechaCompra}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span><strong>Hora:</strong> {selectedCompraDetails.horaCompra}</span>
                </div>
                <div className="md:col-span-2">
                  <span><strong>Total:</strong> {formatCurrency(selectedCompraDetails.total)}</span>
                </div>
              </div>

              {/* Tabla de detalles */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left p-3 text-xs font-medium text-gray-500 uppercase">Producto</th>
                      <th className="text-left p-3 text-xs font-medium text-gray-500 uppercase">Marca</th>
                      <th className="text-left p-3 text-xs font-medium text-gray-500 uppercase">Código</th>
                      <th className="text-left p-3 text-xs font-medium text-gray-500 uppercase">Color</th>
                      <th className="text-left p-3 text-xs font-medium text-gray-500 uppercase">Talla</th>
                      <th className="text-left p-3 text-xs font-medium text-gray-500 uppercase">Cantidad</th>
                      <th className="text-left p-3 text-xs font-medium text-gray-500 uppercase">Precio Unit.</th>
                      <th className="text-left p-3 text-xs font-medium text-gray-500 uppercase">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {selectedCompraDetails.detalles?.map((detalle) => (
                      <tr key={detalle.id} className="hover:bg-gray-50">
                        <td className="p-3 text-sm text-gray-900">{detalle.producto}</td>
                        <td className="p-3 text-sm text-gray-600">{detalle.marca}</td>
                        <td className="p-3 text-sm text-gray-600">{detalle.codigo}</td>
                        <td className="p-3 text-sm text-gray-600">{detalle.color}</td>
                        <td className="p-3 text-sm text-gray-600">{detalle.talla}</td>
                        <td className="p-3 text-sm text-gray-600">{detalle.cantidad}</td>
                        <td className="p-3 text-sm text-gray-600">{formatCurrency(detalle.precioUnitario)}</td>
                        <td className="p-3 text-sm font-medium text-gray-900">{formatCurrency(detalle.subtotal)}</td>
                      </tr>
                    ))}
                    {(!selectedCompraDetails.detalles || selectedCompraDetails.detalles.length === 0) && (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-gray-500">
                          No hay detalles disponibles
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={closeDetailsModal}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 p-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Gestión de Compras {viewAnuladas && "(Anuladas)"}
            </h1>
            <p className="text-gray-600">
              {viewAnuladas
                ? "Compras anuladas del sistema"
                : "Administra las compras y facturas del sistema"
              }
            </p>
            <div className="w-20 h-1 bg-blue-600 mt-2"></div>
          </div>

          {/* Controles superiores */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder={`Buscar compra ${viewAnuladas ? 'anulada' : ''}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="absolute left-3 top-2.5 text-gray-400"><Search size={20} /></span>
              </div>
              <button
                onClick={() => setViewAnuladas(!viewAnuladas)}
                className="px-3 py-2 border border-gray-300 rounded-md hover:cursor-pointer hover:bg-gray-100"
              >
                {viewAnuladas ?
                  <div className="flex items-center gap-x-2"><Eye size={20} /><span>Ver Activas</span></div> :
                  <div className="flex items-center gap-x-2"><EyeOff size={20} /><span>Ver Anuladas</span></div>}
              </button>
            </div>

            <button
              onClick={() => openModal()}
              disabled={viewAnuladas}
              className="bg-blue-600 flex items-center gap-x-2 hover:cursor-pointer hover:bg-blue-700 text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus size={20} /> <span>Nueva Compra</span>
            </button>
          </div>

          {/* Tabla de Compras */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left p-4">
                      <input
                        type="checkbox"
                        checked={selectedCompras.length === filteredCompras.length && filteredCompras.length > 0}
                        onChange={handleSelectAll}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Factura</th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Proveedor</th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredCompras.map((compra) => (
                    <tr key={compra.id} className="hover:bg-gray-50">
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
                        <div className="text-sm font-semibold text-gray-900">
                          {formatCurrency(compra.total)}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEstadoColor(compra.estado)}`}>
                          {compra.estado}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          {viewAnuladas ? (
                            <button
                              onClick={() => handleReactivate(compra)}
                              className="group text-green-600 flex items-center gap-x-2 hover:cursor-pointer border-b-1 hover:text-green-700 px-2 py-1 "
                            >
                              <RefreshCcw className="group-hover:animate-spin" size={20} /> <span> Reactivar</span>
                            </button>
                          ) : (
                            <>
                              <button
                                onClick={() => openDetailsModal(compra)}
                                className="text-blue-600 flex items-center gap-x-2 hover:cursor-pointer hover:bg-blue-50 hover:text-blue-700 px-2 py-1 border border-blue-200 rounded-md"
                              >
                                <FileText size={20} /> <span>Detalles</span>
                              </button>
                              <button
                                onClick={() => openModal(compra)}
                                className="text-green-600 flex items-center gap-x-2 hover:cursor-pointer hover:bg-green-50 hover:text-green-700 px-2 py-1 border border-green-200 rounded-md"
                              >
                                <Pencil size={20} /> <span>Editar</span>
                              </button>
                              <button
                                onClick={() => handleDelete(compra)}
                                className="text-red-600 flex items-center gap-x-2 hover:cursor-pointer hover:text-red-700 px-2 py-1"
                              >
                                <Trash2 size={20} /> <span>Anular</span>
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredCompras.length === 0 && (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-gray-500">
                        <div className="flex flex-col items-center">
                          <span className="text-4xl mb-2">
                            {viewAnuladas ? "📭" : "📋"}
                          </span>
                          {searchTerm
                            ? `No se encontraron compras ${viewAnuladas ? 'anuladas' : ''} que coincidan con "${searchTerm}"`
                            : viewAnuladas
                              ? "No hay compras anuladas"
                              : "No hay compras registradas"
                          }
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Acciones masivas para compras seleccionadas */}
          {selectedCompras.length > 0 && (
            <div className="mt-4 bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {selectedCompras.length} compra(s) seleccionada(s)
                </span>
                <div className="flex gap-2">
                  {viewAnuladas ? (
                    <button
                      onClick={() => {
                        const comprasToReactivate = selectedCompras.map(id =>
                          compras.find(c => c.id === id)
                        ).filter(compra => compra && compra.estado === "ANULADA")

                        if (comprasToReactivate.length > 0) {
                          comprasToReactivate.forEach(compra => {
                            if (editar?.mutate) {
                              editar.mutate({
                                id: compra.id,
                                nroFactura: compra.nroFactura,
                                total: parseFloat(compra.total) || 0,
                                estado: "REGISTRADA",
                                proveedor: compra.proveedor,
                                fechaCompra: compra.fechaCompra,
                                detalles: compra.detalles || []
                              })
                            }
                          })
                        }
                      }}
                      className="group text-green-600 flex items-center gap-x-2 hover:cursor-pointer border-b-1 hover:text-green-700 px-2 py-1 "
                    >
                      <RefreshCcw className="group-hover:animate-spin" size={20} /> <span>Reactivar Seleccionadas</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        const comprasToDelete = selectedCompras.map(id =>
                          compras.find(c => c.id === id)
                        ).filter(compra => compra && compra.estado !== "ANULADA")

                        if (comprasToDelete.length > 0) {
                          comprasToDelete.forEach(compra => {
                            if (eliminar?.mutate) {
                              eliminar.mutate(compra.id)
                            }
                          })
                        }
                      }}
                      className="text-red-600 flex items-center gap-x-2 hover:cursor-pointer hover:text-red-700 px-3 py-1 "
                    >
                      <Trash2 /> <span>Anular seleccionadas</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Exportación correcta
export default GestionCompras