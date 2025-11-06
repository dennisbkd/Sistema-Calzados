// pages/DetalleVenta.jsx (actualizado)
import { useState } from "react";
import { motion } from "motion/react";
import { useParams, useNavigate } from "react-router";
import {
  ArrowLeft,
  Download,
  Printer,
  Mail,
  FileText,
  User,
  CreditCard,
  Package,
  Calendar,
  DollarSign,
  Tag,
  CheckCircle,
  Clock,
  XCircle,
  BarChart3,
  ShoppingCart,
  Edit,
  Trash2,
  Ban
} from "lucide-react";
import { ModalPagarVenta } from "../components/ModalPagarVenta";
import { ModalAnularVenta } from "../components/ModalAnularVenta";
import toast from "react-hot-toast";
import { useAnularVenta, useMarcarComoPagada, useObtenerVenta } from "../hooks/useVentaQuery";


export const DetalleVenta = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('detalles');
  const [showModalAnular, setShowModalAnular] = useState(false);
  const [showModalPagar, setShowModalPagar] = useState(false);

  const { data: venta, isLoading, error } = useObtenerVenta(id);
  const { mutate: anularVenta, isPending: anulando } = useAnularVenta();
  const { mutate: marcarComoPagada, isPending: marcandoComoPagada } = useMarcarComoPagada();

  // Función para formatear fecha
  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Función para formatear moneda
  const formatearMoneda = (monto) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(monto);
  };

  // Obtener configuración del estado
  const getEstadoConfig = (estado) => {
    const config = {
      PAGADA: {
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: CheckCircle,
        label: 'Pagada'
      },
      REGISTRADA: {
        color: 'bg-orange-100 text-orange-800 border-orange-200',
        icon: Clock,
        label: 'Registrada'
      },
      ANULADA: {
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: XCircle,
        label: 'Anulada'
      }
    };
    return config[estado] || config.REGISTRADA;
  };

  // Manejar anulación de venta
  const handleAnularVenta = (motivo) => {
    const usuarioId = 1; // Esto debería venir del contexto de autenticación

    anularVenta({
      ventaId: id,
      motivo,
      usuarioId
    });
  };

  // Manejar marcar como pagada
  const handleMarcarComoPagada = (metodoPagoId, referenciaPago) => {
    marcarComoPagada({
      ventaId: id,
      metodoPagoId: parseInt(metodoPagoId),
      referenciaPago
    });
  };

  // Funciones de acción
  const handleImprimir = () => {
    toast.success('Funcionalidad de impresión en desarrollo');
  };

  const handleDescargar = () => {
    toast.success('Funcionalidad de descarga en desarrollo');
  };

  const handleEnviarEmail = () => {
    toast.success('Funcionalidad de email en desarrollo');
  };


  // Verificar si se pueden realizar acciones

  const puedeAnular = venta?.estado !== 'ANULADA' && venta?.estado !== 'PAGADA';
  const puedeMarcarComoPagada = venta?.estado === 'REGISTRADA';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">Cargando venta...</h2>
          <p className="text-gray-600">Obteniendo información detallada</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error al cargar la venta</h2>
          <p className="text-gray-600 mb-6">{error.message}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Volver
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!venta) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Venta no encontrada</h2>
          <p className="text-gray-600 mb-4">La venta solicitada no existe o fue eliminada</p>
          <button
            onClick={() => navigate('/ventas')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Volver a ventas
          </button>
        </div>
      </div>
    );
  }

  const estadoConfig = getEstadoConfig(venta.estado);
  const IconoEstado = estadoConfig.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Venta #{venta.nroFactura}
                </h1>
                <p className="text-gray-600">
                  Creada el {formatearFecha(venta.createdAt)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium border ${estadoConfig.color}`}>
                <IconoEstado className="w-4 h-4" />
                {estadoConfig.label}
              </span>

              <div className="flex gap-2">
                {puedeMarcarComoPagada && (
                  <button
                    onClick={() => setShowModalPagar(true)}
                    className="flex items-center gap-2 px-4 py-2 border border-green-300 text-green-700 rounded-lg hover:bg-green-50 transition-colors"
                  >
                    <CreditCard className="w-4 h-4" />
                    Pagar
                  </button>
                )}

                {puedeAnular && (
                  <button
                    onClick={() => setShowModalAnular(true)}
                    className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Ban className="w-4 h-4" />
                    Anular
                  </button>
                )}

                <button
                  onClick={handleImprimir}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  Imprimir
                </button>
                <button
                  onClick={handleDescargar}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Descargar
                </button>
                <button
                  onClick={handleEnviarEmail}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  Enviar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna izquierda - Información principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tarjetas de resumen */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Venta</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatearMoneda(parseFloat(venta.total))}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <DollarSign className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Productos</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {venta.detalles?.reduce((total, detalle) => total + detalle.cantidad, 0) || 0}
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <ShoppingCart className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Descuento</p>
                    <p className="text-2xl font-bold text-red-600">
                      -{formatearMoneda(parseFloat(venta.descuento))}
                    </p>
                  </div>
                  <div className="p-3 bg-red-100 rounded-lg">
                    <Tag className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Navegación de pestañas */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px">
                  {[
                    { id: 'detalles', label: 'Productos', icon: Package },
                    { id: 'pagos', label: 'Pagos', icon: CreditCard },
                    { id: 'movimientos', label: 'Inventario', icon: BarChart3 },
                    { id: 'cliente', label: 'Cliente', icon: User }
                  ].map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          }`}
                      >
                        <Icon className="w-4 h-4" />
                        {tab.label}
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="p-6">
                {/* Pestaña: Detalles de productos */}
                {activeTab === 'detalles' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Productos Vendidos ({venta.detalles?.length || 0})
                    </h3>
                    {venta.detalles?.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>No hay productos en esta venta</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {venta.detalles?.map((detalle) => (
                          <motion.div
                            key={detalle.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                          >
                            <div className="flex items-center gap-4 flex-1">
                              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                <Package className="w-6 h-6 text-gray-400" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900">
                                  {detalle.variante?.producto?.nombre}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {detalle.variante?.producto?.marca} - {detalle.variante?.producto?.modelo}
                                </p>
                                <div className="flex gap-4 mt-1">
                                  <span className="text-xs text-gray-500">
                                    Talla: {detalle.variante?.talla}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    Color: {detalle.variante?.color}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    Código: {detalle.variante?.codigo}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="text-right">
                              <p className="font-semibold text-gray-900">
                                {formatearMoneda(parseFloat(detalle.precioUnitario))} x {detalle.cantidad}
                              </p>
                              <p className="text-lg font-bold text-blue-600">
                                {formatearMoneda(parseFloat(detalle.subtotal))}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Pestaña: Pagos */}
                {activeTab === 'pagos' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Transacciones de Pago ({venta.pagos?.length || 0})
                    </h3>
                    {venta.pagos?.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <CreditCard className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>No hay registros de pago para esta venta</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {venta.pagos?.map((pago) => (
                          <div
                            key={pago.id}
                            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-green-100 rounded-lg">
                                <CreditCard className="w-5 h-5 text-green-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">
                                  Pago #{pago.id}
                                </p>
                                <p className="text-sm text-gray-600">
                                  Referencia: {pago.referencia}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {formatearFecha(pago.createdAt)}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-green-600">
                                {formatearMoneda(parseFloat(pago.monto))}
                              </p>
                              <p className="text-sm text-gray-600 capitalize">
                                {pago.tipoTransaccion?.toLowerCase()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Pestaña: Movimientos de inventario */}
                {activeTab === 'movimientos' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Movimientos de Inventario ({venta.movimientos?.length || 0})
                    </h3>
                    {venta.movimientos?.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <BarChart3 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>No hay movimientos de inventario registrados</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {venta.movimientos?.map((movimiento) => (
                          <div
                            key={movimiento.id}
                            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${movimiento.cantidad < 0
                                ? 'bg-red-100 text-red-600'
                                : 'bg-green-100 text-green-600'
                                }`}>
                                <BarChart3 className="w-5 h-5" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900 capitalize">
                                  {movimiento.tipoMovimiento?.toLowerCase().replace('_', ' ')}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {movimiento.motivo}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {formatearFecha(movimiento.createdAt)}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className={`text-lg font-bold ${movimiento.cantidad < 0 ? 'text-red-600' : 'text-green-600'
                                }`}>
                                {movimiento.cantidad > 0 ? '+' : ''}{movimiento.cantidad}
                              </p>
                              <p className="text-sm text-gray-600">
                                Variante ID: {movimiento.varianteId}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Pestaña: Información del cliente */}
                {activeTab === 'cliente' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Información del Cliente
                    </h3>
                    {venta.cliente ? (
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="p-3 bg-blue-100 rounded-lg">
                            <User className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="text-xl font-bold text-gray-900">
                              {venta.cliente.nombre}
                            </h4>
                            <p className="text-gray-600">{venta.cliente.contacto}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">Cédula de Identidad:</span>
                            <p className="text-gray-900">{venta.cliente.ci}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Cliente desde:</span>
                            <p className="text-gray-900">
                              {new Date(venta.cliente.createdAt).toLocaleDateString('es-ES')}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <User className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>No hay información del cliente disponible</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Columna derecha - Información de la venta */}
          <div className="space-y-6">
            {/* Resumen de la venta */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen de Venta</h3>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">{formatearMoneda(parseFloat(venta.subtotal))}</span>
                </div>

                <div className="flex justify-between text-red-600">
                  <span>Descuento:</span>
                  <span className="font-medium">-{formatearMoneda(parseFloat(venta.descuento))}</span>
                </div>

                <div className="border-t pt-3 flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span className="text-blue-600">{formatearMoneda(parseFloat(venta.total))}</span>
                </div>
              </div>
            </div>

            {/* Información general */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Información General</h3>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Fecha de creación</p>
                    <p className="text-gray-900">{formatearFecha(venta.createdAt)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Vendedor</p>
                    <p className="text-gray-900">{venta.usuario?.nombre || 'No especificado'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Número de factura</p>
                    <p className="text-gray-900 font-mono">{venta.nroFactura}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Promociones aplicadas */}
            {venta.promociones && venta.promociones.length > 0 && (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Promociones Aplicadas</h3>
                <div className="space-y-2">
                  {venta.promociones.map((promocion) => (
                    <div key={promocion.id} className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                      <Tag className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-800">{promocion.nombre}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modales */}
      <ModalAnularVenta
        isLoading={anulando}
        venta={venta}
        isOpen={showModalAnular}
        onClose={() => setShowModalAnular(false)}
        onConfirm={handleAnularVenta}
      />

      <ModalPagarVenta
        isLoading={marcandoComoPagada}
        venta={venta}
        isOpen={showModalPagar}
        onClose={() => setShowModalPagar(false)}
        onConfirm={handleMarcarComoPagada}
        formatearMoneda={formatearMoneda}
      />
    </div>
  );
};