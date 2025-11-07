// components/ModalQR.jsx
import { motion } from "motion/react";
import { X, QrCode, Download, Copy } from "lucide-react";
import { QRCodeSVG } from 'qrcode.react';
import toast from "react-hot-toast";

export const ModalQR = ({ urlPago, isOpen, onClose, venta }) => {


  const handleCopiarLink = async () => {
    try {
      await navigator.clipboard.writeText(urlPago);
      toast.success('Link copiado al portapapeles');

    } catch (error) {
      console.error('Error al copiar el link:', error);
      toast.error('Error al copiar el link');
    }
  };

  const handleDescargarQR = () => {
    const canvas = document.getElementById("qr-code");
    if (canvas) {
      const pngUrl = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `pago-${venta.nroFactura}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      toast.success('QR descargado');
    }
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
            <div className="p-2 bg-blue-100 rounded-lg">
              <QrCode className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Código QR de Pago</h3>
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
        <div className="p-6">
          {/* QR Code */}
          <div className="flex justify-center mb-6">
            <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
              <QRCodeSVG
                id="qr-code"
                value={urlPago}
                size={200}
                level="H"
                fgColor="#1f2937"
                bgColor="#ffffff"
              />
            </div>
          </div>

          {/* Información */}
          <div className="text-center mb-6">
            <p className="text-sm text-gray-600 mb-2">
              Escanee este código QR para realizar el pago
            </p>
            <p className="text-lg font-semibold text-gray-900">
              Total: Bs {parseFloat(venta.total).toFixed(2)}
            </p>
          </div>

          {/* URL para copiar */}
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-gray-700">Link de pago:</span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={urlPago}
                readOnly
                className="flex-1 p-2 text-xs border border-gray-300 rounded bg-white truncate"
              />
              <button
                onClick={handleCopiarLink}
                className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                title="Copiar link"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex gap-3">
            <button
              onClick={handleDescargarQR}
              className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              Descargar QR
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};