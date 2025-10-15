import { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Package,
  Layers,
  X,
  CheckCircle,
  XCircle,
  Tag,
  Palette,
  Ruler,
  Barcode,
  DollarSign,
  Box
} from 'lucide-react';

// Datos de prueba para categorías
const categoriasMock = [
  { id: 1, nombre: 'Zapatillas Deportivas', genero: 'unisex', activo: true },
  { id: 2, nombre: 'Sandalias', genero: 'mujer', activo: true },
  { id: 3, nombre: 'Zapatos Formales', genero: 'hombre', activo: true },
  { id: 4, nombre: 'Botas', genero: 'unisex', activo: true },
];

// Datos iniciales de productos
const productosIniciales = [
  {
    id: 1,
    nombre: 'Zapatillas Running Pro',
    modelo: 'Air Max 2024',
    marca: 'Nike',
    descripcion: 'Zapatillas ideales para running de larga distancia',
    categoriaId: 1,
    categoria: 'Zapatillas Deportivas',
    activo: true,
    variantes: [
      {
        id: 1,
        talla: 42,
        color: 'Negro',
        codigo: 'ZAP-RUN-42-NEG',
        precioCompra: 45.00,
        precioVenta: 89.99,
        stockActual: 25,
        stockMinimo: 5,
        activo: true
      },
      {
        id: 2,
        talla: 43,
        color: 'Azul',
        codigo: 'ZAP-RUN-43-AZU',
        precioCompra: 45.00,
        precioVenta: 89.99,
        stockActual: 20,
        stockMinimo: 5,
        activo: true
      }
    ]
  },
  {
    id: 2,
    nombre: 'Zapatillas Basketball Elite',
    modelo: 'Pro Model 2024',
    marca: 'Adidas',
    descripcion: 'Zapatillas de alto rendimiento para basketball',
    categoriaId: 1,
    categoria: 'Zapatillas Deportivas',
    activo: true,
    variantes: [
      {
        id: 3,
        talla: 44,
        color: 'Rojo',
        codigo: 'ZAP-BASK-44-ROJ',
        precioCompra: 60.00,
        precioVenta: 119.99,
        stockActual: 15,
        stockMinimo: 3,
        activo: true
      }
    ]
  },
  {
    id: 3,
    nombre: 'Sandalias Comfort',
    modelo: 'Arizona Soft',
    marca: 'Birkenstock',
    descripcion: 'Sandalias cómodas para el verano',
    categoriaId: 2,
    categoria: 'Sandalias',
    activo: true,
    variantes: [
      {
        id: 4,
        talla: 38,
        color: 'Blanco',
        codigo: 'SAND-38-BLAN',
        precioCompra: 35.50,
        precioVenta: 59.99,
        stockActual: 30,
        stockMinimo: 8,
        activo: true
      },
      {
        id: 5,
        talla: 39,
        color: 'Marrón',
        codigo: 'SAND-39-MARR',
        precioCompra: 35.50,
        precioVenta: 59.99,
        stockActual: 25,
        stockMinimo: 8,
        activo: true
      }
    ]
  }
];

