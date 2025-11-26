export class InventarioControlador {
  constructor ({ inventarioServicio }) {
    this.inventarioServicio = inventarioServicio
  }

  estadoInventario = async (req, res) => {
    const filtros = req.body
    const resultado = await this.inventarioServicio.estadoInventario(filtros)
    if (resultado.error) return res.status(400).json(resultado)
    return res.status(200).json(resultado)
  }

  reporteInventario = async (req, res) => {
    const filtros = req.body
    const resultado = await this.inventarioServicio.reporteInventario(filtros)
    if (resultado.error) return res.status(400).json(resultado)
    return res.status(200).json(resultado)
  }

  // Endpoint para movimientos de inventario
  movimientosInventario = async (req, res) => {
    const filtros = req.body
    const resultado = await this.inventarioServicio.movimientosInventario(filtros)
    if (resultado.error) return res.status(400).json(resultado)
    return res.status(200).json(resultado)
  }

  // Endpoint para listar productos (para filtros) CON parámetros
  listarProductos = async (req, res) => {
    const { categoriaId } = req.query // Recibir el parámetro de categoría
    const resultado = await this.inventarioServicio.listarProductos({ categoriaId })
    if (resultado.error) return res.status(400).json(resultado)
    return res.status(200).json(resultado)
  }

  // Endpoint para listar categorías (para filtros)
  listarCategorias = async (req, res) => {
    const resultado = await this.inventarioServicio.listarCategorias()
    if (resultado.error) return res.status(400).json(resultado)
    return res.status(200).json(resultado)
  }
}
