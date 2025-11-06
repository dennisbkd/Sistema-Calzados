// src/components/ventas/ProductosCategoria.jsx

import { motion } from 'motion/react';
import {
  Package,
  Tag,
  Zap,
  Shirt,
  Plus,
  AlertTriangle
} from 'lucide-react';
import { ErrorMessage } from '../../../global/components/ErrorMessage';

const CardCategoriaProducto = ({
  productos = [],
  terminoBusqueda = '',
  onAgregarProducto,
  isLoading,
  error
}) => {


  // Función para calcular precio con descuento
  const calcularPrecioConDescuento = (precio, promocion) => {
    if (!promocion) return precio;

    switch (promocion.tipo) {
      case 'PORCENTAJE':
        return precio * (1 - parseFloat(promocion.valorDescuento) / 100);
      case 'MONTO_FIJO':
        return precio - parseFloat(promocion.valorDescuento);
      case '2X1':
        return precio; // El descuento se aplica en el cálculo total
      case '3X2':
        return precio; // El descuento se aplica en el cálculo total
      default:
        return precio;
    }
  };

  // Función para obtener la promoción activa de una variante
  const obtenerPromocionVariante = (producto) => {
    // Buscar promociones activas para este producto
    const promocionesActivas = producto.promociones.filter(promo =>
      promo.activa &&
      new Date(promo.fechaInicio) <= new Date() &&
      new Date(promo.fechaFin) >= new Date()
    );

    // Si hay promociones que aplican al producto completo
    if (promocionesActivas.length > 0) {
      return promocionesActivas[0];
    }

    return null;
  };

  // Filtrar productos según búsqueda
  const productosFiltrados = productos.filter(producto => {
    if (!terminoBusqueda) return true;

    const busqueda = terminoBusqueda.toLowerCase();
    return (
      producto.nombre.toLowerCase().includes(busqueda) ||
      producto.marca.toLowerCase().includes(busqueda) ||
      producto.modelo.toLowerCase().includes(busqueda) ||
      producto.variantes.some(v =>
        v.color.toLowerCase().includes(busqueda) ||
        v.talla.toString().includes(busqueda)
      )
    );
  });
  console.log('Productos filtrados:', productosFiltrados);
  // Obtener nombre de la categoría del primer producto (si existe)
  const nombreCategoria = productosFiltrados[0]?.categoria?.nombre || 'Categoría';

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
      >
        <div className="text-center text-gray-500">Cargando productos...</div>
      </motion.div>
    );
  }
  if (error) {
    return (
      <ErrorMessage mensaje='Hubo un error al encontrar los productos de esta categoria' />
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Productos - {nombreCategoria}</h3>
          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm">
            {productosFiltrados.length} productos
          </span>
        </div>

        {terminoBusqueda && (
          <div className="text-sm text-gray-500">
            Resultados para: "{terminoBusqueda}"
          </div>
        )}
      </div>

      {productosFiltrados.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 text-gray-500"
        >
          <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium mb-2">No se encontraron productos</p>
          <p className="text-sm">
            {terminoBusqueda
              ? 'Intenta con otros términos de búsqueda'
              : 'No hay productos en esta categoría'
            }
          </p>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {productosFiltrados.map((producto, index) => {
            const tienePromocionesActivas = producto.promociones.some(promo =>
              promo.activa &&
              new Date(promo.fechaInicio) <= new Date() &&
              new Date(promo.fechaFin) >= new Date()
            );

            return (
              <motion.div
                key={producto.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border-b border-gray-200 pb-6 last:border-b-0"
              >
                {/* Header del Producto */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 text-lg">
                      {producto.nombre}
                    </h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm text-gray-600">
                        {producto.marca} - {producto.modelo}
                      </span>

                      {/* Categoría */}
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${producto.categoria.nombre === 'Deportivos'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                        }`}>
                        {producto.categoria.nombre === 'Deportivos' ? (
                          <Zap className="w-3 h-3" />
                        ) : (
                          <Shirt className="w-3 h-3" />
                        )}
                        {producto.categoria.nombre}
                      </span>

                      {/* Indicador de promociones activas */}
                      {tienePromocionesActivas && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
                          <Tag className="w-3 h-3" />
                          En oferta
                        </span>
                      )}
                    </div>

                    {/* Descripción */}
                    {producto.descripcion && (
                      <p className="text-sm text-gray-600 mt-2">
                        {producto.descripcion}
                      </p>
                    )}
                  </div>
                </div>

                {/* Variantes del Producto */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {producto.variantes
                    .map((variante) => {
                      const promocion = obtenerPromocionVariante(producto, variante);
                      const precioFinal = promocion
                        ? calcularPrecioConDescuento(parseFloat(variante.precioVenta), promocion)
                        : parseFloat(variante.precioVenta);

                      return (
                        <motion.div
                          key={variante.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${variante.stockActual === 0
                            ? 'opacity-50 cursor-not-allowed border-gray-200'
                            : 'border-gray-200 hover:border-blue-500 hover:shadow-md'
                            } ${promocion ? 'ring-2 ring-orange-200 ring-opacity-50' : ''}`}
                          // En la función onClick del producto:
                          onClick={() => variante.stockActual > 0 && onAgregarProducto({
                            varianteId: variante.id,
                            productoId: producto.id, // Asegúrate de enviar el productoId
                            nombre: producto.nombre,
                            talla: variante.talla,
                            color: variante.color,
                            precioUnitario: precioFinal, // Enviar el precio con descuento aplicado
                            precioOriginal: parseFloat(variante.precioVenta), // Precio original sin descuento
                            stockActual: variante.stockActual,
                            promocion: promocion
                          })}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <div className="font-semibold text-gray-900">
                                Talla {variante.talla}
                              </div>
                              <div className="text-sm text-gray-600 mt-1">
                                Color: {variante.color}
                              </div>
                              <div className="text-sm text-gray-600">
                                Código: {variante.codigo}
                              </div>
                              <div className={`text-sm mt-1 ${variante.stockActual <= variante.stockMinimo
                                ? 'text-orange-600 font-medium'
                                : variante.stockActual < 5
                                  ? 'text-yellow-600 font-medium'
                                  : 'text-gray-600'
                                }`}>
                                Stock: {variante.stockActual}
                                {variante.stockActual <= variante.stockMinimo && ' (Stock mínimo)'}
                                {variante.stockActual < 5 && variante.stockActual > variante.stockMinimo && ' (Bajo stock)'}
                              </div>
                            </div>

                            {/* Indicador de promoción */}
                            {promocion && (
                              <div className="bg-orange-100 p-1 rounded-lg">
                                <Tag className="w-4 h-4 text-orange-600" />
                              </div>
                            )}
                          </div>

                          {/* Precio y Información de Compra */}
                          <div className="flex items-end justify-between mt-3">
                            <div className="flex-1">
                              {promocion ? (
                                <div className="space-y-1">
                                  <div className="text-sm text-gray-500 line-through">
                                    ${parseFloat(variante.precioVenta).toFixed(2)}
                                  </div>
                                  <div className="font-bold text-green-600 text-lg">
                                    ${precioFinal.toFixed(2)}
                                  </div>
                                  <div className="text-xs text-orange-600 font-medium">
                                    {promocion.tipo === 'PORCENTAJE'
                                      ? `${promocion.valorDescuento}% OFF`
                                      : promocion.tipo === 'MONTO_FIJO'
                                        ? `$ ${promocion.valorDescuento} OFF`
                                        : promocion.tipo === '2X1'
                                          ? '2X1'
                                          : '3X2'
                                    }
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {promocion.nombre}
                                  </div>
                                </div>
                              ) : (
                                <div className="font-bold text-gray-900 text-lg">
                                  ${parseFloat(variante.precioVenta).toFixed(2)}
                                </div>
                              )}

                              {/* Precio de compra (solo para información) */}
                              <div className="text-xs text-gray-500 mt-1">
                                Costo: ${parseFloat(variante.precioCompra).toFixed(2)}
                              </div>
                            </div>

                            {/* Botón de agregar */}
                            <div className={`p-2 rounded-lg ${variante.stockActual > 0
                              ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                              : 'bg-gray-100 text-gray-400'
                              }`}>
                              <Plus className="w-4 h-4" />
                            </div>
                          </div>

                          {/* Alerta de stock mínimo */}
                          {variante.stockActual <= variante.stockMinimo && (
                            <div className="flex items-center gap-1 mt-2 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
                              <AlertTriangle className="w-3 h-3" />
                              Stock mínimo alcanzado
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                </div>

                {/* Información de promociones del producto */}
                {tienePromocionesActivas && (
                  <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Tag className="w-4 h-4 text-orange-600" />
                      <span className="text-sm font-medium text-orange-800">
                        Promociones activas:
                      </span>
                    </div>
                    <div className="space-y-1">
                      {producto.promociones
                        .filter(promo =>
                          promo.activa &&
                          new Date(promo.fechaInicio) <= new Date() &&
                          new Date(promo.fechaFin) >= new Date()
                        )
                        .map(promocion => (
                          <div key={promocion.id} className="text-xs text-orange-700">
                            • {promocion.nombre} - Válida hasta {new Date(promocion.fechaFin).toLocaleDateString()}
                          </div>
                        ))
                      }
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

export default CardCategoriaProducto;