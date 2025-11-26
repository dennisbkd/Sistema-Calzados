import { useState, useMemo, useEffect, useCallback } from "react"
import { Package, Plus, Save, Trash2, CheckCircle } from "lucide-react"
import ListaProductos from "./ListaProductos"

const FormularioCompra = ({
  editingCompra,
  proveedores,
  cargandoProveedores,
  todasLasVariantes,
  cargandoProductos,
  generateCodigoFactura,
  crear,
  editar,
  usuario,
  closeModal
}) => {
  // Estados del formulario
  const [nroFacturaInput, setNroFacturaInput] = useState("")
  const [estadoInput, setEstadoInput] = useState("REGISTRADA")
  const [proveedorInput, setProveedorInput] = useState("")
  const [fechaCompraInput, setFechaCompraInput] = useState("")
  const [detallesInput, setDetallesInput] = useState([])
  const [generandoCodigo, setGenerandoCodigo] = useState(false)

  // Estado para nuevo detalle
  const [nuevoDetalle, setNuevoDetalle] = useState({
    varianteId: "",
    cantidad: "",
    precioUnitario: "",
    varianteSeleccionada: null
  })

  // Calcular total automáticamente
  const totalCalculado = useMemo(() => {
    return detallesInput.reduce((total, detalle) => {
      return total + (detalle.cantidad * detalle.precioUnitario)
    }, 0)
  }, [detallesInput])

  // Generar código de factura con useCallback para evitar recreación
  const generarCodigoFacturaF = useCallback(async () => {
    if (!generateCodigoFactura) return
    setGenerandoCodigo(true)
    generateCodigoFactura.mutate(undefined, {
      onSuccess: (data) => setNroFacturaInput(data || "FAC-"),
      onSettled: () => setGenerandoCodigo(false)
    })
  }, [generateCodigoFactura])

  // Inicializar formulario
  useEffect(() => {
    if (editingCompra) {
      setNroFacturaInput(editingCompra.nroFactura || "")
      setEstadoInput(editingCompra.estado || "REGISTRADA")
      setProveedorInput(editingCompra.proveedor || "")

      const fecha = editingCompra.fechaCompra ? editingCompra.fechaCompra.split('T')[0] : new Date().toISOString().split('T')[0]
      setFechaCompraInput(fecha)

      if (editingCompra.detalles && Array.isArray(editingCompra.detalles)) {
        const detallesCargados = editingCompra.detalles.map(detalle => ({
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
      setNroFacturaInput("")
      setEstadoInput("REGISTRADA")
      setProveedorInput("")
      setFechaCompraInput(new Date().toISOString().split('T')[0])
      setDetallesInput([])
      generarCodigoFacturaF()
    }
  }, [editingCompra, generarCodigoFacturaF]) // ✅ Ahora incluye la dependencia

  // Agregar detalle a la compra
  const agregarDetalle = () => {
    if (!nuevoDetalle.varianteId || !nuevoDetalle.cantidad || nuevoDetalle.cantidad <= 0 || !nuevoDetalle.precioUnitario || nuevoDetalle.precioUnitario <= 0) {
      return
    }

    const varianteSeleccionada = todasLasVariantes.find(v => v.id === parseInt(nuevoDetalle.varianteId))
    if (!varianteSeleccionada) return

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
    if (!nroFacturaInput.trim() || !proveedorInput.trim() || detallesInput.length === 0) {
      return
    }

    const proveedorSeleccionado = proveedores.find(p => p.nombre === proveedorInput)
    if (!proveedorSeleccionado) return

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
        usuarioId: usuario?.id || 1,
        detallesEliminar: detallesEliminar,
        detallesNuevos: detallesNuevos
      }

      editar.mutate(compraData, {
        onSuccess: () => closeModal()
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
        usuarioId: usuario?.id || 1,
        detalles: detallesNuevos
      }

      crear.mutate(compraData, {
        onSuccess: () => closeModal()
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

  return (
    <>
      {/* Campos principales */}
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
            {generandoCodigo && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              </div>
            )}
            {!generandoCodigo && nroFacturaInput && (
              <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500" size={16} />
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">Código generado automáticamente</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Proveedor *</label>
          {cargandoProveedores ? (
            <div className="flex items-center gap-2 text-gray-500">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              Cargando proveedores...
            </div>
          ) : (
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

      {/* Formulario para agregar productos */}
      <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-blue-50/50">
        <h4 className="text-md font-semibold mb-3 text-gray-800 flex items-center gap-2">
          <Package size={20} className="text-blue-600" />
          Agregar Productos
          {editingCompra && (editingCompra.estado === 'PAGADA' || editingCompra.estado === 'ANULADA') && (
            <span className="text-sm text-yellow-600 font-normal">
              (No disponible para compras {editingCompra.estado.toLowerCase()}s)
            </span>
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
                  onChange={(e) => setNuevoDetalle({ ...nuevoDetalle, cantidad: e.target.value })}
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
                  onChange={(e) => setNuevoDetalle({ ...nuevoDetalle, precioUnitario: e.target.value })}
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

      {/* Lista de productos */}
      <ListaProductos
        detallesInput={detallesInput}
        eliminarDetalle={eliminarDetalle}
        editingCompra={editingCompra}
        formatCurrency={formatCurrency}
      />

      {/* Total y botones */}
      <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg mb-6 text-white">
        <span className="text-lg font-semibold">Total de la Compra:</span>
        <span className="text-2xl font-bold">{formatCurrency(totalCalculado)}</span>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleCreateOrEdit}
          disabled={
            crear.isPending ||
            editar.isPending ||
            detallesInput.length === 0 ||
            (editingCompra && (editingCompra.estado === 'PAGADA' || editingCompra.estado === 'ANULADA'))
          }
          className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-lg shadow-green-600/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {crear.isPending || editar.isPending ? (
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
          disabled={crear.isPending || editar.isPending}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Cancelar
        </button>
      </div>
    </>
  )
}

export default FormularioCompra