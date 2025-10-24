// controllers/bitacoraControlador.js - ACTUALIZADO
export class BitacoraControlador {
  constructor ({ bitacoraServicio }) {
    this.bitacoraServicio = bitacoraServicio
  }

  // Obtener usuarios activos
  obtenerUsuariosActivos = async (req, res) => {
    try {
      const { fechaInicio, fechaFin, pagina, limite } = req.query
      const respuesta = await this.bitacoraServicio.obtenerUsuariosActivos({
        fechaInicio,
        fechaFin,
        pagina: parseInt(pagina) || 1,
        limite: parseInt(limite) || 20
      })

      if (respuesta.error) return res.status(400).json(respuesta)
      return res.status(200).json(respuesta)
    } catch (error) {
      return res.status(500).json({ error: `Error en el servidor: ${error.message}` })
    }
  }

  // Obtener detalles de usuario
  obtenerDetallesUsuario = async (req, res) => {
    try {
      const usuarioId = parseInt(req.params.usuarioId)
      const { fechaInicio, fechaFin, tabla, pagina, limite } = req.query

      const respuesta = await this.bitacoraServicio.obtenerDetallesUsuario(usuarioId, {
        fechaInicio,
        fechaFin,
        tabla,
        pagina: parseInt(pagina) || 1,
        limite: parseInt(limite) || 50
      })

      if (respuesta.error) return res.status(404).json(respuesta)
      return res.status(200).json(respuesta)
    } catch (error) {
      return res.status(500).json({ error: `Error en el servidor: ${error.message}` })
    }
  }

  // controllers/bitacoraControlador.js - NUEVO MÉTODO
  obtenerEstadisticasCompletas = async (req, res) => {
    try {
      const { fechaInicio, fechaFin } = req.query
      const respuesta = await this.bitacoraServicio.obtenerEstadisticasCompletas({
        fechaInicio,
        fechaFin
      })

      if (respuesta.error) return res.status(400).json(respuesta)
      return res.status(200).json(respuesta)
    } catch (error) {
      return res.status(500).json({ error: `Error en el servidor: ${error.message}` })
    }
  }

  // Obtener estadísticas
  obtenerEstadisticas = async (req, res) => {
    try {
      const { fechaInicio, fechaFin } = req.query
      const respuesta = await this.bitacoraServicio.obtenerEstadisticas({
        fechaInicio,
        fechaFin
      })

      if (respuesta.error) return res.status(400).json(respuesta)
      return res.status(200).json(respuesta)
    } catch (error) {
      return res.status(500).json({ error: `Error en el servidor: ${error.message}` })
    }
  }

  // controllers/bitacoraControlador.js - AGREGAR
  buscarEnBitacora = async (req, res) => {
    try {
      const { termino, fechaInicio, fechaFin, limite } = req.query
      console.log('Término de búsqueda:', termino, fechaInicio, fechaFin, limite)
      if (!termino) {
        return res.status(400).json({ error: 'Término de búsqueda requerido' })
      }

      const respuesta = await this.bitacoraServicio.buscarEnBitacora(termino, {
        fechaInicio,
        fechaFin,
        limite: parseInt(limite) || 50
      })

      if (respuesta.error) return res.status(400).json(respuesta)
      return res.status(200).json(respuesta)
    } catch (error) {
      return res.status(500).json({ error: `Error en el servidor: ${error.message}` })
    }
  }
}
