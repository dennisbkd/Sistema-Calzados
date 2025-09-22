export class AutorizacionServicio {
  constructor ({ modeloUsuario, modeloRol, token, mailer, bcrypt }) {
    this.modeloUsuario = modeloUsuario
    this.token = token
    this.modeloRol = modeloRol
    this.mailer = mailer
    this.bcrypt = bcrypt
  }

  iniciarSesion = async ({ body }) => {
    const { nombre, password } = body
    console.log(nombre)
    try {
      const usuarioExistente = await this.modeloUsuario.findOne({
        include: {
          attributes: ['nombre'],
          model: this.modeloRol,
          as: 'roles',
          through: { attributes: [] }
        },
        where: { nombre }
      })

      if (usuarioExistente === null) return { error: 'El usuario no existe' }

      const verificarPass = await this.bcrypt.compare(password, usuarioExistente.password)

      if (!verificarPass) return { error: 'password incorrecto' }

      const token = this.token.crearToken({
        id: usuarioExistente.id,
        usuario: usuarioExistente.usuario,
        roles: usuarioExistente.roles.map(roles => roles.nombre)
      })
      return {
        mensaje: 'Inicio de sesión correcto',
        usuario: {
          nombre: usuarioExistente.nombre,
          email: usuarioExistente.email,
          roles: usuarioExistente.roles.map(roles => roles.nombre)
        },
        token
      }
    } catch (e) {
      return { error: `Hubo un error al intentar validar los datos ${e.message}` }
    }
  }

  solicitaRecuperamientoPassword = async ({ email }) => {
    console.log(email)

    try {
      const usuario = await this.modeloUsuario.findOne({
        where: { email }
      })
      if (!usuario) return { mensaje: 'Si el email existe, se enviará un enlace' }

      const tokenTemporal = this.token.crearToken({
        id: usuario.id,
        tipo: 'reset'
      })
      await this.mailer.enviar(
        {
          to: email,
          subject: 'Restablecer constraseña',
          html: `
          <p>Has solicitado restablecer tu contraseña.</p>
          <p>Haz clic en el siguiente enlace (válido por 15 minutos):</p>
          <a href = "http://localhost:3000/autorizacion/restablecer-password?token=${tokenTemporal}" >
            Restablecer contraseña
          </a>
          `
        }
      )
      return { mensaje: 'Si el email existe, se enviará un enlace' }
    } catch (e) {
      return { error: `Error al encontrar al encontrar el email ${e.message}` }
    }
  }

  resetearPassword = async ({ token, nuevaPassword }) => {
    try {
      const playload = this.token.verificarToken(token)
      if (playload.tipo !== 'reset') {
        return { error: 'Token inválido para restablecer contraseña' }
      }

      const hashear = await this.bcrypt.hash(nuevaPassword, 10)

      await this.modeloUsuario.update(
        { password: hashear },
        { where: { id: playload.id } }
      )

      return { mensaje: 'Contraseña actualizada correctamente' }
    } catch (e) {
      return { error: `Token inválido o expirado${e.message}` }
    }
  }

  // pendientes
  // cerrar sesion.
}
