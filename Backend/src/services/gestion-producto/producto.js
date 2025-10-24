export class ProductoServicio {
  constructor({ modeloProducto, modeloProductoVariante, modeloCategoria }) {
    this.modeloProducto = modeloProducto
    this.modeloProductoVariante = modeloProductoVariante
    this.modeloCategoria = modeloCategoria
  }

  listarProductos = async () => {
    try {
      const productos = await this.modeloProducto.findAll({
        attributes: { exclude: ['categoriaId', 'createdAt', 'updatedAt'] },
        include: [
          {
            attributes: ['nombre'],
            model: this.modeloCategoria,
            as: 'categoria'
          },
          {
            attributes: { exclude: ['productoId', 'createdAt', 'updatedAt'] },
            model: this.modeloProductoVariante,
            as: 'variantes'
          }
        ],
        order: [['id', 'DESC']]
      })

      // ✅ CORRECCIÓN: Retornar array vacío en lugar de objeto con error
      if (productos.length === 0) return []

      const DtoProductos = productos.map((producto) => {
        return {
          id: producto.id,
          nombre: producto.nombre,
          modelo: producto.modelo,
          marca: producto.marca,
          estado: producto.activo,
          descripcion: producto.descripcion,
          categoria: producto.categoria.nombre,
          variantes: producto.variantes
        }
      })
      return DtoProductos
    } catch (e) {
      console.error('Error al consultar productos:', e)
      // En caso de error real de base de datos, retornar array vacío
      return []
    }
  }

  crearProducto = async ({ nombre, modelo, marca, descripcion, categoria }) => {
    try {
      const existeCategoria = await this.modeloCategoria.findOne({ where: { nombre: categoria } })
      if (!existeCategoria) return { error: 'La categoria no existe' }

      await this.modeloProducto.create({
        nombre,
        modelo,
        marca,
        descripcion,
        categoriaId: existeCategoria.id
      })
      return { mensaje: 'producto creado con exito' }
    } catch (e) {
      console.error('Error al crear producto:', e)
      return { error: 'error al crear el producto' }
    }
  }

  editarProducto = async (id, { nombre, modelo, marca, descripcion, categoria, estado }) => {
    try {
      const producto = await this.modeloProducto.findByPk(id)
      if (!producto) return { error: 'El producto no existe' }
      const existeCategoria = await this.modeloCategoria.findOne({ where: { nombre: categoria } })
      if (!existeCategoria) return { error: 'La categoria no existe' }
      await producto.update({
        nombre,
        modelo,
        marca,
        descripcion,
        categoriaId: existeCategoria.id,
        activo: estado
      })
      return { mensaje: 'producto editado con exito' }
    } catch (e) {
      console.error('Error al editar producto:', e)
      return { error: 'error al editar el producto' }
    }
  }

  toggleEstadoProducto = async (id) => {
    try {
      const producto = await this.modeloProducto.findByPk(id)
      if (!producto) return { error: 'El producto no existe' }
      await producto.update({ activo: !producto.activo })
      return { mensaje: 'Estado del producto actualizado con exito' }
    } catch (e) {
      console.error('Error al cambiar estado del producto:', e)
      return { error: 'error al cambiar estado del producto' }
    }
  }

  eliminarProducto = async (id) => {
    try {
      const producto = await this.modeloProducto.findByPk(id)
      if (!producto) return { error: 'El producto no existe' }
      await producto.destroy()
      return { mensaje: 'Producto eliminado con exito' }
    } catch (e) {
      console.error('Error al eliminar producto:', e)
      return { error: 'error al eliminar el producto' }
    }
  }
}