import { StripeService } from "../services/paquete-G-Pago/stripe.service.js";
import { Mailer } from "../utils/email.js";

const stripeService = new StripeService();

// 🧩 Instancia del mailer usando tus variables del .env
const mailer = new Mailer({
  host: "smtp.gmail.com",
  port: 465,
  user: process.env.MAIL_USER,
  pass: process.env.MAIL_PASS,
});

// ✅ 1️⃣ CREAR INTENTO DE PAGO CON STRIPE
export const crearIntentoPagoStripe = async (req, res) => {
  try {
    console.log("📦 Datos recibidos del frontend:", req.body);

    const { monto, descripcion } = req.body;

    if (!monto || isNaN(monto)) {
      console.warn("⚠️ Monto inválido o no recibido");
      return res.status(400).json({ error: "Monto requerido o inválido" });
    }

    const resultado = await stripeService.crearPagoStripe({
      monto,
      descripcion: descripcion || "Pago en Calzados Store",
    });

    console.log("💳 Resultado Stripe:", resultado);

    if (!resultado.success) {
      console.error("❌ Error desde Stripe:", resultado.error);
      return res.status(400).json({ error: resultado.error });
    }

    return res.json({
      message: "✅ Intento de pago creado correctamente",
      clientSecret: resultado.clientSecret,
    });
  } catch (error) {
    console.error("🔥 Error general al crear intento de pago Stripe:", error);
    return res.status(500).json({
      error: "Error al crear intento de pago Stripe",
      detalle: error.message,
    });
  }
};

// ✅ 2️⃣ REGISTRAR PAGO EN BD + ENVIAR CORREO
export const registrarPago = async (req, res, next) => {
  try {
    // ⚙️ En pruebas, usamos adminId = 1 (sin login)
    const adminId = 1;

    console.log("💾 Datos recibidos para registrar pago:", req.body);

    const resultado = await req.pagoServicio.registrarPago(req.body, adminId);

    // Si la BD guardó correctamente el pago
    const { tipoTransaccion, monto, referencia } = req.body;

    // 📨 correo de destino (puedes usar tu correo de prueba)
    const destinatario = "calzadosalpaso533@gmail.com";

    // ✉️ Plantilla HTML del comprobante
    const html = `
      <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 20px; border-radius: 8px;">
        <h2 style="color:#1E3A8A;">💳 Comprobante de Pago</h2>
        <p>Gracias por su compra en <strong>Calzados al Paso</strong>.</p>
        <p><strong>Tipo de transacción:</strong> ${tipoTransaccion}</p>
        <p><strong>Monto pagado:</strong> $${monto}</p>
        <p><strong>Referencia Stripe:</strong> ${referencia}</p>
        <p style="margin-top: 20px;">Fecha: ${new Date().toLocaleString()}</p>
        <hr />
        <p style="font-size: 12px; color: #555;">Este comprobante fue generado automáticamente por el sistema.</p>
      </div>
    `;

    // 🧩 Enviar correo
    await mailer.enviar({
      to: destinatario,
      subject: "✅ Comprobante de pago - Calzados al Paso",
      html,
    });

    console.log("📧 Correo enviado correctamente al cliente:", destinatario);

    // 🔁 Respuesta al frontend
    return res.json({
      message: "Pago registrado y correo enviado correctamente",
      data: resultado,
    });

  } catch (error) {
    console.error("❌ Error al registrar pago o enviar correo:", error);
    return res.status(500).json({
      error: "Error al registrar pago o enviar correo",
      detalle: error.message,
    });
  }
};
