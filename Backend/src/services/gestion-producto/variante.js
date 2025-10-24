export class VarianteServicio {
  constructor({ modeloVariante, modeloProducto }) {
    this.modeloVariante = modeloVariante
    this.modeloProducto = modeloProducto
  }

  crearVariante = async ({ productoId, talla, color, codigo, precioVenta, precioCompra, stockActual, stockMinimo }) => {
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
      })
      return { mensaje: 'Variante creada con exito' }
    } catch (e) {
      console.error('Error al crear variante:', e)
      return { error: 'error al crear la variante' }
    }
  }

  toggleEstadoVariante = async (id) => {
    try {
      const variante = await this.modeloVariante.findByPk(id)
      if (!variante) return { error: 'La variante no existe' }
      await variante.update({ activo: !variante.activo })
      return { mensaje: 'Estado de la variante actualizado con exito' }
    } catch (e) {
      console.error('Error al cambiar estado de variante:', e)
      return { error: 'error al cambiar estado de la variante' }
    }
  }

  eliminarVariante = async (id) => {
    try {
      const variante = await this.modeloVariante.findByPk(id)
      if (!variante) return { error: 'La variante no existe' }
      await variante.destroy()
      return { mensaje: 'Variante eliminada con exito' }
    } catch (e) {
      console.error('Error al eliminar variante:', e)
      return { error: 'error al eliminar la variante' }
    }
  }

  actualizarVariante = async (id, { productoId, talla, color, codigo, precioVenta, precioCompra, stockActual, stockMinimo }) => {
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
      }, { where: { id } })
      return { mensaje: 'Variante actualizada con exito' }
    } catch (e) {
      console.error('Error al actualizar variante:', e)
      return { error: 'error al actualizar la variante' }
    }
  }
}