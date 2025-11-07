// components/ModalPagarVenta.jsx - VERSIÓN MEJORADA
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  X,
  CreditCard,
  CheckCircle,
  Mail,
  Link,
  QrCode,
  DollarSign,
  Copy,
  Check
} from "lucide-react";
import toast from "react-hot-toast";
import { useMetodosPago, useStripePago, useVerificarPagoStripe } from "../hooks/useVentaQuery";
import { QueryClient } from "@tanstack/react-query";
import { ModalQR } from "./ModalQR";

export const ModalPagarVenta = ({
  venta,
  isOpen,
  onClose,
  onConfirm,
  formatearMoneda,
  isLoading
}) => {
  const [metodoPago, setMetodoPago] = useState('tradicional'); // 'tradicional' o 'stripe'
  const [showQR, setShowQR] = useState(false);
  const [metodoPagoId, setMetodoPagoId] = useState('');
  const [referenciaPago, setReferenciaPago] = useState('');
  const [urlPago, setUrlPago] = useState('');
  const [copiado, setCopiado] = useState(false);
  const [emailEnviado, setEmailEnviado] = useState(false);

  const { data: metodosPago = [], isLoading: loadingMetodosPago } = useMetodosPago();

  // Mutations y queries para Stripe
  const {
    mutate: crearSessionStripe,
    isPending: creandoSession,
    data: sessionData
  } = useStripePago();

  const { data: estadoPago } = useVerificarPagoStripe(
    metodoPago === 'stripe' && venta?.id ? venta.id : null
  );


  // Efecto para manejar la creación de session
  useEffect(() => {
    if (sessionData && metodoPago === 'stripe') {
      setUrlPago(sessionData.urlPago);
    }
  }, [sessionData, metodoPago]);

  // Efecto para verificar si el pago se completó
  useEffect(() => {
    if (estadoPago?.estado === 'pagado') {
      toast.success('¡Pago completado exitosamente!');
      window.location.reload();
      onClose();
      // Aquí podrías recargar los datos de la venta
    }
  }, [estadoPago, onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (metodoPago === 'tradicional') {
      if (!metodoPagoId) {
        toast.error('Por favor selecciona un método de pago');
        return;
      }
      onConfirm(metodoPagoId, referenciaPago);
      setMetodoPagoId('');
      setReferenciaPago('');
      onClose();
    } else {
      // Stripe - Crear session
      crearSessionStripe({ ventaId: venta.id });
    }
  };

  const handleCopiarLink = async () => {
    if (urlPago) {
      try {
        await navigator.clipboard.writeText(urlPago);
        setCopiado(true);
        toast.success('Link copiado al portapapeles');
        setTimeout(() => setCopiado(false), 2000);
      } catch (error) {
        console.error('Error al copiar el link:', error);
        toast.error('Error al copiar el link');
      }
    }
  };

  const handleEnviarEmail = () => {
    // Aquí integrarías tu servicio de email
    // Por ahora simulamos el envío
    setEmailEnviado(true);
    toast.success('Link de pago enviado al cliente por email');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CreditCard className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Procesar Pago</h3>
              <p className="text-sm text-gray-600">#{venta.nroFactura}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Selección de método de pago */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Tipo de Pago
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setMetodoPago('tradicional')}
                  className={`p-4 border-2 rounded-lg text-center transition-all ${metodoPago === 'tradicional'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                >
                  <DollarSign className="w-6 h-6 mx-auto mb-2" />
                  <span className="text-sm font-medium">Pago Directo</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMetodoPago('stripe')}
                  className={`p-4 border-2 rounded-lg text-center transition-all ${metodoPago === 'stripe'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                >
                  <CreditCard className="w-6 h-6 mx-auto mb-2" />
                  <span className="text-sm font-medium">Tarjeta (Stripe)</span>
                </button>
              </div>
            </div>

            {/* Contenido dinámico según método */}
            {metodoPago === 'tradicional' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Método de Pago *
                  </label>
                  <select
                    value={metodoPagoId}
                    onChange={(e) => setMetodoPagoId(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    required
                  >
                    <option value="">Seleccionar método de pago...</option>
                    {loadingMetodosPago ? (
                      <option disabled>Cargando métodos de pago...</option>
                    ) : (metodosPago?.map((metodo) => (
                      <option key={metodo.id} value={metodo.id}>
                        {metodo.nombre}
                      </option>
                    )))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Referencia de Pago (Opcional)
                  </label>
                  <input
                    type="text"
                    value={referenciaPago}
                    onChange={(e) => setReferenciaPago(e.target.value)}
                    placeholder="Número de transacción, referencia, etc."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>
            )}

            {metodoPago === 'stripe' && (
              <div className="space-y-4">
                {!urlPago ? (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <CreditCard className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-blue-800">
                          Pago con Tarjeta
                        </p>
                        <p className="text-sm text-blue-700 mt-1">
                          Genera un link seguro para que el cliente pague con tarjeta.
                          El sistema se actualizará automáticamente cuando se complete el pago.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-green-800">
                            Link de pago generado
                          </p>
                          <p className="text-sm text-green-700 mt-1">
                            Comparte este link con el cliente para que complete el pago.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* URL de pago */}
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Link className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">Link de pago:</span>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={urlPago}
                          readOnly
                          className="flex-1 p-2 text-sm border border-gray-300 rounded bg-white truncate"
                        />
                        <button
                          type="button"
                          onClick={handleCopiarLink}
                          className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                          title="Copiar link"
                        >
                          {copiado ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Acciones para compartir */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={handleEnviarEmail}
                        disabled={emailEnviado}
                        className="flex items-center justify-center gap-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:bg-green-50 disabled:border-green-200 transition-colors"
                      >
                        <Mail className="w-4 h-4" />
                        {emailEnviado ? 'Enviado' : 'Enviar Email'}
                      </button>
                      {urlPago && (
                        <button
                          type="button"
                          onClick={() => setShowQR(true)}
                          className="flex items-center justify-center gap-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <QrCode className="w-4 h-4" />
                          Generar QR
                        </button>
                      )}
                    </div>

                    {/* Estado del pago */}
                    {estadoPago && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <p className="text-sm text-yellow-800 text-center">
                          {estadoPago.estado === 'pagado'
                            ? '✅ Pago completado'
                            : '⏳ Esperando pago del cliente...'
                          }
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Resumen del total */}
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-700">Total a pagar</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatearMoneda(parseFloat(venta.total))}
              </p>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex gap-3 justify-end mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {urlPago ? 'Cerrar' : 'Cancelar'}
            </button>

            {metodoPago === 'tradicional' ? (
              <button
                type="submit"
                disabled={isLoading || !metodoPagoId}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Confirmar Pago
                  </>
                )}
              </button>
            ) : (
              !urlPago && (
                <button
                  type="submit"
                  disabled={creandoSession}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {creandoSession ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Generando...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      Generar Link de Pago
                    </>
                  )}
                </button>
              )
            )}
          </div>
        </form>
      </motion.div>
      <ModalQR
        urlPago={urlPago}
        isOpen={showQR}
        onClose={() => setShowQR(false)}
        venta={venta}
      />
    </div>

  );
};