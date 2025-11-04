export const pasarelaFake = {
  procesarPago: async (monto, metodo, referencia) => {
    await new Promise((res) => setTimeout(res, 700));

    return {
      success: true,
      comprobante: `CPB-${Date.now()}`
    };
  }
};
