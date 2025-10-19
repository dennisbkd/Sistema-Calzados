export class UsuarioControlador {
  constructor ({ usuarioServicio }) {
    this.usuarioServicio = usuarioServicio
  }

  listarUsuario = async (req, res) => {
    try {
      const respuesta = await this.usuarioServicio.listarUsuario()
      if (respuesta.error) return res.status(401).json(respuesta.error)
      return res.status(200).json(respuesta)
    } catch (e) {
      return res.status(500).json({ error: `error en el servidor ${e.message}` })
    }
  }

  crearUsuario = async (req, res) => {
    const body = req.body
    try {
      const respuesta = await this.usuarioServicio.crearUsuario(body)
      if (respuesta.error) return res.status(400).json(respuesta.error)
      return res.status(201).json(respuesta)
    } catch (e) {
      return res.status(500).json({ error: `Error en el servidor ${e.message}` })
    }
  }

  editarUsuario = async (req, res) => {
    const body = req.body
    const id = req.params.id
    const options = req.user
    try {
      const respuesta = await this.usuarioServicio.editarUsuario(id, { body, options })
      if (respuesta.error) return res.status(401).json(respuesta.error)
      return res.status(200).json(respuesta)
    } catch (e) {
      return res.status(500).json({ error: `error en el servidor ${e.message}` })
    }
  }

  eliminarRolUsuario = async (req, res) => {
    const rolNombre = req.body
    const id = req.params.id
    try {
      const respuesta = await this.usuarioServicio.eliminarRolUsuario(id, { rolNombre })
      if (respuesta.error) return res.status(401).json(respuesta.error)
      return res.status(200).json(respuesta)
    } catch (e) {
      return res.status(500).json({ error: `error en el servidor ${e.message}` })
    }
  }
}
