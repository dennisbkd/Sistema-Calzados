import { Promocion } from '../models/promocion.js';
import { Op } from 'sequelize';

export class PromocionService {
  async crearPromocion(datos) {
    // Validar fechas según caso de uso
    if (datos.fechaFin < datos.fechaInicio) {
      throw new Error('La fecha de fin no puede ser anterior a la fecha de inicio');
    }

    return await Promocion.create(datos);
  }

  async listarPromociones(filtros = {}) {
    const where = {}
    const { fechaInicio, fechaFin, tipo, alcance } = filtros

    if (fechaInicio && fechaFin) {
      where.fechaInicio = { [Op.lte]: fechaFin }
      where.fechaFin = { [Op.gte]: fechaInicio }
    }
    if (tipo) where.tipo = tipo

    if (alcance) {
      if (alcance === 'PRODUCTO') where.aplicaProducto = true
      if (alcance === 'CATEGORIA') where.aplicaCategoria = true
      if (alcance === 'GENERAL' || alcance === 'TEMPORADA') where.aplicaTodo = true
    }

    return await Promocion.findAll({
      where,
      order: [['createdAt', 'DESC']]
    });
  }

  async editarPromocion(id, datos) {
    const promocion = await Promocion.findByPk(id);
    if (!promocion) {
      throw new Error('Promoción no encontrada');
    }
    return await promocion.update(datos);
  }

  async eliminarPromocion(id) {
    const promocion = await Promocion.findByPk(id);
    if (!promocion) {
      throw new Error('Promoción no encontrada');
    }

    // Verificar si la promoción ha sido utilizada en ventas
    // Esta verificación requeriría una relación con Venta que no está mostrada en el modelo actual
    // Por ahora, simplemente intentamos eliminar
    return await promocion.destroy();
  }
}
