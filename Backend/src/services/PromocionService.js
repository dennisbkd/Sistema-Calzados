import { Promocion } from '../models/promocion.js';
import { Op } from 'sequelize';

export class PromocionService {
  async crearPromocion(datos) {
    // Validar fechas
    if (datos.fechaFin < datos.fechaInicio) {
      throw new Error('La fecha de fin no puede ser anterior a la fecha de inicio');
    }

    // Normalizar/validar valorDescuento según tipo sin cambiar la BD
    const payload = { ...datos }
    const tipo = String(payload.tipo || '').toUpperCase()

    if (tipo === 'PORCENTAJE') {
      const v = Number(payload.valorDescuento)
      if (!Number.isFinite(v)) throw new Error('Ingrese un porcentaje válido')
      if (v <= 0 || v > 100) throw new Error('El porcentaje debe ser mayor a 0 y hasta 100')
      payload.valorDescuento = v
    } else if (tipo === 'MONTO_FIJO') {
      const v = Number(payload.valorDescuento)
      if (!Number.isFinite(v)) throw new Error('Ingrese un monto válido')
      if (v <= 0) throw new Error('El monto fijo debe ser mayor a 0')
      payload.valorDescuento = v
    } else if (tipo === '2X1' || tipo === '3X2') {
      // No se requiere valor; guardamos null para evitar confusiones
      payload.valorDescuento = null
    }

    return await Promocion.create(payload);
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
    // Aplicar la misma normalización que en crear
    const payload = { ...datos }
    if (payload.tipo) {
      const tipo = String(payload.tipo).toUpperCase()
      if (tipo === 'PORCENTAJE') {
        const v = Number(payload.valorDescuento)
        if (!Number.isFinite(v)) throw new Error('Ingrese un porcentaje válido')
        if (v <= 0 || v > 100) throw new Error('El porcentaje debe ser mayor a 0 y hasta 100')
        payload.valorDescuento = v
      } else if (tipo === 'MONTO_FIJO') {
        const v = Number(payload.valorDescuento)
        if (!Number.isFinite(v)) throw new Error('Ingrese un monto válido')
        if (v <= 0) throw new Error('El monto fijo debe ser mayor a 0')
        payload.valorDescuento = v
      } else if (tipo === '2X1' || tipo === '3X2') {
        payload.valorDescuento = null
      }
    }
    return await promocion.update(payload);
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
