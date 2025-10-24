export class RolServicio {
  constructor ({ modeloRol }) {
    this.modeloRol = modeloRol
  }

  // Crear un nuevo rol
  crearRol = async ({ input }) => {
    try {
      const { nombre, descripcion, activo } = input
      const newRol = await this.modeloRol.create({ nombre, descripcion, activo })
      return newRol
    } catch (e) {
      console.error(e)
      throw new Error('Error al crear el rol: ' + e.message)
    }
  }

  // Editar descripción y/o activo de un rol
  editarRol = async ({ input }) => {
    try {
      const { id, descripcion, activo } = input
      await this.modeloRol.update(
        { descripcion, activo },
        { where: { id } }
      )
      const rolActualizado = await this.modeloRol.findByPk(id, {
        attributes: ['id', 'nombre', 'descripcion', 'activo', 'createdAt', 'updatedAt']
      })
      return rolActualizado
    } catch (e) {
      console.error(e)
      throw new Error('Error al editar el rol: ' + e.message)
    }
  }

  // Desactivar un rol
  eliminarRol = async ({ id }) => {
    try {
      await this.modeloRol.update(
        { activo: false },
        { where: { id } }
      )
      const rol = await this.modeloRol.findByPk(id, {
        attributes: ['id', 'nombre', 'descripcion', 'activo', 'createdAt', 'updatedAt']
      })
      return rol
    } catch (e) {
      console.error(e)
      throw new Error('Error al desactivar el rol: ' + e.message)
    }
  }

  // Listar todos los roles
  listarRoles = async () => {
    try {
      const roles = await this.modeloRol.findAll({
        attributes: ['id', 'nombre', 'descripcion', 'activo']
      })
      return roles || [] // nunca devuelvas undefined ni un objeto error
    } catch (e) {
      console.error(e)
      throw e // deja que React Query capture el error
    }
  }
}
