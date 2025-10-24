export class CategoriaControlador {
  constructor ({ categoriaServicio }) {
    this.categoriaServicio = categoriaServicio
  }

  // GET /categorias/obtener
  listar = async (req, res) => {
    try {
      const categorias = await this.categoriaServicio.listar()
      res.json(categorias)
    } catch (error) {
      console.error('Error al listar categorías:', error)
      res.status(500).json({ mensaje: 'Error al listar categorías' })
    }
  }

  // GET /categorias/obtener/:id
  obtener = async (req, res) => {
    try {
      const { id } = req.params
      const categoria = await this.categoriaServicio.obtener(id)
      res.json(categoria)
    } catch (error) {
      console.error('Error al obtener categoría:', error)
      res.status(404).json({ mensaje: error.message })
    }
  }

  // POST /categorias/crear
  crear = async (req, res) => {
    try {
      const data = req.body
      const nuevaCategoria = await this.categoriaServicio.crear(data)
      res.status(201).json(nuevaCategoria)
    } catch (error) {
      console.error('Error al crear categoría:', error)
      res.status(400).json({ mensaje: 'Error al crear categoría' })
    }
  }

  // PUT /categorias/actualizar/:id
  actualizar = async (req, res) => {
    try {
      const { id } = req.params
      const data = req.body
      const categoriaActualizada = await this.categoriaServicio.actualizar(id, data)
      res.json(categoriaActualizada)
    } catch (error) {
      console.error('Error al actualizar categoría:', error)
      res.status(400).json({ mensaje: error.message })
    }
  }

  // PATCH /categorias/toggle-estado/:id
  toggleEstado = async (req, res) => {
    try {
      const { id } = req.params
      const categoria = await this.categoriaServicio.toggleEstado(id)
      res.json(categoria)
    } catch (error) {
      console.error('Error al cambiar estado categoría:', error)
      res.status(400).json({ mensaje: error.message })
    }
  }

  // DELETE /categorias/eliminar/:id
  eliminar = async (req, res) => {
    try {
      const { id } = req.params
      const resultado = await this.categoriaServicio.eliminar(id)
      res.json(resultado)
    } catch (error) {
      console.error('Error al eliminar categoría:', error)
      res.status(400).json({ mensaje: error.message })
    }
  }
}
