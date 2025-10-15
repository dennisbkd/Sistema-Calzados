import { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  ShoppingCart,
  X,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';

// Datos de prueba
const proveedoresMock = [
  { id: 1, nombre: 'Deportes S.A.', contacto: 'Juan Pérez', telefono: '+123456789' },
  { id: 2, nombre: 'Calzados Elite', contacto: 'María García', telefono: '+987654321' },
  { id: 3, nombre: 'Moda Deportiva', contacto: 'Carlos López', telefono: '+555555555' },
];

const productosMock = [
  {
    id: 1,
    nombre: 'Zapatillas Running Pro',
    marca: 'Nike',
    variantes: [
      { id: 1, talla: 42, color: 'Negro', precioVenta: 89.99, stock: 25 },
      { id: 2, talla: 43, color: 'Azul', precioVenta: 89.99, stock: 20 }
    ]
  },
  {
    id: 2,
    nombre: 'Zapatillas Basketball',
    marca: 'Adidas',
    variantes: [
      { id: 3, talla: 44, color: 'Rojo', precioVenta: 119.99, stock: 15 },
      { id: 4, talla: 45, color: 'Negro', precioVenta: 119.99, stock: 10 }
    ]
  },
  {
    id: 3,
    nombre: 'Sandalias Verano',
    marca: 'Birkenstock',
    variantes: [
      { id: 5, talla: 38, color: 'Blanco', precioVenta: 59.99, stock: 30 },
      { id: 6, talla: 39, color: 'Marrón', precioVenta: 59.99, stock: 25 }
    ]
  },
];

// Datos iniciales de compras
const comprasIniciales = [
  {
    id: 1,
    nroFactura: 'FAC-001-2024',
    proveedorId: 1,
    proveedor: 'Deportes S.A.',
    fecha: '2024-01-15',
    total: 1250.75,
    estado: 'REGISTRADA',
    detalles: [
      { id: 1, producto: 'Zapatillas Running Pro', variante: '42 - Negro', cantidad: 5, precioUnitario: 45.00, subtotal: 225.00 },
      { id: 2, producto: 'Zapatillas Basketball', variante: '44 - Rojo', cantidad: 3, precioUnitario: 60.00, subtotal: 180.00 }
    ]
  },
  {
    id: 2,
    nroFactura: 'FAC-002-2024',
    proveedorId: 2,
    proveedor: 'Calzados Elite',
    fecha: '2024-01-10',
    total: 890.50,
    estado: 'PAGADA',
    detalles: [
      { id: 3, producto: 'Sandalias Verano', variante: '38 - Blanco', cantidad: 10, precioUnitario: 35.50, subtotal: 355.00 }
    ]
  },
  {
    id: 3,
    nroFactura: 'FAC-003-2024',
    proveedorId: 3,
    proveedor: 'Moda Deportiva',
    fecha: '2024-01-05',
    total: 2100.00,
    estado: 'ANULADA',
    detalles: [
      { id: 4, producto: 'Zapatos Casual', variante: '41 - Marrón', cantidad: 8, precioUnitario: 75.00, subtotal: 600.00 }
    ]
  }
];

const GestionCompras = () => {
  const [compras, setCompras] = useState(comprasIniciales);
  const [filtroBusqueda, setFiltroBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [compraEditando, setCompraEditando] = useState(null);
  const [modalDetalles, setModalDetalles] = useState(null);

  // Estados para el formulario
  const [formData, setFormData] = useState({
    nroFactura: '',
    proveedorId: '',
    estado: 'REGISTRADA',
    detalles: []
  });

  // Resetear formulario
  const resetForm = () => {
    setFormData({
      nroFactura: '',
      proveedorId: '',
      estado: 'REGISTRADA',
      detalles: []
    });
    setCompraEditando(null);
  };

  // Abrir modal para nueva compra
  const abrirModalNuevo = () => {
    resetForm();
    setModalAbierto(true);
  };

  // Abrir modal para editar compra
  const abrirModalEditar = (compra) => {
    setFormData({
      nroFactura: compra.nroFactura,
      proveedorId: compra.proveedorId,
      estado: compra.estado,
      detalles: compra.detalles
    });
    setCompraEditando(compra);
    setModalAbierto(true);
  };

  // Cerrar modal
  const cerrarModal = () => {
    setModalAbierto(false);
    resetForm();
  };

  // Agregar detalle al formulario
  const agregarDetalle = () => {
    setFormData(prev => ({
      ...prev,
      detalles: [
        ...prev.detalles,
        {
          id: Date.now(),
          productoId: '',
          varianteId: '',
          cantidad: 1,
          precioUnitario: 0,
          subtotal: 0
        }
      ]
    }));
  };

  // Actualizar detalle
  const actualizarDetalle = (index, campo, valor) => {
    const nuevosDetalles = [...formData.detalles];
    nuevosDetalles[index] = { ...nuevosDetalles[index], [campo]: valor };

    // Calcular subtotal si cambia cantidad o precio
    if (campo === 'cantidad' || campo === 'precioUnitario') {
      const cantidad = campo === 'cantidad' ? parseInt(valor) : nuevosDetalles[index].cantidad;
      const precio = campo === 'precioUnitario' ? parseFloat(valor) : nuevosDetalles[index].precioUnitario;
      nuevosDetalles[index].subtotal = cantidad * precio;
    }

    setFormData(prev => ({ ...prev, detalles: nuevosDetalles }));
  };

  // Eliminar detalle
  const eliminarDetalle = (index) => {
    const nuevosDetalles = formData.detalles.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, detalles: nuevosDetalles }));
  };

  // Guardar compra (crear o editar)
  const guardarCompra = () => {
    if (!formData.nroFactura || !formData.proveedorId || formData.detalles.length === 0) {
      alert('Por favor complete todos los campos requeridos');
      return;
    }

    const total = formData.detalles.reduce((sum, detalle) => sum + detalle.subtotal, 0);
    const proveedor = proveedoresMock.find(p => p.id === parseInt(formData.proveedorId));

    const compraData = {
      ...formData,
      total,
      proveedor: proveedor.nombre,
      fecha: new Date().toISOString().split('T')[0],
      detalles: formData.detalles.map(detalle => ({
        ...detalle,
        producto: productosMock.find(p => p.variantes.some(v => v.id === parseInt(detalle.varianteId)))?.nombre || '',
        variante: detalle.varianteId ?
          productosMock
            .flatMap(p => p.variantes)
            .find(v => v.id === parseInt(detalle.varianteId))
            ? `${productosMock.flatMap(p => p.variantes).find(v => v.id === parseInt(detalle.varianteId))?.talla} - ${productosMock.flatMap(p => p.variantes).find(v => v.id === parseInt(detalle.varianteId))?.color}` : ''
          : ''
      }))
    };

    if (compraEditando) {
      // Editar compra existente
      setCompras(prev => prev.map(c =>
        c.id === compraEditando.id
          ? { ...c, ...compraData, id: compraEditando.id }
          : c
      ));
    } else {
      // Crear nueva compra
      const nuevaCompra = {
        ...compraData,
        id: Math.max(...compras.map(c => c.id)) + 1
      };
      setCompras(prev => [nuevaCompra, ...prev]);
    }

    cerrarModal();
    alert(compraEditando ? 'Compra actualizada exitosamente' : 'Compra creada exitosamente');
  };

  // Anular compra
  const anularCompra = (id) => {
    if (window.confirm('¿Está seguro de que desea anular esta compra?')) {
      setCompras(prev => prev.map(compra =>
        compra.id === id ? { ...compra, estado: 'ANULADA' } : compra
      ));
      alert('Compra anulada exitosamente');
    }
  };

  // Filtrar compras
  const comprasFiltradas = compras.filter(compra => {
    const coincideBusqueda = compra.nroFactura.toLowerCase().includes(filtroBusqueda.toLowerCase()) ||
      compra.proveedor.toLowerCase().includes(filtroBusqueda.toLowerCase());
    const coincideEstado = filtroEstado === 'todos' || compra.estado === filtroEstado;
    return coincideBusqueda && coincideEstado;
  });

  // Obtener color del estado
  const getColorEstado = (estado) => {
    switch (estado) {
      case 'REGISTRADA': return 'bg-blue-100 text-blue-800';
      case 'PAGADA': return 'bg-green-100 text-green-800';
      case 'ANULADA': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Obtener icono del estado
  const getIconoEstado = (estado) => {
    switch (estado) {
      case 'REGISTRADA': return <Clock size={16} />;
      case 'PAGADA': return <CheckCircle size={16} />;
      case 'ANULADA': return <XCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <ShoppingCart className="text-blue-600" />
                Gestión de Compras
              </h1>
              <p className="text-gray-600 mt-1">Administra las compras de productos</p>
            </div>
            <button
              onClick={abrirModalNuevo}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus size={20} />
              Nueva Compra
            </button>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Búsqueda */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar por factura o proveedor..."
                  value={filtroBusqueda}
                  onChange={(e) => setFiltroBusqueda(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Filtros adicionales */}
            <div className="flex gap-3">
              <button
                onClick={() => setMostrarFiltros(!mostrarFiltros)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <Filter size={16} />
                Filtros
              </button>

              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="todos">Todos los estados</option>
                <option value="REGISTRADA">Registradas</option>
                <option value="PAGADA">Pagadas</option>
                <option value="ANULADA">Anuladas</option>
              </select>
            </div>
          </div>

          {/* Filtros expandidos */}
          {mostrarFiltros && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rango de fechas
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Proveedor
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option value="">Todos los proveedores</option>
                    {proveedoresMock.map(proveedor => (
                      <option key={proveedor.id} value={proveedor.id}>
                        {proveedor.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Monto mínimo
                  </label>
                  <input
                    type="number"
                    placeholder="0.00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tabla de compras */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Factura
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Proveedor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {comprasFiltradas.map((compra) => (
                  <tr key={compra.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {compra.nroFactura}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{compra.proveedor}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{compra.fecha}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        ${compra.total.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getColorEstado(compra.estado)}`}>
                        {getIconoEstado(compra.estado)}
                        {compra.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setModalDetalles(compra)}
                          className="text-blue-600 hover:text-blue-900 transition-colors p-1"
                          title="Ver detalles"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => abrirModalEditar(compra)}
                          className="text-green-600 hover:text-green-900 transition-colors p-1"
                          title="Editar"
                        >
                          <Edit size={16} />
                        </button>
                        {compra.estado !== 'ANULADA' && (
                          <button
                            onClick={() => anularCompra(compra.id)}
                            className="text-red-600 hover:text-red-900 transition-colors p-1"
                            title="Anular"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {comprasFiltradas.length === 0 && (
            <div className="text-center py-12">
              <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No hay compras</h3>
              <p className="mt-2 text-gray-500">
                {filtroBusqueda || filtroEstado !== 'todos'
                  ? 'No se encontraron compras con los filtros aplicados'
                  : 'Comienza registrando tu primera compra'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de detalles */}
      {modalDetalles && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Detalles de Compra - {modalDetalles.nroFactura}
                </h3>
                <button
                  onClick={() => setModalDetalles(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="text-sm font-medium text-gray-700">Proveedor:</label>
                  <p className="text-gray-900">{modalDetalles.proveedor}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Fecha:</label>
                  <p className="text-gray-900">{modalDetalles.fecha}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Estado:</label>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getColorEstado(modalDetalles.estado)}`}>
                    {getIconoEstado(modalDetalles.estado)}
                    {modalDetalles.estado}
                  </span>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Total:</label>
                  <p className="text-lg font-semibold text-gray-900">
                    ${modalDetalles.total.toFixed(2)}
                  </p>
                </div>
              </div>

              <h4 className="font-medium text-gray-900 mb-3">Productos:</h4>
              <div className="border border-gray-200 rounded-lg">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Producto</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Variante</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Cantidad</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Precio Unit.</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {modalDetalles.detalles.map((detalle) => (
                      <tr key={detalle.id}>
                        <td className="px-4 py-2 text-sm text-gray-900">{detalle.producto}</td>
                        <td className="px-4 py-2 text-sm text-gray-600">{detalle.variante}</td>
                        <td className="px-4 py-2 text-sm text-gray-600">{detalle.cantidad}</td>
                        <td className="px-4 py-2 text-sm text-gray-600">${detalle.precioUnitario.toFixed(2)}</td>
                        <td className="px-4 py-2 text-sm font-medium text-gray-900">${detalle.subtotal.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de formulario */}
      {modalAbierto && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  {compraEditando ? 'Editar Compra' : 'Nueva Compra'}
                </h3>
                <button
                  onClick={cerrarModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número de Factura *
                  </label>
                  <input
                    type="text"
                    value={formData.nroFactura}
                    onChange={(e) => setFormData(prev => ({ ...prev, nroFactura: e.target.value }))}
                    placeholder="Ej: FAC-001-2024"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Proveedor *
                  </label>
                  <select
                    value={formData.proveedorId}
                    onChange={(e) => setFormData(prev => ({ ...prev, proveedorId: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Seleccionar proveedor</option>
                    {proveedoresMock.map(proveedor => (
                      <option key={proveedor.id} value={proveedor.id}>
                        {proveedor.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado
                  </label>
                  <select
                    value={formData.estado}
                    onChange={(e) => setFormData(prev => ({ ...prev, estado: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="REGISTRADA">Registrada</option>
                    <option value="PAGADA">Pagada</option>
                    <option value="ANULADA">Anulada</option>
                  </select>
                </div>
              </div>

              {/* Detalles de productos */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-medium text-gray-900">Productos de la Compra</h4>
                  <button
                    type="button"
                    onClick={agregarDetalle}
                    className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Plus size={16} />
                    Agregar Producto
                  </button>
                </div>

                {formData.detalles.map((detalle, index) => (
                  <div key={detalle.id} className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Producto *
                        </label>
                        <select
                          value={detalle.varianteId}
                          onChange={(e) => actualizarDetalle(index, 'varianteId', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Seleccionar producto</option>
                          {productosMock.flatMap(producto =>
                            producto.variantes.map(variante => (
                              <option key={variante.id} value={variante.id}>
                                {producto.nombre} - {variante.talla} - {variante.color}
                              </option>
                            ))
                          )}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Cantidad *
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={detalle.cantidad}
                          onChange={(e) => actualizarDetalle(index, 'cantidad', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Precio Unitario *
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={detalle.precioUnitario}
                          onChange={(e) => actualizarDetalle(index, 'precioUnitario', parseFloat(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Subtotal
                        </label>
                        <div className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 font-semibold">
                          ${(detalle.subtotal || 0).toFixed(2)}
                        </div>
                      </div>

                      <div className="flex items-end">
                        <button
                          type="button"
                          onClick={() => eliminarDetalle(index)}
                          className="text-red-600 hover:text-red-900 transition-colors p-2"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total y acciones */}
              <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                <div className="text-right">
                  <div className="text-sm text-gray-600">Total de la compra</div>
                  <div className="text-2xl font-bold text-gray-900">
                    ${formData.detalles.reduce((sum, detalle) => sum + (detalle.subtotal || 0), 0).toFixed(2)}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={cerrarModal}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={guardarCompra}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {compraEditando ? 'Actualizar Compra' : 'Registrar Compra'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionCompras;