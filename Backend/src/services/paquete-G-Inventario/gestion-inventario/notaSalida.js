export class NotaSalidaServicio {
  constructor ({ modeloProductoVariante, modeloMovimientoInventario, modeloProducto, modeloUsuario, sequelize }) {
    this.modeloProductoVariante = modeloProductoVariante
    this.modeloMovimientoInventario = modeloMovimientoInventario
    this.modeloProducto = modeloProducto
    this.modeloUsuario = modeloUsuario
    this.sequelize = sequelize
  }

  registrarNotaSalida = async ({ varianteId, cantidad, motivo, usuarioId, documentoRef = null }) => {
    if (!varianteId) {
      return { error: 'Debes indicar la variante afectada' }
    }

    const cantidadNumero = Number(cantidad)
    if (Number.isNaN(cantidadNumero) || cantidadNumero <= 0) {
      return { error: 'La cantidad debe ser un numero mayor a cero' }
    }

    if (!motivo || motivo.trim() === '') {
      return { error: 'Es necesario especificar un motivo para la salida' }
    }

    if (!usuarioId) {
      return { error: 'No se pudo identificar al responsable de la operacion' }
    }

    const variante = await this.modeloProductoVariante.findByPk(varianteId)
    if (!variante || !variante.activo) {
      return { error: 'La variante seleccionada no existe o no esta activa' }
    }

    if (variante.stockActual < cantidadNumero) {
      return { error: 'No hay stock suficiente para realizar la salida' }
    }

    const nuevoStock = variante.stockActual - cantidadNumero

    try {
      return await this.sequelize.transaction(async (transaction) => {
        const movimiento = await this.modeloMovimientoInventario.create({
          tipoMovimiento: 'SALIDA_AJUSTE',
          cantidad: cantidadNumero,
          motivo,
          documentoRef,
          varianteId,
          usuarioId
        }, { transaction })

        await variante.update({ stockActual: nuevoStock }, { transaction })

        return {
          mensaje: 'Nota de salida registrada con exito',
          movimientoId: movimiento.id,
          varianteId,
          stockActual: nuevoStock
        }
      })
    } catch (error) {
      console.error('Error registrando nota de salida:', error)
      return { error: 'Error al registrar la nota de salida' }
    }
  }

  obtenerHistorialNotasSalida = async ({ pagina = 1, limite = 20 } = {}) => {
    const offset = (pagina - 1) * limite
    try {
      const { count, rows } = await this.modeloMovimientoInventario.findAndCountAll({
        where: { tipoMovimiento: 'SALIDA_AJUSTE' },
        order: [['createdAt', 'DESC']],
        limit: limite,
        offset,
        include: [
          {
            model: this.modeloProductoVariante,
            as: 'variante',
            attributes: ['id', 'talla', 'color', 'codigo', 'stockActual'],
            include: [{
              model: this.modeloProducto,
              as: 'producto',
              attributes: ['id', 'nombre', 'marca', 'categoriaId']
            }]
          },
          {
            model: this.modeloUsuario,
            as: 'usuario',
            attributes: ['id', 'nombre', 'email']
          }
        ]
      })

      const notas = rows.map(movimiento => ({
        id: movimiento.id,
        cantidad: movimiento.cantidad,
        motivo: movimiento.motivo,
        documentoRef: movimiento.documentoRef,
        varianteId: movimiento.varianteId,
        usuario: movimiento.usuario,
        createdAt: movimiento.createdAt,
        variante: movimiento.variante ? {
          id: movimiento.variante.id,
          talla: movimiento.variante.talla,
          color: movimiento.variante.color,
          codigo: movimiento.variante.codigo,
          stockActual: movimiento.variante.stockActual,
          producto: movimiento.variante.producto
        } : null
      }))

      return {
        total: count,
        pagina,
        limite,
        notas
      }
    } catch (error) {
      console.error('Error obteniendo historial de notas de salida:', error)
      return { error: 'No fue posible obtener el historial' }
    }
  }
}
