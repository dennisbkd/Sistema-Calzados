export class AutorizacionControlador {
  constructor ({ autorizacionServicio }) {
    this.autorizacionServicio = autorizacionServicio
  }

  iniciarSesion = async (req, res) => {
    const body = req.body
    const userAgent = req.headers['user-agent']
    const ip = req.ip
    try {
      const respuesta = await this.autorizacionServicio.iniciarSesion({ body, acceso: { userAgent, ip } })
      if (respuesta.error) return res.status(401).json({ error: respuesta.error })
      return res.status(200).json(respuesta)
    } catch (e) {
      return res.status(500).json({ error: `error en el servidor ${e.message}` })
    }
  }

  solicitaRecuperamientoPassword = async (req, res) => {
    const { email } = req.body
    try {
      const respuesta = await this.autorizacionServicio.solicitaRecuperamientoPassword({ email })
      if (respuesta.error) return res.status(401).json(respuesta.error)

      return res.status(200).json(respuesta)
    } catch (e) {
      return res.status(500).json({ mensaje: `Error con el servidor ${e.message}` })
    }
  }

  resetearPassword = async (req, res) => {
    const { token, nuevaPassword } = req.body
    try {
      const respuesta = await this.autorizacionServicio.resetearPassword({ token, nuevaPassword })
      if (respuesta.error) return res.status(401).json(respuesta.error)
      return res.status(200).json(respuesta)
    } catch (e) {
      return res.status(500).json({ mensaje: `Error con el servidor ${e.message}` })
    }
  }
}
