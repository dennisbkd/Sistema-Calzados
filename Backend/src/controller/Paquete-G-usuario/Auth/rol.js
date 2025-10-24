export class RolControlador {
  constructor ({ rolServicio }) {
    this.rolServicio = rolServicio
  }

  crearRol = async (req, res) => {
    try {
      const input = req.body
      const resultado = await this.rolServicio.crearRol({ input })
      if (resultado.error) return res.status(400).json(resultado.error)
      return res.status(201).json(resultado)
    } catch (e) {
      return res.status(500).json({ error: 'Error en el servidor', e: e.message })
    }
  }

  editarRol = async (req, res) => {
    try {
      const input = req.body
      const datos = await this.rolServicio.modeloRol.findByPk(input.id)
      if (!datos) return res.status(404).json({ error: 'Rol no encontrado' })
      const resultado = await this.rolServicio.editarRol({ input })
      return res.status(200).json(resultado)
    } catch (e) {
      return res.status(500).json({ error: 'Error en el servidor', e: e.message })
    }
  }

  eliminarRol = async (req, res) => {
    try {
      const { id } = req.params
      const resultado = await this.rolServicio.eliminarRol({ id })
      return res.status(200).json({
        mensaje: 'Rol desactivado correctamente',
        rol: resultado.toJSON()
      })
    } catch (e) {
      console.error(e)
      return res.status(500).json({ error: 'Error en el servidor', detalles: e.message })
    }
  }

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
