import { Op } from 'sequelize'
import sequelize from '../../../../config/baseDatos.js'
export class VentaServicio {
  constructor ({
    modeloVenta, modeloProducto, modeloCategoria,
    modeloProductoVariante, modeloPromocion, modeloCliente, modeloDetalleVenta, modeloTransaccionPago,
    modeloMovimientoInventario, modeloVentaPromocion, modeloUsuario, modeloMetodoPago
  }) {
    this.modeloVenta = modeloVenta
    this.modeloProducto = modeloProducto
    this.modeloCategoria = modeloCategoria
    this.modeloProductoVariante = modeloProductoVariante
    this.modeloPromocion = modeloPromocion
    this.modeloCliente = modeloCliente
    this.modeloDetalleVenta = modeloDetalleVenta
    this.modeloTransaccionPago = modeloTransaccionPago
    this.modeloMovimientoInventario = modeloMovimientoInventario
    this.modeloVentaPromocion = modeloVentaPromocion
    this.modeloUsuario = modeloUsuario
    this.modeloMetodoPago = modeloMetodoPago
  }

  FiltrarProductoPorCategoria = async (id) => {
    const hoy = new Date()
    try {
      const whereProducto = { activo: true }

      if (id) {
        whereProducto.categoriaId = id
      }

      const productos = await this.modeloProducto.findAll({
        where: whereProducto,
        attributes: { exclude: ['categoriaId', 'createdAt', 'updatedAt'] },
        include: [
          {
            model: this.modeloCategoria,
            as: 'categoria',
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            where: { activo: true }
          },
          {
            model: this.modeloProductoVariante,
            as: 'variantes',
            attributes: { exclude: ['productoId', 'createdAt', 'updatedAt'] },
            where: { activo: true },
            required: true
          },
          {
            model: this.modeloPromocion,
            as: 'promociones',
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            required: false,
            where: {
              activa: true,
              fechaInicio: { [Op.lte]: hoy },
              fechaFin: { [Op.gte]: hoy }
            }
          }
        ]
      })

      // 🔹 Filtrado manual (en memoria)
      return productos.map(p => {
        const promocionesFiltradas = p.promociones.filter(pr => {
          return (
            pr.aplicaTodo ||
          (pr.aplicaProducto && pr.productoId === p.id) ||
          (pr.aplicaCategoria && pr.categoriaId === p.categoriaId)
          )
        })
        return { ...p.toJSON(), promociones: promocionesFiltradas }
      })
    } catch (e) {
      return { error: `error al consultar en la base de datos: ${e}` }
    }
  }

  BuscarProductos = async (termino = '') => {
    const hoy = new Date()
    try {
      const whereClause = { activo: true }

      // Si hay término de búsqueda, agregar condiciones
      if (termino && termino.trim() !== '') {
        const searchTerm = `%${termino.trim()}%`
        whereClause[Op.or] = [
          { nombre: { [Op.like]: searchTerm } },
          { modelo: { [Op.like]: searchTerm } },
          { marca: { [Op.like]: searchTerm } }
        ]
      }

      const productos = await this.modeloProducto.findAll({
        where: whereClause,
        attributes: { exclude: ['categoriaId', 'createdAt', 'updatedAt'] },
        include: [
          {
            model: this.modeloCategoria,
            as: 'categoria',
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            where: { activo: true }
          },
          {
            model: this.modeloProductoVariante,
            as: 'variantes',
            attributes: { exclude: ['productoId', 'createdAt', 'updatedAt'] },
            required: true,
            where: { activo: true }
          },
          {
            model: this.modeloPromocion,
            as: 'promociones',
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            required: false,
            where: {
              activa: true,
              fechaInicio: { [Op.lte]: hoy },
              fechaFin: { [Op.gte]: hoy }
            }
          }
        ],
        order: [['nombre', 'ASC']]
      })

      return productos.map(p => {
        const promocionesFiltradas = p.promociones.filter(pr => {
          return (
            pr.aplicaTodo ||
          (pr.aplicaProducto && pr.productoId === p.id) ||
          (pr.aplicaCategoria && pr.categoriaId === p.categoriaId)
          )
        })

        const variantesActivas = p.variantes.filter(v => v.activo)

        return {
          ...p.toJSON(),
          promociones: promocionesFiltradas,
          variantes: variantesActivas
        }
      })
    } catch (e) {
      return { error: `error al buscar productos: ${e}` }
    }
  }

  // 1. CREAR VENTA
  crearVenta = async (datosVenta, usuarioId, options) => {
    const transaction = await sequelize.transaction()

    try {
    // Generar número de factura automático
      const nroFactura = await this.generarNumeroFactura()

      // Calcular descuentos y promociones aplicadas
      const { descuentoTotal, promocionesAplicadas } =
      await this.calcularDescuentosVenta(datosVenta.productos)
      // CALCULAR TOTAL CORRECTAMENTE
      // Calcular subtotal real desde productos (evita depender del frontend)
      const subtotalCalculado = datosVenta.productos.reduce(
        (acc, p) => acc + parseFloat(p.precioUnitario) * parseInt(p.cantidad),
        0
      )
      const total = subtotalCalculado - parseFloat(descuentoTotal)
      // Crear la venta principal con subtotal y total reales
      const venta = await this.modeloVenta.create({
        nroFactura,
        subtotal: parseFloat(subtotalCalculado.toFixed(2)),
        descuento: parseFloat(descuentoTotal.toFixed(2)),
        total: parseFloat(total.toFixed(2)),
        estado: datosVenta.estado === 'REGISTRADA' ? datosVenta.estado : 'PAGADA',
        clienteId: datosVenta.clienteId,
        usuarioId
      }, { transaction, ...options })

      // Registrar detalles de venta
      await this.registrarDetalleVenta(venta.id, datosVenta.productos, transaction, options)

      // Si el estado es PAGADA, registrar transacción de pago
      if (datosVenta.estado === 'PAGADA') {
        // Registrar transacción de pago - CON MONTO CORRECTO
        await this.registrarTransaccionPagoVenta({
          ventaId: venta.id,
          metodoPagoId: datosVenta.metodoPagoId,
          monto: total, // USAR EL TOTAL CALCULADO
          referencia: datosVenta.referenciaPago || `PAGO-${nroFactura}`
        }, transaction, options)

        // Registrar movimientos de inventario - SIN DUPLICADOS
        await this.registrarMovimientoInventarioPorVenta(
          venta.id,
          datosVenta.productos,
          datosVenta.usuarioId,
          nroFactura,
          transaction,
          options
        )
      }
      // Registrar promociones aplicadas
      if (promocionesAplicadas.length > 0) {
        for (const promo of promocionesAplicadas) {
          await this.modeloVentaPromocion.create({
            ventaId: venta.id,
            promocionId: promo.promocionId,
            montoDescuento: parseFloat(promo.montoDescuento)
          }, { transaction, ...options })
        }
      }

      await transaction.commit()

      // Obtener venta completa con relaciones
      const ventaCompleta = await this.obtenerVentaPorId(venta.id)
      return ventaCompleta
    } catch (error) {
      await transaction.rollback()
      throw new Error(`Error al crear venta: ${error.message}`)
    }
  }

  // 2. REGISTRAR DETALLE VENTA
  registrarDetalleVenta = async (ventaId, productos, transaction = null, options) => {
    try {
      const detalles = []
      for (const producto of productos) {
        const subtotal = parseFloat(producto.precioUnitario) * parseInt(producto.cantidad)

        const detalle = await this.modeloDetalleVenta.create({
          ventaId,
          varianteId: producto.varianteId,
          cantidad: parseInt(producto.cantidad),
          precioUnitario: parseFloat(producto.precioUnitario),
          subtotal
        }, { transaction, ...options })

        detalles.push(detalle)
      }
      return detalles
    } catch (error) {
      throw new Error(`Error al registrar detalles de venta: ${error.message}`)
    }
  }

  // 3. REGISTRAR TRANSACCIÓN PAGO VENTA - CORREGIDA
  registrarTransaccionPagoVenta = async (datosPago, transaction = null, options) => {
    try {
      const transaccion = await this.modeloTransaccionPago.create({
        tipoTransaccion: 'VENTA',
        ventaId: datosPago.ventaId,
        metodoPagoId: datosPago.metodoPagoId,
        monto: parseFloat(datosPago.monto),
        referencia: datosPago.referencia
      }, { transaction, ...options })

      // Actualizar estado de la venta a PAGADA
      await this.modeloVenta.update(
        { estado: 'PAGADA' },
        {
          where: { id: datosPago.ventaId },
          transaction,
          ...options
        }
      )

      return transaccion
    } catch (error) {
      throw new Error(`Error al registrar transacción de pago: ${error.message}`)
    }
  }