const GestionProductos = () => {
  const [productos, setProductos] = useState(productosIniciales);
  const [filtroBusqueda, setFiltroBusqueda] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('todos');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  // Estados para modales
  const [modalProductoAbierto, setModalProductoAbierto] = useState(false);
  const [modalVarianteAbierto, setModalVarianteAbierto] = useState(false);
  const [modalDetallesAbierto, setModalDetallesAbierto] = useState(false);

  // Estados para datos en edición
  const [productoEditando, setProductoEditando] = useState(null);
  const [varianteEditando, setVarianteEditando] = useState(null);
  const [productoDetalles, setProductoDetalles] = useState(null);

  // Estados para formularios
  const [formProducto, setFormProducto] = useState({
    nombre: '',
    modelo: '',
    marca: '',
    descripcion: '',
    categoriaId: '',
    activo: true
  });

  const [formVariante, setFormVariante] = useState({
    talla: '',
    color: '',
    codigo: '',
    precioCompra: '',
    precioVenta: '',
    stockActual: '',
    stockMinimo: '',
    activo: true
  });

  // Resetear formularios
  const resetFormProducto = () => {
    setFormProducto({
      nombre: '',
      modelo: '',
      marca: '',
      descripcion: '',
      categoriaId: '',
      activo: true
    });
    setProductoEditando(null);
  };

  const resetFormVariante = () => {
    setFormVariante({
      talla: '',
      color: '',
      codigo: '',
      precioCompra: '',
      precioVenta: '',
      stockActual: '',
      stockMinimo: '',
      activo: true
    });
    setVarianteEditando(null);
  };

  // Abrir modales
  const abrirModalNuevoProducto = () => {
    resetFormProducto();
    setModalProductoAbierto(true);
  };

  const abrirModalEditarProducto = (producto) => {
    setFormProducto({
      nombre: producto.nombre,
      modelo: producto.modelo,
      marca: producto.marca,
      descripcion: producto.descripcion,
      categoriaId: producto.categoriaId,
      activo: producto.activo
    });
    setProductoEditando(producto);
    setModalProductoAbierto(true);
  };

  const abrirModalNuevaVariante = (producto) => {
    resetFormVariante();
    setProductoEditando(producto);
    setModalVarianteAbierto(true);
  };

  const abrirModalEditarVariante = (producto, variante) => {
    setFormVariante({
      talla: variante.talla,
      color: variante.color,
      codigo: variante.codigo,
      precioCompra: variante.precioCompra,
      precioVenta: variante.precioVenta,
      stockActual: variante.stockActual,
      stockMinimo: variante.stockMinimo,
      activo: variante.activo
    });
    setProductoEditando(producto);
    setVarianteEditando(variante);
    setModalVarianteAbierto(true);
  };

  const abrirModalDetalles = (producto) => {
    setProductoDetalles(producto);
    setModalDetallesAbierto(true);
  };

  // Cerrar modales
  const cerrarModalProducto = () => {
    setModalProductoAbierto(false);
    resetFormProducto();
  };

  const cerrarModalVariante = () => {
    setModalVarianteAbierto(false);
    resetFormVariante();
    setProductoEditando(null);
  };

  const cerrarModalDetalles = () => {
    setModalDetallesAbierto(false);
    setProductoDetalles(null);
  };

  // Guardar producto
  const guardarProducto = () => {
    if (!formProducto.nombre || !formProducto.marca || !formProducto.categoriaId) {
      alert('Por favor complete los campos requeridos');
      return;
    }

    const categoria = categoriasMock.find(c => c.id === parseInt(formProducto.categoriaId));

    const productoData = {
      ...formProducto,
      categoria: categoria.nombre,
      variantes: productoEditando ? productoEditando.variantes : []
    };

    if (productoEditando) {
      // Editar producto existente
      setProductos(prev => prev.map(p =>
        p.id === productoEditando.id
          ? { ...p, ...productoData, id: productoEditando.id }
          : p
      ));
    } else {
      // Crear nuevo producto
      const nuevoProducto = {
        ...productoData,
        id: Math.max(...productos.map(p => p.id)) + 1
      };
      setProductos(prev => [nuevoProducto, ...prev]);
    }

    cerrarModalProducto();
    alert(productoEditando ? 'Producto actualizado exitosamente' : 'Producto creado exitosamente');
  };

  // Guardar variante
  const guardarVariante = () => {
    if (!formVariante.talla || !formVariante.color || !formVariante.precioVenta) {
      alert('Por favor complete los campos requeridos');
      return;
    }

    const varianteData = {
      ...formVariante,
      talla: parseFloat(formVariante.talla),
      precioCompra: parseFloat(formVariante.precioCompra) || 0,
      precioVenta: parseFloat(formVariante.precioVenta),
      stockActual: parseInt(formVariante.stockActual) || 0,
      stockMinimo: parseInt(formVariante.stockMinimo) || 0
    };

    if (varianteEditando) {
      // Editar variante existente
      setProductos(prev => prev.map(p =>
        p.id === productoEditando.id
          ? {
            ...p,
            variantes: p.variantes.map(v =>
              v.id === varianteEditando.id
                ? { ...v, ...varianteData, id: varianteEditando.id }
                : v
            )
          }
          : p
      ));
    } else {
      // Crear nueva variante
      const nuevaVariante = {
        ...varianteData,
        id: Math.max(...productoEditando.variantes.map(v => v.id)) + 1
      };

      setProductos(prev => prev.map(p =>
        p.id === productoEditando.id
          ? { ...p, variantes: [...p.variantes, nuevaVariante] }
          : p
      ));
    }

    cerrarModalVariante();
    alert(varianteEditando ? 'Variante actualizada exitosamente' : 'Variante creada exitosamente');
  };

  // Eliminar producto
  const eliminarProducto = (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar este producto?')) {
      setProductos(prev => prev.filter(p => p.id !== id));
      alert('Producto eliminado exitosamente');
    }
  };

  // Eliminar variante
  const eliminarVariante = (productoId, varianteId) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta variante?')) {
      setProductos(prev => prev.map(p =>
        p.id === productoId
          ? { ...p, variantes: p.variantes.filter(v => v.id !== varianteId) }
          : p
      ));
      alert('Variante eliminada exitosamente');
    }
  };

  // Toggle estado producto
  const toggleEstadoProducto = (id) => {
    setProductos(prev => prev.map(p =>
      p.id === id ? { ...p, activo: !p.activo } : p
    ));
  };

  // Toggle estado variante
  const toggleEstadoVariante = (productoId, varianteId) => {
    setProductos(prev => prev.map(p =>
      p.id === productoId
        ? {
          ...p,
          variantes: p.variantes.map(v =>
            v.id === varianteId ? { ...v, activo: !v.activo } : v
          )
        }
        : p
    ));
  };

  // Filtrar productos
  const productosFiltrados = productos.filter(producto => {
    const coincideBusqueda = producto.nombre.toLowerCase().includes(filtroBusqueda.toLowerCase()) ||
      producto.marca.toLowerCase().includes(filtroBusqueda.toLowerCase()) ||
      producto.modelo?.toLowerCase().includes(filtroBusqueda.toLowerCase());

    const coincideCategoria = filtroCategoria === 'todos' ||
      producto.categoriaId.toString() === filtroCategoria;

    const coincideEstado = filtroEstado === 'todos' ||
      (filtroEstado === 'activos' && producto.activo) ||
      (filtroEstado === 'inactivos' && !producto.activo);

    return coincideBusqueda && coincideCategoria && coincideEstado;
  });

  // Obtener color del estado
  const getColorEstado = (activo) => {
    return activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  // Obtener icono del estado
  const getIconoEstado = (activo) => {
    return activo ? <CheckCircle size={16} /> : <XCircle size={16} />;
  };

  // Calcular stock total del producto
  const calcularStockTotal = (variantes) => {
    return variantes.reduce((total, variante) => total + variante.stockActual, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <Package className="text-blue-600" />
                Gestión de Productos
              </h1>
              <p className="text-gray-600 mt-1">Administra productos y sus variantes</p>
            </div>
            <button
              onClick={abrirModalNuevoProducto}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus size={20} />
              Nuevo Producto
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
                  placeholder="Buscar productos por nombre, marca o modelo..."
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
                <option value="activos">Solo activos</option>
                <option value="inactivos">Solo inactivos</option>
              </select>
            </div>
          </div>

          {/* Filtros expandidos */}
          {mostrarFiltros && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categoría
                  </label>
                  <select
                    value={filtroCategoria}
                    onChange={(e) => setFiltroCategoria(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="todos">Todas las categorías</option>
                    {categoriasMock.map(categoria => (
                      <option key={categoria.id} value={categoria.id}>
                        {categoria.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock mínimo
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Lista de Productos */}
        <div className="space-y-6">
          {productosFiltrados.map((producto) => (
            <div key={producto.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              {/* Header del Producto */}
              <div className="border-b border-gray-200 p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{producto.nombre}</h3>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getColorEstado(producto.activo)}`}>
                        {getIconoEstado(producto.activo)}
                        {producto.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Tag size={14} />
                        {producto.marca} - {producto.modelo}
                      </span>
                      <span className="flex items-center gap-1">
                        <Layers size={14} />
                        {producto.categoria}
                      </span>
                      <span className="flex items-center gap-1">
                        <Box size={14} />
                        Stock total: {calcularStockTotal(producto.variantes)} unidades
                      </span>
                    </div>
                    {producto.descripcion && (
                      <p className="text-gray-600 mt-2 text-sm">{producto.descripcion}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-4 lg:mt-0">
                    <button
                      onClick={() => abrirModalDetalles(producto)}
                      className="text-blue-600 hover:text-blue-900 transition-colors p-2"
                      title="Ver detalles"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => abrirModalEditarProducto(producto)}
                      className="text-green-600 hover:text-green-900 transition-colors p-2"
                      title="Editar producto"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => abrirModalNuevaVariante(producto)}
                      className="text-blue-600 hover:text-blue-900 transition-colors p-2"
                      title="Agregar variante"
                    >
                      <Plus size={16} />
                    </button>
                    <button
                      onClick={() => toggleEstadoProducto(producto.id)}
                      className={`p-2 transition-colors ${producto.activo
                        ? 'text-orange-600 hover:text-orange-900'
                        : 'text-green-600 hover:text-green-900'
                        }`}
                      title={producto.activo ? 'Desactivar' : 'Activar'}
                    >
                      {producto.activo ? <XCircle size={16} /> : <CheckCircle size={16} />}
                    </button>
                    <button
                      onClick={() => eliminarProducto(producto.id)}
                      className="text-red-600 hover:text-red-900 transition-colors p-2"
                      title="Eliminar producto"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Variantes del Producto */}
              <div className="p-6">
                <h4 className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
                  <Layers size={16} />
                  Variantes ({producto.variantes.length})
                </h4>

                {producto.variantes.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {producto.variantes.map((variante) => (
                      <div key={variante.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-gray-900">
                                Talla {variante.talla} - {variante.color}
                              </span>
                              <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs font-medium ${getColorEstado(variante.activo)}`}>
                                {getIconoEstado(variante.activo)}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600 flex items-center gap-1 mb-1">
                              <Barcode size={12} />
                              {variante.codigo}
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <button
                              onClick={() => abrirModalEditarVariante(producto, variante)}
                              className="text-green-600 hover:text-green-900 transition-colors p-1"
                              title="Editar variante"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              onClick={() => toggleEstadoVariante(producto.id, variante.id)}
                              className={`p-1 transition-colors ${variante.activo
                                ? 'text-orange-600 hover:text-orange-900'
                                : 'text-green-600 hover:text-green-900'
                                }`}
                              title={variante.activo ? 'Desactivar' : 'Activar'}
                            >
                              {variante.activo ? <XCircle size={14} /> : <CheckCircle size={14} />}
                            </button>
                            <button
                              onClick={() => eliminarVariante(producto.id, variante.id)}
                              className="text-red-600 hover:text-red-900 transition-colors p-1"
                              title="Eliminar variante"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-gray-600">Precio:</span>
                            <div className="font-semibold text-green-600">${variante.precioVenta}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Stock:</span>
                            <div className={`font-semibold ${variante.stockActual <= variante.stockMinimo
                              ? 'text-red-600'
                              : 'text-gray-900'
                              }`}>
                              {variante.stockActual} / {variante.stockMinimo}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Layers className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p>No hay variantes registradas</p>
                    <button
                      onClick={() => abrirModalNuevaVariante(producto)}
                      className="text-blue-600 hover:text-blue-800 mt-2 text-sm"
                    >
                      Agregar primera variante
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {productosFiltrados.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay productos</h3>
            <p className="text-gray-500 mb-4">
              {filtroBusqueda || filtroEstado !== 'todos' || filtroCategoria !== 'todos'
                ? 'No se encontraron productos con los filtros aplicados'
                : 'Comienza registrando tu primer producto'
              }
            </p>
            <button
              onClick={abrirModalNuevoProducto}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Crear Primer Producto
            </button>
          </div>
        )}
      </div>

      {/* Modal de Producto */}
      {modalProductoAbierto && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  {productoEditando ? 'Editar Producto' : 'Nuevo Producto'}
                </h3>
                <button
                  onClick={cerrarModalProducto}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del Producto *
                  </label>
                  <input
                    type="text"
                    value={formProducto.nombre}
                    onChange={(e) => setFormProducto(prev => ({ ...prev, nombre: e.target.value }))}
                    placeholder="Ej: Zapatillas Running Pro"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Marca *
                    </label>
                    <input
                      type="text"
                      value={formProducto.marca}
                      onChange={(e) => setFormProducto(prev => ({ ...prev, marca: e.target.value }))}
                      placeholder="Ej: Nike"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Modelo
                    </label>
                    <input
                      type="text"
                      value={formProducto.modelo}
                      onChange={(e) => setFormProducto(prev => ({ ...prev, modelo: e.target.value }))}
                      placeholder="Ej: Air Max 2024"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoría *
                  </label>
                  <select
                    value={formProducto.categoriaId}
                    onChange={(e) => setFormProducto(prev => ({ ...prev, categoriaId: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Seleccionar categoría</option>
                    {categoriasMock.map(categoria => (
                      <option key={categoria.id} value={categoria.id}>
                        {categoria.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción
                  </label>
                  <textarea
                    value={formProducto.descripcion}
                    onChange={(e) => setFormProducto(prev => ({ ...prev, descripcion: e.target.value }))}
                    placeholder="Describe el producto..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="activo"
                    checked={formProducto.activo}
                    onChange={(e) => setFormProducto(prev => ({ ...prev, activo: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="activo" className="text-sm text-gray-700">
                    Producto activo
                  </label>
                </div>
              </div>

              <div className="flex gap-3 justify-end mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={cerrarModalProducto}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={guardarProducto}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {productoEditando ? 'Actualizar Producto' : 'Crear Producto'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Variante */}
      {modalVarianteAbierto && productoEditando && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  {varianteEditando ? 'Editar Variante' : 'Nueva Variante'} - {productoEditando.nombre}
                </h3>
                <button
                  onClick={cerrarModalVariante}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Talla *
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={formVariante.talla}
                    onChange={(e) => setFormVariante(prev => ({ ...prev, talla: e.target.value }))}
                    placeholder="Ej: 42"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color *
                  </label>
                  <input
                    type="text"
                    value={formVariante.color}
                    onChange={(e) => setFormVariante(prev => ({ ...prev, color: e.target.value }))}
                    placeholder="Ej: Negro"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Código SKU
                  </label>
                  <input
                    type="text"
                    value={formVariante.codigo}
                    onChange={(e) => setFormVariante(prev => ({ ...prev, codigo: e.target.value }))}
                    placeholder="Ej: ZAP-RUN-42-NEG"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Precio de Compra
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formVariante.precioCompra}
                    onChange={(e) => setFormVariante(prev => ({ ...prev, precioCompra: e.target.value }))}
                    placeholder="0.00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Precio de Venta *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formVariante.precioVenta}
                    onChange={(e) => setFormVariante(prev => ({ ...prev, precioVenta: e.target.value }))}
                    placeholder="0.00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock Actual
                  </label>
                  <input
                    type="number"
                    value={formVariante.stockActual}
                    onChange={(e) => setFormVariante(prev => ({ ...prev, stockActual: e.target.value }))}
                    placeholder="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock Mínimo
                  </label>
                  <input
                    type="number"
                    value={formVariante.stockMinimo}
                    onChange={(e) => setFormVariante(prev => ({ ...prev, stockMinimo: e.target.value }))}
                    placeholder="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4">
                <input
                  type="checkbox"
                  id="varianteActiva"
                  checked={formVariante.activo}
                  onChange={(e) => setFormVariante(prev => ({ ...prev, activo: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="varianteActiva" className="text-sm text-gray-700">
                  Variante activa
                </label>
              </div>

              <div className="flex gap-3 justify-end mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={cerrarModalVariante}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={guardarVariante}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {varianteEditando ? 'Actualizar Variante' : 'Crear Variante'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Detalles */}
      {modalDetallesAbierto && productoDetalles && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Detalles del Producto - {productoDetalles.nombre}
                </h3>
                <button
                  onClick={cerrarModalDetalles}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Información del Producto */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Información General</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Nombre:</label>
                      <p className="text-gray-900">{productoDetalles.nombre}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Marca - Modelo:</label>
                      <p className="text-gray-900">{productoDetalles.marca} - {productoDetalles.modelo}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Categoría:</label>
                      <p className="text-gray-900">{productoDetalles.categoria}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Estado:</label>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getColorEstado(productoDetalles.activo)}`}>
                        {getIconoEstado(productoDetalles.activo)}
                        {productoDetalles.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                    {productoDetalles.descripcion && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Descripción:</label>
                        <p className="text-gray-900 mt-1">{productoDetalles.descripcion}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Estadísticas */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Estadísticas</h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total de variantes:</span>
                      <span className="font-semibold text-gray-900">{productoDetalles.variantes.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Stock total:</span>
                      <span className="font-semibold text-gray-900">
                        {calcularStockTotal(productoDetalles.variantes)} unidades
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Variantes activas:</span>
                      <span className="font-semibold text-gray-900">
                        {productoDetalles.variantes.filter(v => v.activo).length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Precio promedio:</span>
                      <span className="font-semibold text-green-600">
                        ${(productoDetalles.variantes.reduce((sum, v) => sum + v.precioVenta, 0) / productoDetalles.variantes.length).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Variantes */}
              <div className="mt-8">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Variantes</h4>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Talla - Color</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Código</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Precio Venta</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Stock</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {productoDetalles.variantes.map((variante) => (
                        <tr key={variante.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {variante.talla} - {variante.color}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">{variante.codigo}</td>
                          <td className="px-4 py-3 text-sm font-semibold text-green-600">
                            ${variante.precioVenta}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <span className={`font-semibold ${variante.stockActual <= variante.stockMinimo
                              ? 'text-red-600'
                              : 'text-gray-900'
                              }`}>
                              {variante.stockActual} / {variante.stockMinimo}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getColorEstado(variante.activo)}`}>
                              {getIconoEstado(variante.activo)}
                              {variante.activo ? 'Activa' : 'Inactiva'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionProductos;