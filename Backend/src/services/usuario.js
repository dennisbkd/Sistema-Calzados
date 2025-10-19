export class UsuarioServicio {
  constructor ({ modeloUsuario, modeloRol, bcrypt }) {
    this.modeloUsuario = modeloUsuario
    this.modeloRol = modeloRol
    this.bcrypt = bcrypt
  }

  listarUsuario = async () => {
    try {
      const usuarios = await this.modeloUsuario.findAll({
        attributes: ['id', 'nombre', 'email', 'activo', 'createdAt'],
        include: {
          attributes: ['nombre'],
          model: this.modeloRol,
          as: 'roles',
          through: { attributes: [] }
        }
      })
      if (usuarios.length === 0) return { error: 'no hay usuario' }
      const usuarioDto = usuarios.map((usuario) => {
        const hora = new Date(usuario.createdAt).toISOString().substring(11, 16)
        const fecha = usuario.createdAt.toISOString().split('T')[0]
        return {
          id: usuario.id,
          nombre: usuario.nombre,
          email: usuario.email,
          activo: usuario.activo,
          fechaRegistro: fecha,
          hora,
          roles: usuario.roles.map(rol => rol.nombre)
        }
      })
      return usuarioDto
    } catch (e) {
      return { error: 'error al consular a la base base de datos', e }
    }
  }

  crearUsuario = async ({ nombre, email, password, roles = [] }) => {
    try {
      const existente = await this.modeloUsuario.findOne({ where: { email } })
      if (existente) {
        return { error: 'El email ya está registrado' }
      }
      // 1. Hashear la contraseña
      const hashedPassword = await this.bcrypt.hash(password, 10)

      // 2. Crear usuario
      const nuevoUsuario = await this.modeloUsuario.create({
        nombre,
        email,
        password: hashedPassword
      })

      // 3. Si mandas roles, buscarlos en la DB y asignarlos
      if (roles.length > 0) {
        const rolesDB = await this.modeloRol.findAll({
          where: { nombre: roles }
        })

        await nuevoUsuario.setRoles(rolesDB)
      }

      // 4. Retornar el usuario creado con roles
      const usuarioConRoles = await this.modeloUsuario.findByPk(nuevoUsuario.id, {
        attributes: ['id', 'nombre', 'email', 'activo', 'createdAt'],
        include: {
          attributes: ['nombre'],
          model: this.modeloRol,
          as: 'roles',
          through: { attributes: [] }
        }
      })

      return {
        id: usuarioConRoles.id,
        nombre: usuarioConRoles.nombre,
        email: usuarioConRoles.email,
        activo: usuarioConRoles.activo,
        roles: usuarioConRoles.roles.map(rol => rol.nombre),
        fechaRegistro: usuarioConRoles.createdAt.toISOString().split('T')[0],
        hora: new Date(usuarioConRoles.createdAt).toISOString().substring(11, 16)
      }
    } catch (e) {
      console.error(e)
      return { error: 'Error creando usuario', e }
    }
  }

  editarUsuario = async (id, { body, options }) => {
    const { nombre, activo, email, password, roles = [] } = body
    try {
    // 1. Buscar usuario
      const usuario = await this.modeloUsuario.findByPk(id)
      if (!usuario) return { error: 'Usuario no encontrado' }

      // 2. Actualizar datos básicos
      await usuario.update({
        nombre,
        activo,
        email,
        ...(password && { password })
      }, options)

      // 3. Si mandas roles, sincronizar roles del usuario
      if (roles && roles.length > 0) {
      // Buscar roles existentes en DB por nombre
        const rolesDB = await this.modeloRol.findAll({
          where: { nombre: roles }
        })
        await usuario.setRoles(rolesDB, {
          individualHooks: true,
          context: options
        }) // reemplaza roles anteriores
      }

      // 4. Obtener usuario actualizado con roles
      const usuarioActualizado = await this.modeloUsuario.findByPk(id, {
        attributes: ['id', 'nombre', 'email', 'activo', 'createdAt'],
        include: {
          attributes: ['nombre'],
          model: this.modeloRol,
          as: 'roles',
          through: { attributes: [] }
        }
      })

      const hora = new Date(usuarioActualizado.createdAt).toISOString().substring(11, 16)
      const fecha = usuarioActualizado.createdAt.toISOString().split('T')[0]

      return {
        id: usuarioActualizado.id,
        nombre: usuarioActualizado.nombre,
        email: usuarioActualizado.email,
        activo: usuarioActualizado.activo,
        fechaRegistro: fecha,
        hora,
        roles: usuarioActualizado.roles.map(rol => rol.nombre)
      }
    } catch (e) {
      console.error(e)
      return { error: 'error al consultar/editar en la base de datos', e }
    }
  }

  eliminarRolUsuario = async (id, { rolNombre }) => {
    try {
      const usuario = await this.modeloUsuario.findByPk(id, {
        include: { model: this.modeloRol, as: 'roles' }
      })
      if (!usuario) return { error: 'Usuario no encontrado' }

      const rolesDB = await this.modeloRol.findAll({ where: { nombre: rolNombre } })
      await usuario.setRoles(rolesDB)

      return { mensaje: `Rol ${rolNombre} eliminado del usuario` }
    } catch (e) {
      return { error: 'Error eliminando rol', e }
    }
  }
}
