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

      const inicio = new Date(fechaInicio)
      const fin = new Date(fechaFin)

      if (inicio > fin) {
        return res.status(400).json({
          error: 'La fecha de inicio no puede ser posterior a la fecha de fin'
        })
      }

      if (isNaN(Date.parse(fechaInicio)) || isNaN(Date.parse(fechaFin))) {
        return res.status(400).json({
          error: 'Las fechas deben tener un formato válido (YYYY-MM-DD)'
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

  // Listar ventas
  listarVentasFecha = async (req, res) => {
    try {
      const { fechaInicio, fechaFin } = req.query

      if (!fechaInicio || !fechaFin) {
        return res.status(400).json({
          error: 'Los parámetros fechaInicio y fechaFin son requeridos'
        })
      }

      const inicio = new Date(fechaInicio)
      const fin = new Date(fechaFin)

      if (inicio > fin) {
        return res.status(400).json({
          error: 'La fecha de inicio no puede ser posterior a la fecha de fin'
        })
      }

      if (isNaN(Date.parse(fechaInicio)) || isNaN(Date.parse(fechaFin))) {
        return res.status(400).json({
          error: 'Las fechas deben tener un formato válido (YYYY-MM-DD)'
        })
      }

      const resultado = await this.reporteIngresoEgresoServicio.listarVentasFecha({
        fechaInicio,
        fechaFin
      })

      return res.status(200).json(resultado)
    } catch (e) {
      return res.status(500).json({ error: 'Error en el servidor', e: e.message })
    }
  }

  listarComprasFecha = async (req, res) => {
    try {
      const { fechaInicio, fechaFin } = req.query

      if (!fechaInicio || !fechaFin) {
        return res.status(400).json({
          error: 'Los parámetros fechaInicio y fechaFin son requeridos'
        })
      }

      const inicio = new Date(fechaInicio)
      const fin = new Date(fechaFin)

      if (inicio > fin) {
        return res.status(400).json({
          error: 'La fecha de inicio no puede ser posterior a la fecha de fin'
        })
      }

      if (isNaN(Date.parse(fechaInicio)) || isNaN(Date.parse(fechaFin))) {
        return res.status(400).json({
          error: 'Las fechas deben tener un formato válido (YYYY-MM-DD)'
        })
      }

      const resultado = await this.reporteIngresoEgresoServicio.listarComprasFecha({
        fechaInicio,
        fechaFin
      })

      return res.status(200).json(resultado)
    } catch (e) {
      return res.status(500).json({ error: 'Error en el servidor', e: e.message })
    }
  }
}
