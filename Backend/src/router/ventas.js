import express from 'express';
import { VentaController } from '../controller/ventaController.js';

const router = express.Router();
const ventaController = new VentaController();

router.get('/historial', ventaController.consultarHistorialVentas);

export default router;