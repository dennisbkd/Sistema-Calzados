export class CompraServicio {
  constructor ({ modeloCompra, modeloUsuario, modeloProveedor, modeloDetalleCompra, modeloProductoVariante, modeloProducto }) {
    this.modeloCompra = modeloCompra
    this.modeloUsuario = modeloUsuario
    this.modeloProveedor = modeloProveedor
    this.modeloDetalleCompra = modeloDetalleCompra
    this.modeloProductoVariante = modeloProductoVariante
    this.modeloProducto = modeloProducto
  }

  registrarCompra = async ({ input }) => {
    const { nroFactura, total, estado, proveedorId, usuarioId, detalles } = input
    try {
      const nuevaCompra = await this.modeloCompra.create({ nroFactura, total, estado, proveedorId, usuarioId })
      if (detalles && detalles.length > 0) {
        const detallesACrear = detalles.map(d => ({
          compraId: nuevaCompra.id,
          varianteId: d.varianteId,
          cantidad: d.cantidad,
          precioUnitario: d.precioUnitario,
          subtotal: d.subtotal
        }))
        await this.modeloDetalleCompra.bulkCreate(detallesACrear)
      }
      return { compra: nuevaCompra, detalles }
    } catch (error) {
      throw new Error('Error al registrar la compra: ' + error.message)
    }
  }

  editarCompra = async ({ input }) => {
    const { id, nroFactura, total, estado, proveedorId, usuarioId, detalles } = input
    try {
      const compra = await this.modeloCompra.findByPk(id)
      if (!compra) throw new Error('Compra no encontrada')

      await compra.update({ nroFactura, total, estado, proveedorId, usuarioId })

      if (detalles && detalles.length > 0) {
        await this.modeloDetalleCompra.destroy({ where: { compraId: id } })
        const detallesACrear = detalles.map(d => ({
          compraId: id,
          varianteId: d.varianteId,
          cantidad: d.cantidad,
          precioUnitario: d.precioUnitario,
          subtotal: d.subtotal
        }))
        await this.modeloDetalleCompra.bulkCreate(detallesACrear)
      }

      return { compra, detalles }
    } catch (error) {
      throw new Error('Error al editar la compra: ' + error.message)
    }
  }

  eliminarCompra = async ({ input }) => {
    const { id } = input
    try {
      const compra = await this.modeloCompra.findByPk(id)
      if (!compra) throw new Error('Compra no encontrada')

      await compra.update({ estado: 'anulada' })
      return compra
    } catch (error) {
      throw new Error('Error al eliminar la compra: ' + error.message)
    }
  }

  listarCompras = async () => {
    const compras = await this.modeloCompra.findAll({
      include: [
        { model: this.modeloProveedor, attributes: ['nombre'], as: 'proveedor' },
        { model: this.modeloUsuario, attributes: ['nombre'], as: 'usuario' },
        {
          model: this.modeloDetalleCompra,
          as: 'detalles',
          include: [
            {
              model: this.modeloProductoVariante,
              as: 'variante',
              attributes: ['talla', 'color', 'codigo'],
              include: [
                { model: this.modeloProducto, as: 'producto', attributes: ['nombre', 'marca'] }
              ]
            }
          ]
        }
      ]
    })

    return compras.map(c => {
      const fechaCompra = new Date(c.createdAt)
      const fechaRegistrada = fechaCompra.toISOString().split('T')[0]
      const horaCompra = fechaCompra.toTimeString().split(' ')[0]

      const detalles = c.detalles.map(d => ({
        id: d.id,
        producto: d.variante?.producto?.nombre || null,
        marca: d.variante?.producto?.marca || null,
        codigo: d.variante?.codigo || null,
        color: d.variante?.color || null,
        talla: d.variante?.talla || null,
        cantidad: d.cantidad,
        precioUnitario: d.precioUnitario,
        subtotal: d.subtotal
      }))

      return {
        id: c.id,
        nroFactura: c.nroFactura,
        total: c.total,
        estado: c.estado,
        proveedor: c.proveedor?.nombre || null,
        usuario: c.usuario?.nombre || null,
        fechaCompra: fechaRegistrada,
        horaCompra,
        detalles
      }
    })
  }

  // genera un codigo unico para la factura
  generarCodigoFactura = async () => {
    let facturaUnica = false
    let codigoFactura = ''

    while (!facturaUnica) {
      const fecha = new Date()
      const año = fecha.getFullYear().toString().slice(-2)
      const mes = (fecha.getMonth() + 1).toString().padStart(2, '0')
      const dia = fecha.getDate().toString().padStart(2, '0')
      const hora = fecha.getHours().toString().padStart(2, '0')
      const min = fecha.getMinutes().toString().padStart(2, '0')
      const seg = fecha.getSeconds().toString().padStart(2, '0')
      const random = Math.floor(100 + Math.random() * 900)

      codigoFactura = `FAC-${año}${mes}${dia}-${hora}${min}${seg}-${random}`

      const existe = await this.modeloCompra.findOne({ where: { nroFactura: codigoFactura } })
      if (!existe) facturaUnica = true
    }

    return codigoFactura
  }
}
