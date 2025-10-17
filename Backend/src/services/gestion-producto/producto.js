export class ProductoServicio {
  constructor ({ modeloProducto, modeloProductoVariante, modeloCategoria }) {
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
      if (productos.length === 0) return { error: 'no hay productos' }
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
      return { error: 'error al consultar la base de datos', e }
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
      return { error: 'error al consultar la base de datos', e }
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
      return { error: 'error al consultar la base de datos', e }
    }
  }

  toggleEstadoProducto = async (id) => {
    try {
      const producto = await this.modeloProducto.findByPk(id)
      if (!producto) return { error: 'El producto no existe' }
      await producto.update({ activo: !producto.activo })
      return { mensaje: 'Estado del producto actualizado con exito' }
    } catch (e) {
      return { error: 'error al consultar la base de datos', e }
    }
  }

  eliminarProducto = async (id) => {
    try {
      const producto = await this.modeloProducto.findByPk(id)
      if (!producto) return { error: 'El producto no existe' }
      await producto.destroy()
      return { mensaje: 'Producto eliminado con exito' }
    } catch (e) {
      return { error: 'error al consultar la base de datos', e }
    }
  }
}
