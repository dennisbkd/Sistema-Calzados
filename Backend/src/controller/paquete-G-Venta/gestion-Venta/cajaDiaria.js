export class CajaDiariaControlador {
  constructor ({ cajaDiariaServicio }) {
    this.cajaDiariaServicio = cajaDiariaServicio
  }

  obtenerResumenCajaDiaria = async (req, res) => {
    try {
      const { fecha } = req.query
      const usuarioId = req.usuario?.id || 1// Asumiendo que tienes autenticación

      if (!fecha) {
        return res.status(400).json({ error: 'La fecha es requerida' })
      }

      const respuesta = await this.cajaDiariaServicio.obtenerResumenCajaDiaria({
        fecha,
        usuarioId
      })

      if (respuesta.error) {
        return res.status(400).json(respuesta)
      }

      return res.status(200).json(respuesta)
    } catch (e) {
      return res.status(500).json({
        error: `Error en el servidor: ${e.message}`
      })
    }
  }

  obtenerMovimientosPorRango = async (req, res) => {
    try {
      const { fechaInicio, fechaFin } = req.query
      const usuarioId = req.usuario?.id

      if (!fechaInicio || !fechaFin) {
        return res.status(400).json({
          error: 'Las fechas de inicio y fin son requeridas'
        })
      }

      const respuesta = await this.cajaDiariaServicio.obtenerMovimientosPorFecha({
        fechaInicio,
        fechaFin,
        usuarioId
      })

      if (respuesta.error) {
        return res.status(400).json(respuesta)
      }

      return res.status(200).json(respuesta)
    } catch (e) {
      return res.status(500).json({
        error: `Error en el servidor: ${e.message}`
      })
    }
  }

  obtenerResumenHoy = async (req, res) => {
    try {
      const hoy = new Date().toISOString().split('T')[0]
      const usuarioId = req.usuario?.id

      const respuesta = await this.cajaDiariaServicio.obtenerResumenCajaDiaria({
        fecha: hoy,
        usuarioId
      })

      if (respuesta.error) {
        return res.status(400).json(respuesta)
      }

      return res.status(200).json(respuesta)
    } catch (e) {
      return res.status(500).json({
        error: `Error en el servidor: ${e.message}`
      })
    }
  }
}
