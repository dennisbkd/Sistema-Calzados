export const registrarPago = async (req, res, next) => {
  try {
    const adminId = req.usuario?.id;
    const resultado = await req.pagoServicio.registrarPago(req.body, adminId);
    res.json(resultado);
  } catch (error) {
    next(error);
  }
};
