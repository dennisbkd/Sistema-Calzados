import { Router } from "express";
import { registrarPago, crearIntentoPagoStripe } from "../controller/pagos.controller.js";

export const rutaPagos = ({ pagoServicio }) => {
  const router = Router();

  // Middleware para pasar el servicio al controller
  router.use((req, res, next) => {
    req.pagoServicio = pagoServicio;
    next();
  });

  // Stripe
  router.post("/stripe/crear-intento", crearIntentoPagoStripe);

  // Registrar pago (fake o Stripe confirmado)
  router.post("/registrar", registrarPago);

  return router;
};
