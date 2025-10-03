export class ProveedorControlador {
  constructor ({ proveedorServicio }) {
    this.proveedorServicio = proveedorServicio
  }

  listar = async (req, res) => {
    try {
      const proveedores = await this.proveedorServicio.listar()
      res.json(proveedores)
    } catch (error) {
      console.error('Error al listar proveedores:', error)
      res.status(500).json({ mensaje: 'Error al listar proveedores' })
    }
  }

  obtener = async (req, res) => {
    try {
      const { id } = req.params
      const proveedor = await this.proveedorServicio.obtener(id)
      res.json(proveedor)
    } catch (error) {
      console.error('Error al obtener proveedor:', error)
      res.status(404).json({ mensaje: error.message })
    }
  }

  crear = async (req, res) => {
    try {
      const data = req.body
      const nuevoProveedor = await this.proveedorServicio.crear(data)
      res.status(201).json(nuevoProveedor)
    } catch (error) {
      console.error('Error al crear proveedor:', error)
      res.status(400).json({ mensaje: 'Error al crear proveedor' })
    }
  }

  actualizar = async (req, res) => {
    try {
      const { id } = req.params
      const data = req.body
      const proveedorActualizado = await this.proveedorServicio.actualizar(id, data)
      res.json(proveedorActualizado)
    } catch (error) {
      console.error('Error al actualizar proveedor:', error)
      res.status(400).json({ mensaje: error.message })
    }
  }

  eliminar = async (req, res) => {
    try {
      const { id } = req.params
      const resultado = await this.proveedorServicio.eliminar(id)
      res.json(resultado)
    } catch (error) {
      console.error('Error al eliminar proveedor:', error)
      res.status(400).json({ mensaje: error.message })
    }
  }

  toggleEstado = async (req, res) => {
    try {
      const { id } = req.params
      const proveedor = await this.proveedorServicio.toggleEstado(id)
      res.json(proveedor)
    } catch (error) {
      console.error('Error al cambiar estado proveedor:', error)
      res.status(400).json({ mensaje: error.message })
    }
  }
}
