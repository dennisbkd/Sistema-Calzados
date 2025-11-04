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

    // Validar método de pago existe
    const metodo = await this.modeloMetodoPago.findByPk(metodoPagoId);
    if (!metodo) throw new Error("Método de pago inválido");

    // Validar transacción depende si es compra o venta
    if (tipoTransaccion === "COMPRA") {
      const compra = await this.modeloCompra.findByPk(idReferencia);
      if (!compra) throw new Error("Compra no encontrada");
    }

    if (tipoTransaccion === "VENTA") {
      const venta = await this.modeloVenta.findByPk(idReferencia);
      if (!venta) throw new Error("Venta no encontrada");
    }

    // Simular pago externo
    const resultado = await pasarelaFake.procesarPago(monto, metodoPagoId, referencia);

    if (!resultado.success) throw new Error("Pago rechazado por pasarela");

    // Guardar pago
    await this.modeloTransaccion.create({
      tipoTransaccion,
      compraId: tipoTransaccion === "COMPRA" ? idReferencia : null,
      ventaId: tipoTransaccion === "VENTA" ? idReferencia : null,
      metodoPagoId,
      monto,
      referencia: resultado.comprobante
    });

    return {
      message: "Pago registrado exitosamente",
      comprobante: resultado.comprobante
    };
  }
}
