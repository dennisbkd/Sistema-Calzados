export class CompraServicio {
  constructor({ modeloCompra, modeloUsuario, modeloProveedor, modeloDetalleCompra, modeloProductoVariante, modeloProducto }) {
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
      console.error('Error al registrar la compra:', error)
      throw new Error('Error al registrar la compra: ' + error.message)
    }
  }

  editarCompra = async ({ input }) => {
    const { id, nroFactura, total, estado, proveedorId, usuarioId, detallesEliminar, detallesNuevos } = input
    const transaction = await this.modeloCompra.sequelize.transaction()

    try {
      const compra = await this.modeloCompra.findByPk(id, { transaction })
      if (!compra) throw new Error('Compra no encontrada')

      // 1. ELIMINAR detalles específicos (con validación de compraId)
      if (detallesEliminar && detallesEliminar.length > 0) {
        await this.modeloDetalleCompra.destroy({
          where: {
            id: detallesEliminar,
            compraId: id
          },
          transaction
        })
      }

      // 2. ACTUALIZAR datos de la compra (solo campos proporcionados)
      const datosActualizar = {}
      if (nroFactura !== undefined) datosActualizar.nroFactura = nroFactura
      if (total !== undefined) datosActualizar.total = total
      if (estado !== undefined) datosActualizar.estado = estado
      if (proveedorId !== undefined) datosActualizar.proveedorId = proveedorId
      if (usuarioId !== undefined) datosActualizar.usuarioId = usuarioId

      if (Object.keys(datosActualizar).length > 0) {
        await compra.update(datosActualizar, { transaction })
      }

      // 3. CREAR nuevos detalles
      if (detallesNuevos && detallesNuevos.length > 0) {
        const detallesACrear = detallesNuevos.map(d => ({
          compraId: id,
          varianteId: d.varianteId,
          cantidad: d.cantidad,
          precioUnitario: d.precioUnitario,
          subtotal: d.subtotal
        }))
        await this.modeloDetalleCompra.bulkCreate(detallesACrear, { transaction })
      }

      await transaction.commit()
      return {
        compra: await this.modeloCompra.findByPk(id, {
          include: ['detalles']
        }),
        detalles: {
          eliminados: detallesEliminar || [],
          nuevos: detallesNuevos || []
        }
      }
    } catch (error) {
      await transaction.rollback()
      console.error('Error al editar la compra:', error)
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
      console.error('Error al eliminar la compra:', error)
      throw new Error('Error al eliminar la compra: ' + error.message)
    }
  }

  listarCompras = async () => {
    try {
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

      // ✅ CORRECCIÓN: Retornar array vacío si no hay compras
      if (compras.length === 0) return []

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
    } catch (error) {
      console.error('Error al listar compras:', error)
      // En caso de error real de base de datos, retornar array vacío
      return []
    }
  }

  // genera un código simple de factura secuencial
  generarCodigoFactura = async () => {
    try {
      const ultimaCompra = await this.modeloCompra.findOne({
        order: [['nroFactura', 'DESC']]
      })

      let nuevoNumero = 1

      if (ultimaCompra && ultimaCompra.nroFactura) {
        const match = ultimaCompra.nroFactura.match(/FAC-(\d+)/)
        if (match && match[1]) {
          nuevoNumero = parseInt(match[1], 10) + 1
        }
      }
      const codigoFactura = `FAC-${nuevoNumero.toString().padStart(3, '0')}`
      return codigoFactura
    } catch (error) {
      console.error('Error al generar código de factura:', error)
      throw new Error('Error al generar código de factura: ' + error.message)
    }
  }

  cambiarEstadoCompra = async ({ input }) => {
    const { id, estado } = input
    try {
      const compra = await this.modeloCompra.findByPk(id)
      if (!compra) throw new Error('Compra no encontrada')
      await compra.update({ estado })
      return compra
    } catch (error) {
      console.error('Error al cambiar el estado de la compra:', error)
      throw new Error('Error al cambiar el estado de la compra: ' + error.message)
    }
  }

  generarFactura = async ({ input }) => {
    const { id } = input
    try {
      // Traer la compra con proveedor, usuario y detalles
      const compra = await this.modeloCompra.findByPk(id, {
        include: [
          { model: this.modeloProveedor, as: 'proveedor', attributes: ['nombre'] },
          { model: this.modeloUsuario, as: 'usuario', attributes: ['nombre'] },
          {
            model: this.modeloDetalleCompra,
            as: 'detalles',
            include: [
              {
                model: this.modeloProductoVariante,
                as: 'variante',
                attributes: ['talla', 'color', 'codigo', 'precioVenta'],
                include: [
                  { model: this.modeloProducto, as: 'producto', attributes: ['nombre', 'marca'] }
                ]
              }
            ]
          }
        ]
      })

      if (!compra) throw new Error('Compra no encontrada')

      // Formatear los detalles
      const detalles = compra.detalles.map(d => ({
        descripcion: d.variante?.producto?.nombre || d.variante?.codigo || 'Producto',
        marca: d.variante?.producto?.marca || '',
        codigo: d.variante?.codigo || '',
        color: d.variante?.color || '',
        talla: d.variante?.talla || '',
        cantidad: d.cantidad,
        precioUnitario: d.precioUnitario,
        subtotal: d.subtotal
      }))

      const fechaCompra = new Date(compra.createdAt)
      const fechaFormateada = fechaCompra.toLocaleDateString('es-BO')
      const horaFormateada = fechaCompra.toLocaleTimeString('es-BO')

      const factura = {
        nroFactura: compra.nroFactura,
        fecha: fechaFormateada,
        hora: horaFormateada,
        proveedor: compra.proveedor?.nombre || '',
        usuario: compra.usuario?.nombre || '',
        total: compra.total,
        detalles
      }

      return factura
    } catch (error) {
      console.error('Error al generar la factura:', error)
      throw new Error('Error al generar la factura: ' + error.message)
    }
  }
}