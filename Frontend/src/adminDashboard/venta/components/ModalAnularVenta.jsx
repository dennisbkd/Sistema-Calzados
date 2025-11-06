// components/ModalAnularVenta.jsx
import { useState } from "react";
import { motion } from "motion/react";
import { X, AlertTriangle, RotateCcw } from "lucide-react";
import toast from "react-hot-toast";

export const ModalAnularVenta = ({ venta, isOpen, onClose, onConfirm, isLoading }) => {
  const [motivo, setMotivo] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!motivo.trim()) {
      toast.error('Por favor ingresa un motivo para la anulación');
      return;
    }
    onConfirm(motivo);
    setMotivo('');
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
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Anular Venta</h3>
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
          <div className="mb-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <RotateCcw className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">
                    Esta acción revertirá el stock
                  </p>
                  <p className="text-sm text-yellow-700 mt-1">
                    Al anular la venta, el stock de los productos será restaurado
                    automáticamente en el inventario.
                  </p>
                </div>
              </div>
            </div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Motivo de anulación *
            </label>
            <textarea
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Describe el motivo por el cual se anula esta venta..."
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
              required
            />
          </div>

          {/* Acciones */}
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading || !motivo.trim()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Anulando...
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4" />
                  Anular Venta
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};