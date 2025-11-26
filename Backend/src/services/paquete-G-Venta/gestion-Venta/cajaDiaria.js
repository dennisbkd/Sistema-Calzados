import { Op } from 'sequelize'

export class CajaDiariaServicio {
  constructor ({ modeloVenta, modeloTransaccionPago, modeloMetodoPago, modeloCompra, modeloUsuario }) {
    this.modeloVenta = modeloVenta
    this.modeloTransaccionPago = modeloTransaccionPago
    this.modeloMetodoPago = modeloMetodoPago
    this.modeloCompra = modeloCompra
    this.modeloUsuario = modeloUsuario
  }

  obtenerResumenCajaDiaria = async ({ fecha, usuarioId }) => {
    try {
      // Definir el rango del día (desde las 00:00 hasta las 23:59)
      const fechaInicio = new Date(fecha)
      fechaInicio.setHours(0, 0, 0, 0)

      const fechaFin = new Date(fecha)
      fechaFin.setHours(23, 59, 59, 999)

      // Obtener todas las transacciones de ventas del día
      const transaccionesVentas = await this.modeloTransaccionPago.findAll({
        where: {
          tipoTransaccion: 'VENTA',
          createdAt: {
            [Op.between]: [fechaInicio, fechaFin]
          }
        },
        include: [
          {
            model: this.modeloVenta,
            as: 'venta',
            attributes: ['id', 'nroFactura', 'total', 'estado'],
            where: {
              estado: 'PAGADA'
            },
            include: [
              {
                model: this.modeloUsuario,
                as: 'usuario',
                attributes: ['id', 'nombre']
              }
            ]
          },
          {
            model: this.modeloMetodoPago,
            as: 'metodoPago',
            attributes: ['id', 'nombre']
          }
        ],
        order: [['createdAt', 'ASC']]
      })

      // Obtener todas las transacciones de compras del día
      const transaccionesCompras = await this.modeloTransaccionPago.findAll({
        where: {
          tipoTransaccion: 'COMPRA',
          createdAt: {
            [Op.between]: [fechaInicio, fechaFin]
          }
        },
        include: [
          {
            model: this.modeloCompra,
            as: 'compra',
            attributes: ['id', 'nroFactura', 'total', 'estado'],
            where: {
              estado: 'PAGADA'
            }
          },
          {
            model: this.modeloMetodoPago,
            as: 'metodoPago',
            attributes: ['id', 'nombre']
          }
        ],
        order: [['createdAt', 'ASC']]
      })

      // Calcular totales por método de pago para ventas
      const totalesVentasPorMetodo = {}
      let totalVentasEfectivo = 0
      let totalVentasTarjeta = 0
      let totalVentasTransferencia = 0
      let totalVentas = 0

      transaccionesVentas.forEach(transaccion => {
        const metodoPago = transaccion.metodoPago.nombre
        const monto = parseFloat(transaccion.monto)

        if (!totalesVentasPorMetodo[metodoPago]) {
          totalesVentasPorMetodo[metodoPago] = 0
        }
        totalesVentasPorMetodo[metodoPago] += monto

        // Clasificar por tipo común de pago
        if (metodoPago.toLowerCase().includes('efectivo')) {
          totalVentasEfectivo += monto
        } else if (metodoPago.toLowerCase().includes('tarjeta')) {
          totalVentasTarjeta += monto
        } else if (metodoPago.toLowerCase().includes('transferencia')) {
          totalVentasTransferencia += monto
        }

        totalVentas += monto
      })

      // Calcular totales por método de pago para compras
      const totalesComprasPorMetodo = {}
      let totalComprasEfectivo = 0
      let totalComprasTarjeta = 0
      let totalComprasTransferencia = 0
      let totalCompras = 0

      transaccionesCompras.forEach(transaccion => {
        const metodoPago = transaccion.metodoPago.nombre
        const monto = parseFloat(transaccion.monto)

        if (!totalesComprasPorMetodo[metodoPago]) {
          totalesComprasPorMetodo[metodoPago] = 0
        }
        totalesComprasPorMetodo[metodoPago] += monto

        // Clasificar por tipo común de pago
        if (metodoPago.toLowerCase().includes('efectivo')) {
          totalComprasEfectivo += monto
        } else if (metodoPago.toLowerCase().includes('tarjeta')) {
          totalComprasTarjeta += monto
        } else if (metodoPago.toLowerCase().includes('transferencia')) {
          totalComprasTransferencia += monto
        }

        totalCompras += monto
      })

      // Calcular saldo final
      const saldoFinalEfectivo = totalVentasEfectivo - totalComprasEfectivo
      const saldoFinalTarjeta = totalVentasTarjeta - totalComprasTarjeta
      const saldoFinalTransferencia = totalVentasTransferencia - totalComprasTransferencia
      const saldoFinalTotal = totalVentas - totalCompras

      // Preparar respuesta
      const resumen = {
        fecha: fechaInicio.toISOString().split('T')[0],
        ventas: {
          total: totalVentas,
          porMetodo: totalesVentasPorMetodo,
          transacciones: transaccionesVentas.map(t => ({
            id: t.id,
            nroFactura: t.venta.nroFactura,
            metodoPago: t.metodoPago.nombre,
            monto: t.monto,
            fecha: t.createdAt,
            usuario: t.venta.usuario.nombre
          }))
        },
        compras: {
          total: totalCompras,
          porMetodo: totalesComprasPorMetodo,
          transacciones: transaccionesCompras.map(t => ({
            id: t.id,
            nroFactura: t.compra.nroFactura,
            metodoPago: t.metodoPago.nombre,
            monto: t.monto,
            fecha: t.createdAt
          }))
        },
        resumenPorMetodo: {
          efectivo: {
            ventas: totalVentasEfectivo,
            compras: totalComprasEfectivo,
            saldo: saldoFinalEfectivo
          },
          tarjeta: {
            ventas: totalVentasTarjeta,
            compras: totalComprasTarjeta,
            saldo: saldoFinalTarjeta
          },
          transferencia: {
            ventas: totalVentasTransferencia,
            compras: totalComprasTransferencia,
            saldo: saldoFinalTransferencia
          }
        },
        saldoFinalTotal,
        totalTransacciones: transaccionesVentas.length + transaccionesCompras.length
      }

      return resumen
    } catch (e) {
      console.error('Error en obtenerResumenCajaDiaria:', e)
      return { error: 'Error al obtener el resumen de caja diaria', detalle: e.message }
    }
  }

