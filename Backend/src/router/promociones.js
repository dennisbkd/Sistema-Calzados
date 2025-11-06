import express from 'express';
import { PromocionController } from '../controller/paquete-G-Venta/gestion-Venta/promocionController.js';

const router = express.Router();
const promocionController = new PromocionController();

// Rutas REST simples
router.post('/', promocionController.crearPromocion);
router.get('/', promocionController.listarPromociones);
router.put('/:id', promocionController.editarPromocion);
router.delete('/:id', promocionController.eliminarPromocion);

// Alias siguiendo el patrón usado en el proyecto
router.post('/crear', promocionController.crearPromocion);
router.get('/listar', promocionController.listarPromociones);
router.patch('/editar/:id', (req, res) => promocionController.editarPromocion(req, res));
router.delete('/eliminar/:id', (req, res) => promocionController.eliminarPromocion(req, res));

export default router;
