export class NotaSalidaControlador {
  constructor ({ notaSalidaServicio }) {
    this.notaSalidaServicio = notaSalidaServicio
  }

  registrarNotaSalida = async (req, res) => {
    const { varianteId, cantidad, motivo, documentoRef } = req.body
    const usuarioId = req.user?.id
    const respuesta = await this.notaSalidaServicio.registrarNotaSalida({
      varianteId,
      cantidad,
      motivo,
      usuarioId,
      documentoRef
    })

    if (respuesta.error) {
      return res.status(400).json(respuesta)
    }

    return res.status(201).json(respuesta)
  }

  obtenerHistorial = async (req, res) => {
    const { pagina = 1, limite = 20 } = req.query
    const respuesta = await this.notaSalidaServicio.obtenerHistorialNotasSalida({
      pagina: Number(pagina),
      limite: Number(limite)
    })

    if (respuesta.error) {
      return res.status(500).json(respuesta)
    }

    return res.status(200).json(respuesta)
  }
}
