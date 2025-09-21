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
      return { error: 'error en el servidor', e }
    }
  }
}
