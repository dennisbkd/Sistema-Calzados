import { pasarelaFake } from "./pasarelaFake.js";

export class PagoServicio {
  constructor({ modeloTransaccion, modeloMetodoPago, modeloCompra, modeloVenta }) {
    this.modeloTransaccion = modeloTransaccion;
    this.modeloMetodoPago = modeloMetodoPago;
    this.modeloCompra = modeloCompra;
    this.modeloVenta = modeloVenta;
  }

  async registrarPago(data, adminId) {
    const { tipoTransaccion, idReferencia, metodoPagoId, monto, referencia } = data;

    if (!tipoTransaccion || !idReferencia || !metodoPagoId || !monto) {
      throw new Error("Datos incompletos");
    }

    // ✅ Validar método de pago existe
    const metodo = await this.modeloMetodoPago.findByPk(metodoPagoId);
    if (!metodo) throw new Error("Método de pago inválido");

    // ✅ Validar transacción (Compra o Venta)
    if (tipoTransaccion === "COMPRA") {
      const compra = await this.modeloCompra.findByPk(idReferencia);
      if (!compra) throw new Error("Compra no encontrada");
    }

    if (tipoTransaccion === "VENTA") {
      const venta = await this.modeloVenta.findByPk(idReferencia);
      if (!venta) throw new Error("Venta no encontrada");
    }

    // 🟦 Determinar tipo de pasarela
    let comprobante = referencia;

    if (metodo.nombre.toUpperCase() === "FAKE" || metodo.nombre.toUpperCase() === "EFECTIVO") {
      // 🟨 Pago simulado (Fake o Efectivo)
      const resultado = await pasarelaFake.procesarPago(monto, metodoPagoId, referencia);
      if (!resultado.success) throw new Error("Pago rechazado por pasarela");
      comprobante = resultado.comprobante;
    } else if (metodo.nombre.toUpperCase() === "STRIPE") {
      // 🟩 Pago real con Stripe ya confirmado en el frontend
      // (Aquí no procesamos, solo registramos la referencia del paymentIntent)
      if (!referencia) throw new Error("Referencia Stripe requerida");
    } else {
      throw new Error(`Método de pago no soportado: ${metodo.nombre}`);
    }

    // ✅ Guardar transacción en la base de datos
    const nuevaTransaccion = await this.modeloTransaccion.create({
      tipoTransaccion,
      compraId: tipoTransaccion === "COMPRA" ? idReferencia : null,
      ventaId: tipoTransaccion === "VENTA" ? idReferencia : null,
      metodoPagoId,
      monto,
      referencia: comprobante,
      usuarioId: adminId || null
    });

    return {
      message: "Pago registrado exitosamente",
      comprobante: comprobante,
      id: nuevaTransaccion.id
    };
  }
}
