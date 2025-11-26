// pages/DetalleVenta.jsx (completamente responsivo)
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
  Ban,
  MoreVertical,
  ChevronDown
} from "lucide-react";
import { ModalPagarVenta } from "../components/ModalPagarVenta";
import { ModalAnularVenta } from "../components/ModalAnularVenta";
import toast from "react-hot-toast";
import { useAnularVenta, useMarcarComoPagada, useObtenerVenta } from "../hooks/useVentaQuery";
import { generarPDFVenta } from "../utils/GenerarPdfVenta";

export const DetalleVenta = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('detalles');
  const [showModalAnular, setShowModalAnular] = useState(false);
  const [showModalPagar, setShowModalPagar] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const { data: venta, isLoading, error } = useObtenerVenta(id);
  const { mutate: anularVenta, isPending: anulando } = useAnularVenta();
  const { mutate: marcarComoPagada, isPending: marcandoComoPagada } = useMarcarComoPagada();
  console.log('Venta cargada:', venta);

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
    if (!venta) {
      toast.error('No hay datos de venta para descargar');
      return;
    }

    if (!venta.detalles || venta.detalles.length === 0) {
      toast.error('La venta no tiene productos para generar el PDF');
      return;
    }
    generarPDFVenta(venta, "descargar");
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error al cargar la venta</h2>
          <p className="text-gray-600 mb-6">{error.message}</p>
          <div className="flex gap-3 justify-center flex-wrap">
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                  Venta #{venta.nroFactura}
                </h1>
                <p className="text-gray-600 text-sm sm:text-base truncate">
                  Creada el {formatearFecha(venta.createdAt)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <span className={`inline-flex items-center gap-2 px-3 py-1 sm:py-2 rounded-full text-sm font-medium border ${estadoConfig.color}`}>
                <IconoEstado className="w-3 h-3 sm:w-4 sm:h-4" />
                {estadoConfig.label}
              </span>

              {/* Menú móvil */}
              <div className="sm:hidden">
                <button
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              {/* Botones de acción - Desktop */}
              <div className="hidden sm:flex gap-2">
                {puedeMarcarComoPagada && (
                  <button
                    onClick={() => setShowModalPagar(true)}
                    className="flex items-center gap-2 px-3 py-2 border border-green-300 text-green-700 rounded-lg hover:bg-green-50 transition-colors text-sm"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span className="hidden sm:inline">Pagar</span>
                  </button>
                )}

                {puedeAnular && (
                  <button
                    onClick={() => setShowModalAnular(true)}
                    className="flex items-center gap-2 px-3 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors text-sm"
                  >
                    <Ban className="w-4 h-4" />
                    <span className="hidden sm:inline">Anular</span>
                  </button>
                )}

                <button
                  onClick={handleImprimir}
                  className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  <Printer className="w-4 h-4" />
                  <span className="hidden sm:inline">Imprimir</span>
                </button>
                <button
                  onClick={handleDescargar}
                  className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Descargar</span>
                </button>
                <button
                  onClick={handleEnviarEmail}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <Mail className="w-4 h-4" />
                  <span className="hidden sm:inline">Enviar</span>
                </button>
              </div>
            </div>
          </div>

          {/* Menú móvil desplegable */}
          {showMobileMenu && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="sm:hidden mt-4 border-t border-gray-200 pt-4"
            >
              <div className="grid grid-cols-2 gap-2">
                {puedeMarcarComoPagada && (
                  <button
                    onClick={() => {
                      setShowModalPagar(true);
                      setShowMobileMenu(false);
                    }}
                    className="flex items-center justify-center gap-2 px-3 py-2 border border-green-300 text-green-700 rounded-lg hover:bg-green-50 transition-colors text-sm"
                  >
                    <CreditCard className="w-4 h-4" />
                    Pagar
                  </button>
                )}

                {puedeAnular && (
                  <button
                    onClick={() => {
                      setShowModalAnular(true);
                      setShowMobileMenu(false);
                    }}
                    className="flex items-center justify-center gap-2 px-3 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors text-sm"
                  >
                    <Ban className="w-4 h-4" />
                    Anular
                  </button>
                )}

                <button
                  onClick={handleImprimir}
                  className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  <Printer className="w-4 h-4" />
                  Imprimir
                </button>
                <button
                  onClick={handleDescargar}
                  className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  <Download className="w-4 h-4" />
                  Descargar
                </button>
                <button
                  onClick={handleEnviarEmail}
                  className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm col-span-2"
                >
                  <Mail className="w-4 h-4" />
                  Enviar Email
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
          {/* Columna izquierda - Información principal */}
          <div className="xl:col-span-2 space-y-4 sm:space-y-6">
            {/* Tarjetas de resumen */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Venta</p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">
                      {formatearMoneda(parseFloat(venta.total))}
                    </p>
                  </div>
                  <div className="p-2 sm:p-3 bg-blue-100 rounded-lg">
                    <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Productos</p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">
                      {venta.detalles?.reduce((total, detalle) => total + detalle.cantidad, 0) || 0}
                    </p>
                  </div>
                  <div className="p-2 sm:p-3 bg-green-100 rounded-lg">
                    <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Descuento</p>
                    <p className="text-xl sm:text-2xl font-bold text-red-600">
                      -{formatearMoneda(parseFloat(venta.descuento))}
                    </p>
                  </div>
                  <div className="p-2 sm:p-3 bg-red-100 rounded-lg">
                    <Tag className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Navegación de pestañas */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="border-b border-gray-200">
                <nav className="flex overflow-x-auto -mb-px scrollbar-hide">
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
                        className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm transition-colors whitespace-nowrap flex-shrink-0 ${activeTab === tab.id
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

              <div className="p-4 sm:p-6">
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
                      <div className="space-y-3">
                        {venta.detalles?.map((detalle) => (
                          <motion.div
                            key={detalle.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border border-gray-200 rounded-lg gap-3"
                          >
                            <div className="flex items-start gap-3 flex-1 min-w-0">
                              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Package className="w-5 h-5 text-gray-400" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <h4 className="font-medium text-gray-900 truncate">
                                  {detalle.variante?.producto?.nombre}
                                </h4>
                                <p className="text-sm text-gray-600 truncate">
                                  {detalle.variante?.producto?.marca} - {detalle.variante?.producto?.modelo}
                                </p>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                    Talla: {detalle.variante?.talla}
                                  </span>
                                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                    Color: {detalle.variante?.color}
                                  </span>
                                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                    Código: {detalle.variante?.codigo}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="text-right sm:text-left sm:min-w-[120px]">
                              <p className="font-semibold text-gray-900 text-sm sm:text-base">
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
                            className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border border-gray-200 rounded-lg gap-3"
                          >
                            <div className="flex items-center gap-3 flex-1">
                              <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
                                <CreditCard className="w-5 h-5 text-green-600" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="font-medium text-gray-900 truncate">
                                  Pago #{pago.id}
                                </p>
                                <p className="text-sm text-gray-600 truncate">
                                  Referencia: {pago.referencia}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {formatearFecha(pago.createdAt)}
                                </p>
                              </div>
                            </div>
                            <div className="text-right sm:text-left sm:min-w-[120px]">
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
                            className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border border-gray-200 rounded-lg gap-3"
                          >
                            <div className="flex items-center gap-3 flex-1">
                              <div className={`p-2 rounded-lg flex-shrink-0 ${movimiento.cantidad < 0
                                  ? 'bg-red-100 text-red-600'
                                  : 'bg-green-100 text-green-600'
                                }`}>
                                <BarChart3 className="w-5 h-5" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="font-medium text-gray-900 capitalize truncate">
                                  {movimiento.tipoMovimiento?.toLowerCase().replace('_', ' ')}
                                </p>
                                <p className="text-sm text-gray-600 truncate">
                                  {movimiento.motivo}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {formatearFecha(movimiento.createdAt)}
                                </p>
                              </div>
                            </div>
                            <div className="text-right sm:text-left sm:min-w-[100px]">
                              <p className={`text-lg font-bold ${movimiento.cantidad < 0 ? 'text-red-600' : 'text-green-600'
                                }`}>
                                {movimiento.cantidad > 0 ? '+' : ''}{movimiento.cantidad}
                              </p>
                              <p className="text-sm text-gray-600 truncate">
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
                      <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
                        <div className="flex items-center gap-3 sm:gap-4 mb-4">
                          <div className="p-2 sm:p-3 bg-blue-100 rounded-lg flex-shrink-0">
                            <User className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                              {venta.cliente.nombre}
                            </h4>
                            <p className="text-gray-600 truncate">{venta.cliente.contacto}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
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
          <div className="space-y-4 sm:space-y-6">
            {/* Resumen de la venta */}
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
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
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Información General</h3>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-700">Fecha de creación</p>
                    <p className="text-gray-900 text-sm truncate">{formatearFecha(venta.createdAt)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-700">Vendedor</p>
                    <p className="text-gray-900 truncate">{venta.usuario?.nombre || 'No especificado'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-700">Número de factura</p>
                    <p className="text-gray-900 font-mono truncate">{venta.nroFactura}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Promociones aplicadas */}
            {venta.promociones && venta.promociones.length > 0 && (
              <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Promociones Aplicadas</h3>
                <div className="space-y-2">
                  {venta.promociones.map((promocion) => (
                    <div key={promocion.id} className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                      <Tag className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span className="text-sm text-green-800 truncate">{promocion.nombre}</span>
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