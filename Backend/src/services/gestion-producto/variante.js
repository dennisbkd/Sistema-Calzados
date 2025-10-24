export class VarianteServicio {
  constructor ({ modeloVariante, modeloProducto }) {
    this.modeloVariante = modeloVariante
    this.modeloProducto = modeloProducto
  }

  crearVariante = async (body, options) => {
    const { productoId, talla, color, codigo, precioVenta, precioCompra, stockActual, stockMinimo } = body
    try {
      const ExisteProducto = await this.modeloProducto.findByPk(productoId)
      if (!ExisteProducto) {
        return { error: 'Producto no encontrado' }
      }
      const existeCodigo = await this.modeloVariante.findOne({ where: { codigo } })
      if (existeCodigo) {
        return { error: 'Ya existe una variante con ese código' }
      }
      await this.modeloVariante.create({
        productoId, talla, color, codigo, precioVenta, precioCompra, stockActual, stockMinimo
      }, options)
      return { mensaje: 'Variante creada con exito' }
    } catch (e) {
      return { error: 'error al consultar la base de datos', e }
    }
  }

  toggleEstadoVariante = async (id) => {
    try {
      const variante = await this.modeloVariante.findByPk(id)
      if (!variante) return { error: 'La variante no existe' }
      await variante.update({ activo: !variante.activo })
      return { mensaje: 'Estado de la variante actualizado con exito' }
    } catch (e) {
      return { error: 'error al consultar la base de datos', e }
    }
  }

  eliminarVariante = async (id) => {
    try {
      const variante = await this.modeloVariante.findByPk(id)
      if (!variante) return { error: 'La variante no existe' }
      await variante.destroy()
      return { mensaje: 'Variante eliminada con exito' }
    } catch (e) {
      return { error: 'error al consultar la base de datos', e }
    }
  }

  actualizarVariante = async (id, body, options) => {
    const { productoId, talla, color, codigo, precioVenta, precioCompra, stockActual, stockMinimo } = body
    console.log('Servicio actualizarVariante:', { productoId, talla, color, codigo, precioVenta, precioCompra, stockActual, stockMinimo })
    try {
      const ExisteProducto = await this.modeloProducto.findByPk(productoId)
      if (!ExisteProducto) {
        return { error: 'Producto no encontrado' }
      }
      const existeCodigo = await this.modeloVariante.findOne({ where: { codigo } })
      if (existeCodigo && existeCodigo.id !== Number(id)) {
        return { error: 'Ya existe una variante con ese código' }
      }
      await this.modeloVariante.update({
        talla, color, codigo, precioVenta, precioCompra, stockActual, stockMinimo
      }, { where: { id } }, options)
      return { mensaje: 'Variante actualizada con exito' }
    } catch (e) {
      return { error: 'error al consultar la base de datos', e }
    }
  }
}
