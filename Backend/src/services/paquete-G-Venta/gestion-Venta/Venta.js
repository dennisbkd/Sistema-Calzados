import { Op } from 'sequelize'
import sequelize from '../../../../config/baseDatos.js'
export class VentaServicio {
  constructor ({
    modeloVenta, modeloProducto, modeloCategoria,
    modeloProductoVariante, modeloPromocion, modeloCliente, modeloDetalleVenta, modeloTransaccionPago,
    modeloMovimientoInventario, modeloVentaPromocion, modeloUsuario, modeloMetodoPago, stripeServicio, mailer
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
    this.stripeServicio = stripeServicio
    this.mailer = mailer
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

  // funciones para stripe

  actualizarSessionPago = async (ventaId, sessionId) => {
    try {
      await this.modeloVenta.update(
        { sessionPagoId: sessionId },
        { where: { id: ventaId } }
      )
    } catch (error) {
      throw new Error(`Error actualizando session de pago: ${error.message}`)
    }
  }

  procesarPagoExitoso = async (ventaId, sessionId, paymentIntentId) => {
    const transaction = await sequelize.transaction()

    try {
      const venta = await this.modeloVenta.findByPk(ventaId, {
        include: [
          {
            model: this.modeloDetalleVenta,
            as: 'detalles',
            include: [{
              model: this.modeloProductoVariante,
              as: 'variante',
              include: [{
                model: this.modeloProducto,
                as: 'producto'
              }]
            }]
          },
          {
            model: this.modeloCliente,
            as: 'cliente'
          }
        ]
      })

      if (!venta) {
        throw new Error('Venta no encontrada')
      }
      // Registrar transacción de pago
      await this.registrarTransaccionPagoVenta({
        ventaId,
        metodoPagoId: 2,
        monto: parseFloat(venta.total),
        referencia: `STRIPE-${paymentIntentId.id}`
      }, transaction)

      // Registrar movimientos de inventario
      await this.registrarMovimientoInventarioPorVenta(
        ventaId,
        venta.detalles.map(detalle => ({
          varianteId: detalle.varianteId,
          cantidad: detalle.cantidad,
          precioUnitario: detalle.precioUnitario
        })),
        venta.usuarioId,
        venta.nroFactura,
        transaction
      )

      // Actualizar venta
      await this.modeloVenta.update(
        {
          estado: 'PAGADA',
          sessionPagoId: sessionId
        },
        { where: { id: ventaId }, transaction }
      )

      await transaction.commit()

      await this.enviarEmailConfirmacion(venta)

      return venta
    } catch (error) {
      await transaction.rollback()
      throw new Error(`Error procesando pago exitoso: ${error.message}`)
    }
  }

  // En VentaServicio - función verificarEstadoPagoStripe
  verificarEstadoPagoStripe = async (ventaId) => {
    try {
      const venta = await this.modeloVenta.findByPk(ventaId)

      if (!venta) {
        return { estado: 'venta_no_encontrada' }
      }

      // Si ya está pagada, retornar directamente
      if (venta.estado === 'PAGADA') {
        return { estado: 'pagado', venta }
      }

      // Si no tiene sessionPagoId, no podemos verificar con Stripe
      if (!venta.sessionPagoId) {
        return { estado: 'no_session', venta }
      }

      // Verificar con Stripe
      const session = await this.stripeServicio.verificarPago(venta.sessionPagoId)

      // Si el pago está completo en Stripe pero no en nuestra DB, procesarlo
      if (session.payment_status === 'paid' && venta.estado !== 'PAGADA') {
        await this.procesarPagoExitoso(
          ventaId,
          venta.sessionPagoId,
          session.payment_intent
        )
        return { estado: 'pagado', venta: await this.modeloVenta.findByPk(ventaId) }
      }

      return {
        estado: session.payment_status,
        session,
        venta
      }
    } catch (error) {
      console.error('Error verificando estado de pago:', error)
      return { estado: 'error', error: error.message }
    }
  }

  // En tu VentaServicio - agrega esta función
  enviarEmailConfirmacion = async (venta) => {
    try {
      if (!this.mailer) {
        console.warn('Mailer no configurado, omitiendo envío de email')
        return
      }

      // ✅ VERIFICAR QUE TENEMOS LOS DATOS NECESARIOS
      if (!venta.detalles || venta.detalles.length === 0) {
        console.warn('Venta sin detalles, no se puede enviar email')
        return
      }

      const cliente = venta?.cliente || await this.modeloCliente.findByPk(venta.clienteId)

      if (!cliente?.contacto) {
        console.warn('No hay email de contacto para el cliente')
        return
      }

      // ✅ MANEJAR POSIBLES VALORES NULOS EN LOS DETALLES
      const detallesProductos = venta.detalles.map(detalle => {
        const productoNombre = detalle.variante?.producto?.nombre || 'Producto no disponible'
        const talla = detalle.variante?.talla || 'N/A'
        const color = detalle.variante?.color || 'N/A'
        const precioUnitario = parseFloat(detalle.precioUnitario || 0).toFixed(2)
        const subtotal = parseFloat(detalle.subtotal || 0).toFixed(2)

        return `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">
          ${productoNombre} - 
          Talla: ${talla}, 
          Color: ${color}
        </td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">
          ${detalle.cantidad || 0}
        </td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">
          Bs ${precioUnitario}
        </td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">
          Bs ${subtotal}
        </td>
      </tr>
      `
      }).join('')

      // Construir el HTML del email (tu código existente)
      const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .success-icon { font-size: 48px; margin-bottom: 20px; }
          .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          table { width: 100%; border-collapse: collapse; }
          th { background: #f8f9fa; padding: 12px; text-align: left; border-bottom: 2px solid #dee2e6; }
          .total { font-size: 18px; font-weight: bold; color: #28a745; }
          .footer { text-align: center; margin-top: 30px; color: #6c757d; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="success-icon">✅</div>
            <h1>¡Pago Confirmado!</h1>
            <p>Tu compra ha sido procesada exitosamente</p>
          </div>
          
          <div class="content">
            <div class="details">
              <h2>Detalles de la Compra</h2>
              
              <p><strong>Número de Factura:</strong> ${venta.nroFactura}</p>
              <p><strong>Fecha:</strong> ${new Date(venta.createdAt).toLocaleDateString('es-BO', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</p>
              <p><strong>Cliente:</strong> ${cliente?.nombre || 'Cliente'}</p>
              
              <h3 style="margin-top: 25px;">Productos Comprados</h3>
              <table>
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th style="text-align: center;">Cantidad</th>
                    <th style="text-align: right;">Precio Unit.</th>
                    <th style="text-align: right;">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  ${detallesProductos}
                </tbody>
              </table>
              
              <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #dee2e6;">
                <table>
                  <tr>
                    <td style="padding: 8px; text-align: right;"><strong>Subtotal:</strong></td>
                    <td style="padding: 8px; text-align: right; width: 100px;">Bs ${parseFloat(venta.subtotal || 0).toFixed(2)}</td>
                  </tr>
                  ${parseFloat(venta.descuento || 0) > 0
? `
                  <tr>
                    <td style="padding: 8px; text-align: right;"><strong>Descuento:</strong></td>
                    <td style="padding: 8px; text-align: right; color: #dc3545;">-Bs ${parseFloat(venta.descuento).toFixed(2)}</td>
                  </tr>
                  `
: ''}
                  <tr>
                    <td style="padding: 8px; text-align: right;"><strong class="total">Total Pagado:</strong></td>
                    <td style="padding: 8px; text-align: right;" class="total">Bs ${parseFloat(venta.total || 0).toFixed(2)}</td>
                  </tr>
                </table>
              </div>
            </div>
            
            <div style="background: #e7f3ff; padding: 15px; border-radius: 8px; border-left: 4px solid #007bff;">
              <h3 style="margin: 0 0 10px 0; color: #0056b3;">📦 Información de Entrega</h3>
              <p style="margin: 0;">Tu pedido está siendo procesado y será enviado pronto.</p>
              <p style="margin: 10px 0 0 0;">Recibirás una notificación cuando tu pedido sea despachado.</p>
            </div>
            
            <div class="footer">
              <p>Gracias por tu compra en <strong>${process.env.APP_NAME || 'Nuestra Tienda'}</strong></p>
              <p>Si tienes alguna pregunta, contáctanos en ${process.env.SUPPORT_EMAIL || 'soporte@tienda.com'}</p>
              <p style="font-size: 12px; color: #999;">
                Este es un email automático, por favor no respondas a este mensaje.
              </p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `

      // Versión texto plano
      const textContent = `
      CONFIRMACIÓN DE PAGO EXITOSO
      
      ¡Gracias por tu compra!
      
      Número de Factura: ${venta.nroFactura}
      Fecha: ${new Date(venta.createdAt).toLocaleDateString('es-BO')}
      Cliente: ${cliente?.nombre || 'Cliente'}
      
      DETALLES DE LA COMPRA:
      ${venta.detalles.map(detalle => {
        const productoNombre = detalle.variante?.producto?.nombre || 'Producto no disponible'
        const talla = detalle.variante?.talla || 'N/A'
        const color = detalle.variante?.color || 'N/A'
        return `- ${productoNombre} (Talla: ${talla}, Color: ${color}): ${detalle.cantidad} x Bs ${parseFloat(detalle.precioUnitario || 0).toFixed(2)} = Bs ${parseFloat(detalle.subtotal || 0).toFixed(2)}`
      }).join('\n')}
      
      RESUMEN:
      Subtotal: Bs ${parseFloat(venta.subtotal || 0).toFixed(2)}
      ${parseFloat(venta.descuento || 0) > 0 ? `Descuento: -Bs ${parseFloat(venta.descuento).toFixed(2)}` : ''}
      TOTAL PAGADO: Bs ${parseFloat(venta.total || 0).toFixed(2)}
      
      Tu pedido está siendo procesado y te notificaremos cuando sea enviado.
      
      Si tienes preguntas, contacta a: ${process.env.SUPPORT_EMAIL || 'soporte@tienda.com'}
      
      Este es un email automático, por favor no respondas.
    `

      // Enviar el email
      await this.mailer.enviar({
        from: `"Confirmación de Pago" <${process.env.SMTP_USER}>`,
        to: cliente?.contacto,
        subject: `✅ Confirmación de Pago - Factura ${venta.nroFactura}`,
        text: textContent,
        html: htmlContent
      })
    } catch (error) {
      console.error('❌ Error enviando email de confirmación:', error)
    }
  }
}
