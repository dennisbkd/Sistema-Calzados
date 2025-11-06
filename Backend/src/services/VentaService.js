import { Venta } from '../models/venta.js';
import { Op } from 'sequelize';

export class VentaService {
  async consultarHistorialVentas(filtros = {}) {
    const {
      fechaInicio,
      fechaFin,
      clienteId,
      empleadoId,
      estado,
      ventaId,
      clienteNombre,
      empleadoNombre
    } = filtros;

    const where = {};

    if (fechaInicio && fechaFin) {
      // Normaliza a rango de día completo sobre createdAt
      const inicio = new Date(`${fechaInicio}T00:00:00.000`)
      const fin = new Date(`${fechaFin}T23:59:59.999`)
      where.createdAt = { [Op.between]: [inicio, fin] }
    }

    if (ventaId) {
      where.id = ventaId;
    }

    if (estado) {
      where.estado = estado;
    }

    if (clienteId) {
      where.clienteId = clienteId;
    }

    if (empleadoId) {
      where.usuarioId = empleadoId;
    }

    return await Venta.findAll({
      where,
      include: [
        { association: 'cliente', required: false },
        { association: 'usuario', required: false },
        { association: 'detalles', include: [{ association: 'variante', include: ['producto'] }] }
      ],
      order: [['createdAt', 'DESC']]
    });
  }
}
