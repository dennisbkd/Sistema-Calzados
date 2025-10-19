export class ProductoControlador {
  constructor ({ productoServicio }) {
    this.productoServicio = productoServicio
  }

  listarProductos = async (req, res) => {
    const productos = await this.productoServicio.listarProductos()
    if (productos.error) return res.status(400).json(productos)
    return res.status(200).json(productos)
  }

  crearProducto = async (req, res) => {
    const body = req.body
    const options = req.user
    const nuevoProducto = await this.productoServicio.crearProducto(body, options)
    if (nuevoProducto.error) return res.status(400).json(nuevoProducto)
    return res.status(201).json(nuevoProducto)
  }

  editarProducto = async (req, res) => {
    const { id } = req.params
    const body = req.body
    const options = req.user
    const productoEditado = await this.productoServicio.editarProducto(id, body, options)
    if (productoEditado.error) return res.status(400).json(productoEditado)
    return res.status(200).json(productoEditado)
  }

  toggleEstadoProducto = async (req, res) => {
    const { id } = req.params
    const productoCambiado = await this.productoServicio.toggleEstadoProducto(id)
    if (productoCambiado.error) return res.status(400).json(productoCambiado)
    return res.status(200).json(productoCambiado)
  }

  eliminarProducto = async (req, res) => {
    const { id } = req.params
    const options = req.user
    const productoEliminado = await this.productoServicio.eliminarProducto(id, options)
    if (productoEliminado.error) return res.status(400).json(productoEliminado)
    return res.status(200).json(productoEliminado)
  }
}
