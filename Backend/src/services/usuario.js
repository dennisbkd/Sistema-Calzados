export class UsuarioServicio {
  constructor ({ modeloUsuario, modeloRol }) {
    this.modeloUsuario = modeloUsuario
    this.modeloRol = modeloRol
  }

  listarUsuario = async () => {
    try {
      const usuarios = await this.modeloUsuario.findAll({
        include: {
          model: this.modeloRol,
          as: 'roles'
        }
      })
      if (usuarios.length === 0) return { error: 'no hay usuario' }

      return usuarios
    } catch (e) {
      return { error: 'error al consular a la base base de datos', e }
    }
  }
}
