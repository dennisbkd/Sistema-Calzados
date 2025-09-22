export class AutorizacionControlador {
  constructor ({ autorizacionServicio }) {
    this.autorizacionServicio = autorizacionServicio
  }

  iniciarSesion = async (req, res) => {
    console.log(req.body)
    const body = req.body
    try {
      const respuesta = await this.autorizacionServicio.iniciarSesion({ body })
      if (respuesta.error) return res.status(401).json({ error: respuesta.error })
      return res.status(200).json(respuesta)
    } catch (e) {
      return res.status(500).json({ error: `error en el servidor ${e.message}` })
    }
  }
}