  obtenerMovimientosPorFecha = async ({ fechaInicio, fechaFin, usuarioId }) => {
    try {
      const inicio = new Date(fechaInicio)
      inicio.setHours(0, 0, 0, 0)

      const fin = new Date(fechaFin)
      fin.setHours(23, 59, 59, 999)

      const transacciones = await this.modeloTransaccionPago.findAll({
        where: {
          createdAt: {
            [Op.between]: [inicio, fin]
          }
        },
        include: [
          {
            model: this.modeloVenta,
            as: 'venta',
            attributes: ['id', 'nroFactura', 'total', 'estado'],
            include: [
              {
                model: this.modeloUsuario,
                as: 'usuario',
                attributes: ['id', 'nombre']
              }
            ]
          },
          {
            model: this.modeloCompra,
            as: 'compra',
            attributes: ['id', 'nroFactura', 'total', 'estado']
          },
          {
            model: this.modeloMetodoPago,
            as: 'metodoPago',
            attributes: ['id', 'nombre']
          }
        ],
        order: [['createdAt', 'DESC']]
      })

      const movimientos = transacciones.map(transaccion => ({
        id: transaccion.id,
        tipo: transaccion.tipoTransaccion,
        nroFactura: transaccion.tipoTransaccion === 'VENTA'
          ? transaccion.venta?.nroFactura
          : transaccion.compra?.nroFactura,
        metodoPago: transaccion.metodoPago.nombre,
        monto: transaccion.monto,
        fecha: transaccion.createdAt,
        usuario: transaccion.tipoTransaccion === 'VENTA'
          ? transaccion.venta?.usuario?.nombre
          : 'Sistema',
        estado: transaccion.tipoTransaccion === 'VENTA'
          ? transaccion.venta?.estado
          : transaccion.compra?.estado
      }))

      return movimientos
    } catch (e) {
      console.error('Error en obtenerMovimientosPorFecha:', e)
      return { error: 'Error al obtener movimientos', detalle: e.message }
    }
  }
}
