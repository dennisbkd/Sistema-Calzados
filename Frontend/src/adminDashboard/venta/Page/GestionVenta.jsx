import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Tag,
  Filter,
  Search,
  Package,
  ShoppingCart,
  User,
  CreditCard,
  Plus,
  Minus,
  Trash2,
  CheckCircle,
  X,
  Clock,
  Check
} from "lucide-react";
import CardCategoriaProducto from "../components/CardCategoriaProducto";
import useProductoManager from "../../producto.jsx/hook/query/useProductoManager";
import { useBuscarProductos } from "../hooks/useVentaQuery";
import { useProductoFiltrado } from '../hooks/useVentaQuery';
import { useCrearVenta, useMetodosPago, useClientes } from '../hooks/useVentaQuery';
import toast from "react-hot-toast";

export const GestionVenta = () => {
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [productosMostrados, setProductosMostrados] = useState([]);

  // Estados del carrito y venta
  const [carrito, setCarrito] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState('');
  const [metodoPagoSeleccionado, setMetodoPagoSeleccionado] = useState('');
  const [referenciaPago, setReferenciaPago] = useState('');
  const [estadoVenta, setEstadoVenta] = useState('PAGADA'); // Estado por defecto: PAGADA

  const { categoriasActivas } = useProductoManager();
  const { mutate: crearVenta, isLoading: creandoVenta } = useCrearVenta();
  const { data: metodosPago = [] } = useMetodosPago();
  const { data: clientes = [] } = useClientes();

  // Consultas separadas
  const {
    data: productosBuscados = [],
    isLoading: isLoadingBuscados,
    error: errorBuscados
  } = useBuscarProductos(terminoBusqueda, {
    enabled: terminoBusqueda.trim() !== '',
  });

  const {
    data: productosCategoria = [],
    isLoading: isLoadingCategoria,
    error: errorCategoria
  } = useProductoFiltrado(categoriaSeleccionada, {
    enabled: !terminoBusqueda && categoriaSeleccionada !== null,
  });

  const {
    data: todosProductos = [],
    isLoading: isLoadingTodos,
    error: errorTodos
  } = useProductoFiltrado(null, {
    enabled: !terminoBusqueda && categoriaSeleccionada === null,
  });

  // Efecto para determinar qué productos mostrar
  useEffect(() => {
    if (terminoBusqueda.trim() !== '') {
      setProductosMostrados(productosBuscados);
    } else if (categoriaSeleccionada !== null) {
      setProductosMostrados(productosCategoria);
    } else {
      setProductosMostrados(todosProductos);
    }
  }, [terminoBusqueda, categoriaSeleccionada, productosBuscados, productosCategoria, todosProductos]);

  // Manejar cambio de búsqueda
  const handleBusquedaChange = (e) => {
    const valor = e.target.value;
    setTerminoBusqueda(valor);
    if (valor.trim() !== '') {
      setCategoriaSeleccionada(null);
    }
  };

  // Manejar cambio de categoría
  const handleCategoriaChange = (categoriaId) => {
    setCategoriaSeleccionada(categoriaId);
    setTerminoBusqueda('');
  };


  // Funciones del carrito - CORREGIDAS
  const agregarAlCarrito = (productoData) => {
    const productoExistente = carrito.find(item => item.varianteId === productoData.varianteId);

    if (productoExistente) {
      // Verificar stock antes de incrementar
      if (productoExistente.cantidad >= productoData.stockActual) {
        toast.error('No hay suficiente stock disponible');
        return;
      }
      setCarrito(carrito.map(item =>
        item.varianteId === productoData.varianteId
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      ));
    } else {
      setCarrito([...carrito, {
        varianteId: productoData.varianteId,
        productoId: productoData.productoId,
        nombre: productoData.nombre,
        talla: productoData.talla,
        color: productoData.color,
        precioUnitario: productoData.precioUnitario,
        precioOriginal: productoData.precioUnitario, // Guardar precio original
        cantidad: 1,
        stockActual: productoData.stockActual,
        promocion: productoData.promocion || null
      }]);
    }
  };

  // Cálculos CORREGIDOS
  const calcularDescuentoProducto = (producto) => {
    if (!producto.promocion) return 0;

    const subtotalProducto = producto.precioOriginal * producto.cantidad;

    switch (producto.promocion.tipo) {
      case 'PORCENTAJE':
        return subtotalProducto * (parseFloat(producto.promocion.valorDescuento) / 100);

      case 'MONTO_FIJO':
        return Math.min(parseFloat(producto.promocion.valorDescuento), subtotalProducto);

      case '2X1': {
        const pares = Math.floor(producto.cantidad / 2);
        return pares * producto.precioOriginal;
      }

      case '3X2': {
        const grupos = Math.floor(producto.cantidad / 3);
        return grupos * producto.precioOriginal;
      }

      default:
        return 0;
    }
  };

  const calcularPrecioFinalProducto = (producto) => {
    if (!producto.promocion) return producto.precioOriginal;

    switch (producto.promocion.tipo) {
      case 'PORCENTAJE':
        return producto.precioOriginal * (1 - parseFloat(producto.promocion.valorDescuento) / 100);

      case 'MONTO_FIJO':
        return Math.max(0, producto.precioOriginal - parseFloat(producto.promocion.valorDescuento));

      case '2X1':
      case '3X2':
        return producto.precioOriginal; // El descuento se aplica en el total

      default:
        return producto.precioOriginal;
    }
  };

  // Cálculos actualizados
  const subtotal = carrito.reduce((total, item) => total + (item.precioOriginal * item.cantidad), 0);
  const descuentoTotal = carrito.reduce((total, item) => total + calcularDescuentoProducto(item), 0);
  const totalFinal = subtotal - descuentoTotal;
  const totalProductos = carrito.reduce((total, item) => total + item.cantidad, 0);

  const quitarDelCarrito = (varianteId) => {
    setCarrito(carrito.filter(item => item.varianteId !== varianteId));
  };

  const actualizarCantidad = (varianteId, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      quitarDelCarrito(varianteId);
      return;
    }

    const producto = carrito.find(item => item.varianteId === varianteId);
    if (nuevaCantidad > producto.stockActual) {
      toast.error('No hay suficiente stock disponible');
      return;
    }

    setCarrito(carrito.map(item =>
      item.varianteId === varianteId
        ? { ...item, cantidad: nuevaCantidad }
        : item
    ));
  };

  // Función para crear venta - ACTUALIZADA con estado
  const handleCrearVenta = () => {
    if (carrito.length === 0) {
      toast.error('Agrega productos al carrito antes de crear la venta');
      return;
    }

    if (!clienteSeleccionado) {
      toast.error('Selecciona un cliente');
      return;
    }

    if (!metodoPagoSeleccionado && estadoVenta === 'PAGADA') {
      toast.error('Selecciona un método de pago');
      return;
    }

    const datosVenta = {
      clienteId: parseInt(clienteSeleccionado),
      usuarioId: 1, // Esto debería venir del contexto de autenticación
      metodoPagoId: parseInt(metodoPagoSeleccionado),
      referenciaPago: referenciaPago,
      estado: estadoVenta, // ← Agregar el estado seleccionado
      subtotal: subtotal, // Subtotal SIN descuentos
      productos: carrito.map(item => ({
        varianteId: item.varianteId,
        productoId: item.productoId, // Asegurar que se envía el productoId
        cantidad: item.cantidad,
        precioUnitario: item.precioUnitario, // Precio unitario (puede tener descuento)
        precioOriginal: item.precioOriginal, // Precio original sin descuento
        promocion: item.promocion // Enviar información de promoción
      }))
    };

    crearVenta(datosVenta, {
      onSuccess: (data) => {
        toast.success(`Venta ${data.nroFactura} ${data.estado} exitosamente`);
        setCarrito([]);
        setClienteSeleccionado('');
        setMetodoPagoSeleccionado('');
        setReferenciaPago('');
        setEstadoVenta('PAGADA'); // Resetear al estado por defecto
      },
      onError: (error) => {
        toast.error('Error al crear la venta: ' + error.message);
      }
    });
  };

  // Estados combinados
  const isLoading = isLoadingBuscados || isLoadingCategoria || isLoadingTodos;
  const error = errorBuscados || errorCategoria || errorTodos;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Columna izquierda - Catálogo de productos */}
      <div className="lg:col-span-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Filtrar Productos</h3>
          </div>

          {/* Barra de búsqueda */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por nombre, marca, modelo..."
              value={terminoBusqueda}
              onChange={handleBusquedaChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Categorías */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categorías
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <motion.button
                key="todos"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCategoriaChange(null)}
                className={`p-3 rounded-lg border-2 flex flex-col items-center gap-1 transition-all ${categoriaSeleccionada === null && terminoBusqueda === ''
                  ? 'border-blue-600 bg-blue-50 text-blue-600'
                  : 'border-gray-200 hover:border-blue-300'
                  }`}
              >
                <Package className="w-5 h-5" />
                <span className="text-xs font-medium">Todos</span>
              </motion.button>

              {categoriasActivas?.map((categoria) => (
                <motion.button
                  key={categoria.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleCategoriaChange(categoria.id)}
                  className={`p-3 rounded-lg border-2 flex flex-col items-center gap-1 transition-all ${categoriaSeleccionada === categoria.id && terminoBusqueda === ''
                    ? 'border-blue-600 bg-blue-50 text-blue-600'
                    : 'border-gray-200 hover:border-blue-300'
                    }`}
                >
                  <Tag className="w-5 h-5" />
                  <span className="text-xs font-medium">{categoria.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Indicador de filtro activo */}
          {(terminoBusqueda || categoriaSeleccionada !== null) && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-800">
                  {terminoBusqueda && `Búsqueda: "${terminoBusqueda}"`}
                  {categoriaSeleccionada && !terminoBusqueda &&
                    `Categoría: ${categoriasActivas?.find(c => c.id === categoriaSeleccionada)?.label}`
                  }
                </span>
                <button
                  onClick={() => {
                    setTerminoBusqueda('');
                    setCategoriaSeleccionada(null);
                  }}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Limpiar filtros
                </button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Catálogo de productos */}
        <CardCategoriaProducto
          productos={productosMostrados}
          isLoading={isLoading}
          error={error}
          onAgregarProducto={agregarAlCarrito}
        />

        {/* Información de resultados */}
        {!isLoading && !error && (
          <div className="mt-4 text-center text-sm text-gray-500">
            {terminoBusqueda && productosMostrados.length === 0 && (
              <p>No se encontraron productos para "{terminoBusqueda}"</p>
            )}
            {!terminoBusqueda && categoriaSeleccionada && productosMostrados.length === 0 && (
              <p>No hay productos en esta categoría</p>
            )}
            {!terminoBusqueda && categoriaSeleccionada === null && productosMostrados.length === 0 && (
              <p>No hay productos disponibles</p>
            )}
            {productosMostrados.length > 0 && (
              <p>Mostrando {productosMostrados.length} producto(s)</p>
            )}
          </div>
        )}
      </div>

      {/* Columna derecha - Carrito y formulario de venta */}
      <div className="lg:col-span-1">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 top-6"
        >
          {/* Header del carrito */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
              <h2 className="text-lg font-semibold">Carrito de Venta</h2>
              {carrito.length > 0 && (
                <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-sm">
                  {totalProductos}
                </span>
              )}
            </div>
          </div>

          {/* Lista de productos en el carrito */}
          <div className="p-6 border-b border-gray-200 max-h-96 overflow-y-auto">
            {carrito.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <ShoppingCart className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>El carrito está vacío</p>
                <p className="text-sm">Agrega productos del catálogo</p>
              </div>
            ) : (
              <div className="space-y-3">
                {carrito.map((item) => {
                  const precioFinal = calcularPrecioFinalProducto(item);
                  const descuentoItem = calcularDescuentoProducto(item);
                  const subtotalItem = item.precioOriginal * item.cantidad;
                  const totalItem = subtotalItem - descuentoItem;

                  return (
                    <div key={item.varianteId} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 text-sm truncate">
                          {item.nombre}
                          <span className="text-xs text-gray-500 ml-1">
                            (Talla: {item.talla}, Color: {item.color})
                          </span>
                        </div>

                        {/* Precios */}
                        <div className="space-y-1 mt-1">
                          {item.promocion ? (
                            <>
                              <div className="text-xs text-gray-600">
                                <span className="line-through">${item.precioOriginal.toFixed(2)}</span>
                                <span className="mx-1">→</span>
                                <span className="text-green-600 font-medium">${precioFinal.toFixed(2)}</span>
                                <span className="mx-1">x</span>
                                <span>{item.cantidad}</span>
                              </div>
                              <div className="text-xs text-green-600 font-medium">
                                Total: ${totalItem.toFixed(2)}
                                {descuentoItem > 0 && (
                                  <span className="text-orange-600 ml-1">
                                    (Ahorro: ${descuentoItem.toFixed(2)})
                                  </span>
                                )}
                              </div>
                            </>
                          ) : (
                            <div className="text-xs text-gray-600">
                              ${item.precioOriginal.toFixed(2)} x {item.cantidad} = ${totalItem.toFixed(2)}
                            </div>
                          )}
                        </div>

                        {/* Indicador de promoción */}
                        {item.promocion && (
                          <div className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full inline-flex items-center gap-1 mt-1">
                            <Tag className="w-3 h-3" />
                            {item.promocion.tipo === 'PORCENTAJE'
                              ? `${item.promocion.valorDescuento}% OFF`
                              : item.promocion.tipo === 'MONTO_FIJO'
                                ? `$${item.promocion.valorDescuento} OFF`
                                : item.promocion.tipo
                            }
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 bg-gray-100 rounded-lg">
                          <button
                            onClick={() => actualizarCantidad(item.varianteId, item.cantidad - 1)}
                            className="w-6 h-6 flex items-center justify-center hover:bg-gray-200 rounded transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-sm font-medium">{item.cantidad}</span>
                          <button
                            onClick={() => actualizarCantidad(item.varianteId, item.cantidad + 1)}
                            className="w-6 h-6 flex items-center justify-center hover:bg-gray-200 rounded transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <button
                          onClick={() => quitarDelCarrito(item.varianteId)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Formulario de venta */}
          <div className="p-6 space-y-4">
            {/* Selección de cliente */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 text-blue-600" />
                Cliente
              </label>
              <select
                value={clienteSeleccionado}
                onChange={(e) => setClienteSeleccionado(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Seleccionar cliente...</option>
                {clientes ? clientes?.map(cliente => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.nombre} - {cliente.contacto}
                  </option>
                )) : null}
              </select>
            </div>

            {/* Método de pago */}
            {estadoVenta === 'PAGADA' && metodosPago.length > 0 && (
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <CreditCard className="w-4 h-4 text-blue-600" />
                  Método de Pago
                </label>
                <select
                  value={metodoPagoSeleccionado}
                  onChange={(e) => setMetodoPagoSeleccionado(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Seleccionar método...</option>
                  {metodosPago ? metodosPago?.map(metodo => (
                    <option key={metodo.id} value={metodo.id}>
                      {metodo.nombre}
                    </option>
                  )) : null}
                </select>
              </div>
            )}

            {/* Estado de la venta */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                {estadoVenta === 'PAGADA' ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Clock className="w-4 h-4 text-orange-600" />
                )}
                Estado de la Venta
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setEstadoVenta('PAGADA')}
                  className={`p-3 border-2 rounded-lg flex items-center justify-center gap-2 transition-all ${estadoVenta === 'PAGADA'
                    ? 'border-green-600 bg-green-50 text-green-600 font-medium'
                    : 'border-gray-200 hover:border-green-300 text-gray-700'
                    }`}
                >
                  <Check className="w-4 h-4" />
                  Pagada
                </button>
                <button
                  type="button"
                  onClick={() => setEstadoVenta('REGISTRADA')}
                  className={`p-3 border-2 rounded-lg flex items-center justify-center gap-2 transition-all ${estadoVenta === 'REGISTRADA'
                    ? 'border-orange-600 bg-orange-50 text-orange-600 font-medium'
                    : 'border-gray-200 hover:border-orange-300 text-gray-700'
                    }`}
                >
                  <Clock className="w-4 h-4" />
                  Registrada
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {estadoVenta === 'PAGADA'
                  ? 'La venta se marcará como pagada y completada.'
                  : 'La venta se registrará como pendiente de pago.'
                }
              </p>
            </div>

            {/* Referencia de pago (opcional) */}
            {estadoVenta === 'PAGADA' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Motivo (Opcional)
                </label>
                <input
                  type="text"
                  value={referenciaPago}
                  onChange={(e) => setReferenciaPago(e.target.value)}
                  placeholder="Número de transacción, etc."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}

            {/* Resumen */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>

              {descuentoTotal > 0 && (
                <>
                  <div className="flex justify-between items-center text-green-600">
                    <span>Descuentos:</span>
                    <span className="font-semibold">-${descuentoTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-green-600">
                    <span>Ahorro total:</span>
                    <span>{((descuentoTotal / subtotal) * 100).toFixed(1)}%</span>
                  </div>
                </>
              )}

              <div className="flex justify-between items-center font-bold text-lg border-t pt-2">
                <span>Total:</span>
                <span className="text-blue-600">${totalFinal.toFixed(2)}</span>
              </div>
            </div>

            {/* Botón de confirmar venta */}
            <button
              onClick={handleCrearVenta}
              disabled={carrito.length === 0 || !clienteSeleccionado || !metodoPagoSeleccionado && estadoVenta === 'PAGADA' || creandoVenta}
              className={`w-full py-3 rounded-lg text-white transition-colors flex items-center justify-center gap-2 ${estadoVenta === 'PAGADA'
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-orange-600 hover:bg-orange-700'
                } disabled:bg-gray-400 disabled:cursor-not-allowed`}
            >
              {creandoVenta ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  {estadoVenta === 'PAGADA' ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <Clock className="w-5 h-5" />
                  )}
                  {estadoVenta === 'PAGADA' ? 'Confirmar Venta' : 'Registrar Venta'} (${totalFinal.toFixed(2)})
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};