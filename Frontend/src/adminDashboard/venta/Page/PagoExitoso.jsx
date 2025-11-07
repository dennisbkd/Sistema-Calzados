
import { useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router';
import { CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

export const PagoExitoso = () => {
  const { id } = useParams(); // ID de la venta
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    console.log('Pago exitoso - Venta ID:', id);
    console.log('Session ID:', sessionId);

  }, [id, sessionId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
      >
        {/* Icono de éxito */}
        <div className="mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
        </div>

        {/* Mensaje de éxito */}
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          ¡Pago Exitoso!
        </h1>

        <p className="text-gray-600 mb-2">
          Tu pago ha sido procesado correctamente.
        </p>

        <p className="text-sm text-gray-500 mb-6">
          Número de venta: <span className="font-mono font-medium">#{id}</span>
        </p>

        {/* Información adicional */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="text-sm text-gray-600">
            <p>• Recibirás un correo de confirmación</p>
            <p>• El pedido será procesado shortly</p>
            <p>• Número de transacción: {sessionId?.substring(0, 10)}...</p>
          </div>
        </div>

        <p className="text-xs text-gray-400 mt-6">
          Si tienes alguna pregunta, contacta a nuestro soporte.
        </p>
      </motion.div>
    </div>
  );
};