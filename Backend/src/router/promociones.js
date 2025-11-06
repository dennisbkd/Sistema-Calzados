import express from 'express';
import { PromocionController } from '../controller/promocionController.js';

const router = express.Router();
const promocionController = new PromocionController();

router.post('/', promocionController.crearPromocion);
router.get('/', promocionController.listarPromociones);
router.put('/:id', promocionController.editarPromocion);
router.delete('/:id', promocionController.eliminarPromocion);

export default router;