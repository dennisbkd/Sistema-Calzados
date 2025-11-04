import { Router } from "express";
import { registrarPago } from "../controller/pagos.controller.js";

export const rutaPagos = ({ pagoServicio }) => {
  const router = Router();

  router.post("/registrar", async (req, res) => {
    try {
      const adminId = req.usuario?.id; // viene del token
      const data = req.body;
      const resultado = await pagoServicio.registrarPago(data, adminId);
      res.json(resultado);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  return router;
};

