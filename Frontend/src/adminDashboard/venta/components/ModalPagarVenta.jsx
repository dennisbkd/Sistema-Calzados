// components/ModalPagarVenta.jsx
import { useState } from "react";
import { motion } from "motion/react";
import { X, CreditCard, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useMetodosPago } from "../hooks/useVentaQuery";

export const ModalPagarVenta = ({ venta, isOpen, onClose, onConfirm, formatearMoneda, isLoading }) => {
  const [metodoPagoId, setMetodoPagoId] = useState('');
  const [referenciaPago, setReferenciaPago] = useState('');

  const { data: metodosPago = [], isLoading: loadingMetodosPago } = useMetodosPago();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!metodoPagoId) {
      toast.error('Por favor selecciona un método de pago');
      return;
    }
    onConfirm(metodoPagoId, referenciaPago);
    setMetodoPagoId('');
    setReferenciaPago('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-lg max-w-md w-full"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CreditCard className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Marcar como Pagada</h3>
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

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-blue-800">
                    Total a pagar: {formatearMoneda(parseFloat(venta.total))}
                  </p>
                  <p className="text-sm text-blue-700 mt-1">
                    Al marcar como pagada, se registrará la transacción de pago
                    y se completará el proceso de venta.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex gap-3 justify-end mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
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
                  Marcar como Pagada
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};