  // 4. REGISTRAR MOVIMIENTO INVENTARIO POR VENTA - CORREGIDA
  registrarMovimientoInventarioPorVenta = async (ventaId, productos, usuarioId, documentoRef, transaction = null, options) => {
    try {
      const movimientos = []

      for (const producto of productos) {
        const cantidad = parseInt(producto.cantidad)

        // VERIFICAR SI YA EXISTE UN MOVIMIENTO PARA ESTA VARIANTE
        const movimientoExistente = await this.modeloMovimientoInventario.findOne({
          where: {
            ventaId,
            varianteId: producto.varianteId,
            tipoMovimiento: 'SALIDA_VENTA'
          },
          transaction
        })

        if (movimientoExistente) {
          continue
        }

        // Crear movimiento de salida - SOLO UNO POR VARIANTE
        const movimiento = await this.modeloMovimientoInventario.create({
          tipoMovimiento: 'SALIDA_VENTA',
          cantidad: -cantidad,
          motivo: `Venta #${documentoRef}`,
          documentoRef,
          varianteId: producto.varianteId,
          ventaId,
          usuarioId
        }, { transaction, ...options })

        movimientos.push(movimiento)
      }

      return movimientos
    } catch (error) {
      throw new Error(`Error al registrar movimiento de inventario: ${error.message}`)
    }
  }

  // 5. ACTUALIZAR VENTA - CORREGIDA
  actualizarVenta = async (ventaId, datosActualizados) => {
    const transaction = await this.modeloVenta.sequelize.transaction()

    try {
      // Verificar que la venta existe y está en estado REGISTRADA
      const ventaExistente = await this.modeloVenta.findByPk(ventaId)
      if (!ventaExistente) {
        return { error: 'Venta no encontrada' }
      }
      if (ventaExistente.estado !== 'REGISTRADA') {
        throw new Error('Solo se pueden actualizar ventas en estado REGISTRADA')
      }

      // Campos permitidos para actualización
      const camposPermitidos = ['clienteId', 'subtotal', 'descuento', 'total']
      const datosParaActualizar = {}

      camposPermitidos.forEach(campo => {
        if (datosActualizados[campo] !== undefined) {
          datosParaActualizar[campo] = datosActualizados[campo]
        }
      })

      // Actualizar venta principal
      await this.modeloVenta.update(datosParaActualizar, {
        where: { id: ventaId },
        transaction
      })

      await transaction.commit()

      const ventaActualizada = await this.obtenerVentaPorId(ventaId)
      return ventaActualizada
    } catch (error) {
      await transaction.rollback()
      throw new Error(`Error al actualizar venta: ${error.message}`)
    }
  }

  // 6. ANULAR VENTA - CORREGIDA
  anularVenta = async (ventaId, usuarioId, motivo = 'Anulación de venta') => {
    const transaction = await this.modeloVenta.sequelize.transaction()

    try {
      // Verificar que la venta existe
      const venta = await this.modeloVenta.findByPk(ventaId, {
        include: [{ model: this.modeloDetalleVenta, as: 'detalles' }]
      })

      if (!venta) {
        throw new Error('Venta no encontrada')
      }

      if (venta.estado === 'ANULADA') {
        throw new Error('La venta ya está anulada')
      }

      // Revertir movimientos de inventario - CORREGIDO según tu ENUM
      for (const detalle of venta.detalles) {
        await this.modeloMovimientoInventario.create({
          tipoMovimiento: 'ENTRADA_DEVOLUCION',
          cantidad: detalle.cantidad, // Positivo porque es entrada
          motivo,
          documentoRef: `ANULACION-${venta.nroFactura || ventaId}`,
          varianteId: detalle.varianteId,
          ventaId,
          usuarioId
        }, { transaction })

        // Restaurar stock
        await this.modeloProductoVariante.increment('stockActual', {
          by: detalle.cantidad,
          where: { id: detalle.varianteId },
          transaction
        })
      }

      // Actualizar estado de la venta
      await this.modeloVenta.update(
        { estado: 'ANULADA' },
        { where: { id: ventaId }, transaction }
      )

      await transaction.commit()

      const ventaAnulada = await this.obtenerVentaPorId(ventaId)
      return {
        message: 'Venta anulada exitosamente',
        venta: ventaAnulada
      }
    } catch (error) {
      await transaction.rollback()
      throw new Error(`Error al anular venta: ${error.message}`)
    }
  }

  // ========== FUNCIONES AUXILIARES CORREGIDAS ==========

