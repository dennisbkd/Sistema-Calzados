export class AutorizacionServicio {
  constructor ({ modeloUsuario, modeloRol, token, mailer, bcrypt }) {
    this.modeloUsuario = modeloUsuario
    this.token = token
    this.modeloRol = modeloRol
    this.mailer = mailer
    this.bcrypt = bcrypt
  }

  iniciarSesion = async ({ body, acceso }) => {
    const { nombre, password } = body
    const ahora = new Date()
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
      console.log('usuario existente', usuarioExistente)
      if (usuarioExistente === null) return { error: 'El usuario no existe o error al escribir la contraseña' }

      const verificarBloqueo = usuarioExistente.bloqueado ? new Date(usuarioExistente.bloqueado) : null

      if (verificarBloqueo && verificarBloqueo > ahora) {
        return { error: `Cuenta bloqueada hasta ${usuarioExistente.bloqueado}` }
      }
      const verificarPass = password === usuarioExistente.password

      if (!verificarPass) {
        usuarioExistente.intentos += 1

        if (usuarioExistente.intentos >= 3) {
          const bloqueoHasta = new Date(Date.now() + 15 * 60 * 100)
          usuarioExistente.bloqueado = bloqueoHasta

          await this.mailer.enviar({
            from: `"Seguridad" <${process.env.EMAIL_USER}>`,
            to: usuarioExistente.email,
            subject: 'Cuenta bloqueada por intentos fallidos',
            text: `Tu cuenta fue bloqueada por demasiados intentos fallidos. Intenta nuevamente después de ${bloqueoHasta}.
            Se intentó acceder desde ${acceso.userAgent} con la IP ${acceso.ip}`,
            html: `
              <p>⚠️ Tu cuenta fue bloqueada por demasiados intentos fallidos.</p>
              <p>⏰ Intenta nuevamente después de: <b>${bloqueoHasta.toLocaleString('es-BO', { timeZone: 'America/La_Paz' })}</b></p>
              <p>🌐 Intento desde: <b>${acceso.userAgent}</b></p>
              <p>📌 IP: <b>${acceso.ip}</b></p>
              <br/>
             <p>Si no fuiste tú, cambia tu contraseña inmediatamente.</p>`
          })
          await usuarioExistente.save()
          return { error: 'Cuenta bloqueada temporalmente' }
        }
        await usuarioExistente.save()
        return { error: 'password incorrecto' }
      }

      usuarioExistente.intentos = 0
      usuarioExistente.bloqueado = null

      await usuarioExistente.save()

      const token = this.token.crearToken({
        id: usuarioExistente.id,
        usuario: usuarioExistente.usuario,
        roles: usuarioExistente.roles.map(roles => roles.nombre)
      })
      return {
        mensaje: 'Inicio de sesión correcto',
        usuario: {
          id: usuarioExistente.id,
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
    try {
      const usuario = await this.modeloUsuario.findOne({
        where: { email }
      })
      if (!usuario) {
        console.log('❌ Usuario no encontrado con email:', email)
        return { mensaje: 'Si el email existe, se enviará un enlace' }
      }

      const tokenTemporal = this.token.crearToken({
        id: usuario.id,
        tipo: 'reset'
      })

      console.log('✅ Usuario encontrado:', usuario.nombre)
      console.log('✅ Token generado')

      const URL = process.env.FRONTEND_URL || 'http://localhost:5173'

      console.log('📧 Intentando enviar email a:', email)

      // AGREGA ESTE TRY-CATCH ESPECÍFICO PARA EL EMAIL
      try {
        await this.mailer.enviar({
          to: email,
          subject: 'Restablecer contraseña',
          html: `
        <p>Has solicitado restablecer tu contraseña.</p>
        <p>Haz clic en el siguiente enlace (válido por 15 minutos):</p>
        <a href="${URL}/restablecer-password?token=${tokenTemporal}">
          Restablecer contraseña
        </a>
        `
        })
        console.log('✅ Email enviado exitosamente a:', email)
      } catch (emailError) {
        console.error('❌ Error CRÍTICO enviando email:', emailError.message)
        console.error('Detalles del error:', emailError)
      // No relances el error, solo retorna el mensaje genérico
      }

      return { mensaje: 'Si el email existe, se enviará un enlace' }
    } catch (e) {
      console.error('💥 Error general en recuperación:', e.message)
      return { mensaje: 'Si el email existe, se enviará un enlace' }
    }
  }

  resetearPassword = async ({ token, nuevaPassword }) => {
    console.log(nuevaPassword)
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

      return { mensaje: 'Se actualizo exitosamente la nueva contraseña' }
    } catch (e) {
      return { error: `Token inválido o expirado${e.message}` }
    }
  }

  // pendientes
  // cerrar sesion.
}
