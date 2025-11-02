export class ReporteIngresoEgresoControlador {
  constructor ({ reporteIngresoEgresoServicio }) {
    this.reporteIngresoEgresoServicio = reporteIngresoEgresoServicio
  }

  // Reporte de ingresos vs egresos
  reporteIngresosEgresos = async (req, res) => {
    try {
      const { fechaInicio, fechaFin } = req.query
      if (!fechaInicio || !fechaFin) {
        return res.status(400).json({
          error: 'Los parámetros fechaInicio y fechaFin son requeridos'
        })
      }

      const resultado = await this.reporteIngresoEgresoServicio.reporteIngresosEgresos({
        fechaInicio,
        fechaFin
      })

      return res.status(200).json(resultado)
    } catch (e) {
      return res.status(500).json({ error: 'Error en el servidor', e: e.message })
    }
  }
}
