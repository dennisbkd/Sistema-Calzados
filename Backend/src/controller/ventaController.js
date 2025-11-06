import { VentaService } from '../services/VentaService.js';

const ventaService = new VentaService();

export class VentaController {
  async consultarHistorialVentas(req, res) {
    try {
      const { fechaInicio, fechaFin, clienteId, empleadoId, estado, ventaId, clienteNombre, empleadoNombre } = req.query;

      const filtros = {
        fechaInicio,
        fechaFin,
        clienteId: clienteId ? parseInt(clienteId) : undefined,
        empleadoId: empleadoId ? parseInt(empleadoId) : undefined,
        estado,
        ventaId: ventaId ? parseInt(ventaId) : undefined,
        clienteNombre,
        empleadoNombre
      };

      const ventas = await ventaService.consultarHistorialVentas(filtros);
      // Devolver 200 con lista (vacía si no hay resultados)
      res.json(ventas);
    } catch (error) {
      res.status(500).json({ mensaje: error.message });
    }
  }
}
