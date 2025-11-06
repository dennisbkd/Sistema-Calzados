import { PromocionService } from '../services/PromocionService.js';

const promocionService = new PromocionService();

export class PromocionController {
  async crearPromocion(req, res) {
    try {
      const promocion = await promocionService.crearPromocion(req.body);
      res.status(201).json(promocion);
    } catch (error) {
      res.status(400).json({ mensaje: error.message });
    }
  }

  async listarPromociones(req, res) {
    try {
      const promociones = await promocionService.listarPromociones(req.query || {});
      res.json(promociones);
    } catch (error) {
      res.status(500).json({ mensaje: error.message });
    }
  }

  async editarPromocion(req, res) {
    try {
      const { id } = req.params;
      const promocion = await promocionService.editarPromocion(id, req.body);
      res.json(promocion);
    } catch (error) {
      res.status(400).json({ mensaje: error.message });
    }
  }

  async eliminarPromocion(req, res) {
    try {
      const { id } = req.params;
      await promocionService.eliminarPromocion(id);
      res.json({ mensaje: 'Promoción eliminada exitosamente' });
    } catch (error) {
      res.status(400).json({ mensaje: error.message });
    }
  }
}
