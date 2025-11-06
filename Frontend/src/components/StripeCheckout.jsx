import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";

// Clave pública Stripe (modo test)
const stripePromise = loadStripe(
  "pk_test_51SPqTmE1l1HnzzMgwro5KmvittowtIFVJxcK9R048BBQI8pN2lnHFGH6wQTga7FKSlWcl76G8zrapTBao9XyVBFh00f07Nmub0"
);

export default function StripeCheckout({ total, ventaId }) {
  const [loading, setLoading] = useState(false);

  const pagar = async () => {
    try {
      setLoading(true);

      // 1️⃣ Crear intento de pago en backend (obtener clientSecret)
      const res = await axios.post("http://localhost:3000/pagos/stripe/crear-intento", {
        monto: total,
        descripcion: `Pago de venta #${ventaId}`,
      });

      const { clientSecret } = res.data;
      const stripe = await stripePromise;

      // 2️⃣ Confirmar pago con Stripe (tarjeta de prueba automática)
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: { token: "tok_visa" },
        },
      });

      if (result.error) {
        alert("❌ Error: " + result.error.message);
        return;
      }

      if (result.paymentIntent.status === "succeeded") {
        alert("✅ Pago exitoso");

        // 3️⃣ Registrar el pago en tu base de datos
        const registro = await axios.post("http://localhost:3000/pagos/registrar", {
          tipoTransaccion: "VENTA",
          idReferencia: ventaId,
          metodoPagoId: 4, // 4 = Stripe
          monto: result.paymentIntent.amount / 100,
          referencia: result.paymentIntent.id,
        });

        console.log("💾 Pago guardado:", registro.data);
        alert("💾 Pago registrado correctamente en la BD");
      }
    } catch (err) {
      console.error(err);
      alert("Error general: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={pagar}
      disabled={loading}
      className={`px-5 py-2 rounded-md text-white font-medium transition 
        ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
    >
      {loading ? "Procesando..." : `Pagar $${total}`}
    </button>
  );
}
