// import bcrypt from 'bcrypt'

export class AutorizacionServicio {
  constructor ({ modeloUsuario, modeloRol, token }) {
    this.modeloUsuario = modeloUsuario
    this.token = token
    this.modeloRol = modeloRol
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

      // falta implementar Bycript, implementar cuando exista el servicio crear Usuario

      const verificarPass = password === usuarioExistente.password
      if (!verificarPass) return { error: 'password incorrecto' }

      const nuevoToken = this.token.crearToken({
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
        nuevoToken
      }
    } catch (e) {
      return { error: `Hubo un error al intentar validar los datos ${e.message}` }
    }
  }

  // pendientes

  // mandar email para el recuperamiento de password se ocupara nodemailer.
  // cerrar sesion.
  // agregar Cookies.
  // verificar si existe un token
}