  // Generar número de factura automático
  generarNumeroFactura = async () => {
    try {
      const ultimaVenta = await this.modeloVenta.findOne({
        order: [['createdAt', 'DESC']],
        attributes: ['nroFactura']
      })

      let siguienteNumero = 1
      if (ultimaVenta && ultimaVenta.nroFactura) {
        const matches = ultimaVenta.nroFactura.match(/\d+/)
        if (matches) {
          siguienteNumero = parseInt(matches[0]) + 1
        }
      }

      return `FACT-${siguienteNumero.toString().padStart(6, '0')}`
    } catch (error) {
      // Si hay error, generar número basado en timestamp
      return `FACT-${Date.now()}`
    }
  }

  // Calcular descuentos para una venta
  calcularDescuentosVenta = async (productosVenta) => {
    const hoy = new Date()
    let descuentoTotal = 0
    const promocionesAplicadas = []

    // Agrupar productos por promociones aplicables
    const promocionesUnicas = new Map()

    for (const item of productosVenta) {
      const variante = await this.modeloProductoVariante.findByPk(item.varianteId, {
        include: [{
          model: this.modeloProducto,
          as: 'producto',
          include: [{ model: this.modeloCategoria, as: 'categoria' }]
        }]
      })

      if (!variante || !variante.producto) continue

      const promociones = await this.modeloPromocion.findAll({
        where: {
          activa: true,
          fechaInicio: { [Op.lte]: hoy },
          fechaFin: { [Op.gte]: hoy },
          [Op.or]: [
            { aplicaTodo: true },
            { aplicaProducto: true, productoId: variante.producto.id },
            { aplicaCategoria: true, categoriaId: variante.producto.categoriaId }
          ]
        }
      })

      for (const promocion of promociones) {
      // Usar precioOriginal del frontend si está disponible
        const precioBase = item.precioOriginal || parseFloat(variante.precioVenta)
        const cantidad = parseInt(item.cantidad)
        const subtotalItem = precioBase * cantidad

        // Si ya tenemos esta promoción, acumular el descuento
        if (promocionesUnicas.has(promocion.id)) {
          const descuentoExistente = promocionesUnicas.get(promocion.id)
          const nuevoDescuento = this.calcularDescuentoItem({
            precioUnitario: precioBase,
            cantidad,
            subtotal: subtotalItem
          }, promocion)
          promocionesUnicas.set(promocion.id, descuentoExistente + nuevoDescuento)
        } else {
        // Primera vez que encontramos esta promoción
          const montoDescuento = this.calcularDescuentoItem({
            precioUnitario: precioBase,
            cantidad,
            subtotal: subtotalItem
          }, promocion)
          if (montoDescuento > 0) {
            promocionesUnicas.set(promocion.id, montoDescuento)
          }
        }
      }
    }

    // Convertir el Map a array de promociones aplicadas
    for (const [promocionId, montoDescuento] of promocionesUnicas) {
      if (montoDescuento > 0) {
        descuentoTotal += montoDescuento
        promocionesAplicadas.push({
          promocionId,
          montoDescuento
        })
      }
    }
    return {
      descuentoTotal: parseFloat(descuentoTotal.toFixed(2)),
      promocionesAplicadas
    }
  }

  // Lógica de cálculo de descuentos por tipo
  calcularDescuentoItem = (item, promocion) => {
    const subtotal = parseFloat(item.precioUnitario) * parseInt(item.cantidad)

    switch (promocion.tipo) {
      case 'PORCENTAJE':
        return subtotal * (parseFloat(promocion.valorDescuento) / 100)

      case 'MONTO_FIJO':
        return Math.min(parseFloat(promocion.valorDescuento), subtotal)

      case '2X1': {
        const pares = Math.floor(parseInt(item.cantidad) / 2)
        return pares * parseFloat(item.precioUnitario)
      }

      case '3X2': {
        const grupos = Math.floor(parseInt(item.cantidad) / 3)
        return grupos * parseFloat(item.precioUnitario)
      }

      default:
        return 0
    }
  }

  // ========== FUNCIONES ADICIONALES ÚTILES ==========

