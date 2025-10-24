export class RolControlador {
  constructor ({ rolServicio, bitacoraServicio }) {
    this.rolServicio = rolServicio
    this.bitacoraServicio = bitacoraServicio
  }

  // Crear un nuevo rol
  crearRol = async (req, res) => {
    try {
      const input = req.body
      const resultado = await this.rolServicio.crearRol({ input })

      if (resultado.error) return res.status(400).json(resultado.error)
      const autor = 1
      await this.bitacoraServicio.crearBitacora({
        usuarioId: autor,
        accion: 'CREAR',
        tablaAfectada: 'Rol',
        registroId: resultado.id,
        datosAnteriores: null,
        datosNuevos: JSON.stringify(input),
        ip: req.ip.replace('::ffff:', '')
      })

      return res.status(201).json(resultado)
    } catch (e) {
      return res.status(500).json({ error: 'Error en el servidor', e: e.message })
    }
  }

  // Editar solo la descripción de un rol
  editarRol = async (req, res) => {
    try {
      const input = req.body
      const datos = await this.rolServicio.modeloRol.findByPk(input.id)
      if (!datos) return res.status(404).json({ error: 'Rol no encontrado' })

      const datosAnteriores = datos.toJSON()
      const resultado = await this.rolServicio.editarRol({ input })

      const autor = req.user?.id || 1
      if (autor) {
        await this.bitacoraServicio.crearBitacora({
          usuarioId: autor,
          accion: 'EDITAR',
          tablaAfectada: 'Rol',
          registroId: input.id,
          datosAnteriores,
          datosNuevos: JSON.stringify(input),
          ip: req.ip.replace('::ffff:', '')
        })
      }
      return res.status(200).json(resultado)
    } catch (e) {
      return res.status(500).json({ error: 'Error en el servidor', e: e.message })
    }
  }

  // Desactivar un rol (activo = false)
  eliminarRol = async (req, res) => {
    try {
      const { id } = req.params
      const resultado = await this.rolServicio.eliminarRol({ id })

      const autor = req.user?.id || 1
      await this.bitacoraServicio.crearBitacora({
        usuarioId: autor,
        accion: 'DESACTIVAR',
        tablaAfectada: 'Rol',
        registroId: resultado.id,
        datosAnteriores: { activo: true },
        datosNuevos: { activo: false },
        ip: req.ip.replace('::ffff:', '')
      })

      return res.status(200).json({
        mensaje: 'Rol desactivado correctamente',
        rol: resultado.toJSON() // convertir a JSON plano
      })
    } catch (e) {
      console.error(e)
      return res.status(500).json({ error: 'Error en el servidor', detalles: e.message })
    }
  }

  // Listar roles (solo id, nombre, descripcion, activo)
  listarRoles = async (req, res) => {
    try {
      const resultado = await this.rolServicio.listarRoles()
      return res.status(200).json(resultado)
    } catch (e) {
      console.error(e)
      return res.status(500).json({ error: 'Error en el servidor', e: e.message })
    }
  }
}
