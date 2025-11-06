import React, { useState } from "react";
import StripeCheckout from "../../../components/StripeCheckout";

export const GestionVentas = () => {
  const [venta, setVenta] = useState({
    id: 1, // ⚠️ ID de venta de prueba, luego será dinámico
    total: 50.0, // 💰 monto de ejemplo
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">🧾 Gestión de Ventas</h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="mb-3">Número de venta: <strong>{venta.id}</strong></p>
        <p className="mb-3">Total: <strong>${venta.total}</strong></p>

        <div className="mt-6 flex gap-4">
          <button
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            onClick={() => alert("Venta registrada (demo)")}
          >
            💾 Registrar Venta
          </button>

          {/* Aquí insertamos el botón real de Stripe */}
          <StripeCheckout total={venta.total} ventaId={venta.id} />
        </div>
      </div>
    </div>
  );
};