  // Obtener venta por ID con todas las relaciones
  obtenerVentaPorId = async (ventaId) => {
    try {
      const venta = await this.modeloVenta.findByPk(ventaId, {
        include: [
          { model: this.modeloCliente, as: 'cliente' },
          { model: this.modeloUsuario, as: 'usuario' },
          {
            model: this.modeloDetalleVenta,
            as: 'detalles',
            include: [{
              model: this.modeloProductoVariante,
              as: 'variante',
              include: [{ model: this.modeloProducto, as: 'producto' }]
            }]
          },
          { model: this.modeloTransaccionPago, as: 'pagos' },
          { model: this.modeloPromocion, as: 'promociones' },
          { model: this.modeloMovimientoInventario, as: 'movimientos' }
        ]
      })

      if (!venta) {
        throw new Error('Venta no encontrada')
      }

      return venta
    } catch (error) {
      throw new Error(`Error al obtener venta: ${error.message}`)
    }
  }

  // Listar todas las ventas con paginación
  listarVentas = async (pagina = 1, limite = 10, filtros = {}) => {
    try {
      const offset = (pagina - 1) * limite

      const whereClause = {}
      if (filtros.estado) whereClause.estado = filtros.estado
      if (filtros.clienteId) whereClause.clienteId = filtros.clienteId
      if (filtros.fechaInicio && filtros.fechaFin) {
        whereClause.createdAt = {
          [Op.between]: [new Date(filtros.fechaInicio), new Date(filtros.fechaFin)]
        }
      }

      const { count, rows } = await this.modeloVenta.findAndCountAll({
        where: whereClause,
        include: [
          { model: this.modeloCliente, as: 'cliente' },
          { model: this.modeloUsuario, as: 'usuario' },
          { model: this.modeloTransaccionPago, as: 'pagos' }
        ],
        order: [['createdAt', 'DESC']],
        limit: parseInt(limite),
        offset: parseInt(offset)
      })

      return {
        ventas: rows,
        total: count,
        pagina: parseInt(pagina),
        totalPaginas: Math.ceil(count / parseInt(limite))
      }
    } catch (error) {
      throw new Error(`Error al listar ventas: ${error.message}`)
    }
  }

  obtenerMetodosPago = async () => {
    try {
      const metodosPago = await this.modeloMetodoPago.findAll({
        where: { activo: true },
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        order: [['nombre', 'ASC']]
      })

      return metodosPago
    } catch (error) {
      throw new Error(`Error al obtener métodos de pago: ${error.message}`)
    }
  }

  // Obtener todos los clientes
  obtenerClientes = async () => {
    try {
      const clientes = await this.modeloCliente.findAll({
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        order: [['nombre', 'ASC']]
      })

      return clientes
    } catch (error) {
      throw new Error(`Error al obtener clientes: ${error.message}`)
    }
  }

  // Obtener cliente por ID (útil para edición)
  obtenerClientePorId = async (clienteId) => {
    try {
      const cliente = await this.modeloCliente.findByPk(clienteId)

      if (!cliente) {
        throw new Error('Cliente no encontrado')
      }

      return cliente
    } catch (error) {
      throw new Error(`Error al obtener cliente: ${error.message}`)
    }
  }

  marcarComoPagada = async (ventaId, metodoPagoId, referenciaPago, usuarioId) => {
    const transaction = await sequelize.transaction()

    try {
    // Verificar que la venta existe y está en estado REGISTRADA
      const ventaExistente = await this.modeloVenta.findByPk(ventaId, {
        include: [{ model: this.modeloDetalleVenta, as: 'detalles' }]
      })

      if (!ventaExistente) {
        throw new Error('Venta no encontrada')
      }

      if (ventaExistente.estado !== 'REGISTRADA') {
        throw new Error('Solo se pueden marcar como pagadas las ventas en estado REGISTRADA')
      }

      // Registrar transacción de pago
      await this.registrarTransaccionPagoVenta({
        ventaId,
        metodoPagoId,
        monto: parseFloat(ventaExistente.total),
        referencia: referenciaPago || `PAGO-${ventaExistente.nroFactura}`
      }, transaction)

      // Registrar movimientos de inventario (si no existen ya)
      await this.registrarMovimientoInventarioPorVenta(
        ventaId,
        ventaExistente.detalles.map(detalle => ({
          varianteId: detalle.varianteId,
          cantidad: detalle.cantidad,
          precioUnitario: detalle.precioUnitario
        })),
        usuarioId,
        ventaExistente.nroFactura,
        transaction
      )

      await transaction.commit()

      // Obtener venta actualizada
      const ventaActualizada = await this.obtenerVentaPorId(ventaId)
      return ventaActualizada
    } catch (error) {
      await transaction.rollback()
      throw new Error(`Error al marcar venta como pagada: ${error.message}`)
    }
  }
}
