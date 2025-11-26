import { Op } from 'sequelize'

/**
 * Servicio encargado de calcular el balance diario de caja.
 * Recibe las ventas/compras del día que no estén anuladas y entrega
 * totales de ingresos, egresos y el saldo disponible.
 */
export class ControlCajaServicio {
  constructor ({ modeloVenta, modeloCompra }) {
    this.modeloVenta = modeloVenta
    this.modeloCompra = modeloCompra
  }

  obtenerBalance = async ({ fecha } = {}) => {
    let referencia
    if (fecha) {
      const [year, month, day] = fecha.split('-').map(Number)
      referencia = new Date(year, month - 1, day)
    } else {
      referencia = new Date()
    }
    if (Number.isNaN(referencia.getTime())) {
      return { error: 'Fecha inválida' }
    }

    const inicioDia = new Date(referencia)
    inicioDia.setHours(0, 0, 0, 0)
    const finDia = new Date(referencia)
    finDia.setHours(23, 59, 59, 999)

    const fechaISO = `${inicioDia.getFullYear()}-${String(inicioDia.getMonth() + 1).padStart(2, '0')}-${String(inicioDia.getDate()).padStart(2, '0')}`
    const filtroFechaVenta = this.modeloVenta.sequelize.where(
      this.modeloVenta.sequelize.fn('DATE', this.modeloVenta.sequelize.col('Venta.createdAt')),
      fechaISO
    )
    const filtroFechaCompra = this.modeloCompra.sequelize.where(
      this.modeloCompra.sequelize.fn('DATE', this.modeloCompra.sequelize.col('Compra.createdAt')),
      fechaISO
    )

    try {
      const ventas = await this.modeloVenta.findAll({
        where: {
          estado: { [Op.ne]: 'ANULADA' },
          [Op.and]: filtroFechaVenta
        },
        attributes: ['id', 'nroFactura', 'total', 'estado', 'createdAt'],
        include: [{
          association: 'cliente',
          attributes: ['nombre']
        }],
        order: [['createdAt', 'ASC']]
      })
      const compras = await this.modeloCompra.findAll({
        where: {
          estado: { [Op.ne]: 'ANULADA' },
          [Op.and]: filtroFechaCompra
        },
        attributes: ['id', 'nroFactura', 'total', 'estado', 'createdAt'],
        include: [{
          association: 'proveedor',
          attributes: ['nombre']
        }],
        order: [['createdAt', 'ASC']]
      })

      const totalIngresos = ventas.reduce((sum, venta) => sum + Number(venta.total), 0)
      const totalEgresos = compras.reduce((sum, compra) => sum + Number(compra.total), 0)

      const sinMovimientos = ventas.length === 0 && compras.length === 0
      const respuesta = {
        fecha: fechaISO,
        totalIngresos: Number(totalIngresos),
        totalEgresos: Number(totalEgresos),
        saldo: Number(totalIngresos) - Number(totalEgresos),
        sinMovimientos,
        ventas: ventas.map(v => ({
          id: v.id,
          nroFactura: v.nroFactura,
          total: Number(v.total),
          estado: v.estado,
          fecha: v.createdAt,
          detalle: v.cliente ? v.cliente.nombre : ''
        })),
        compras: compras.map(c => ({
          id: c.id,
          nroFactura: c.nroFactura,
          total: Number(c.total),
          estado: c.estado,
          fecha: c.createdAt,
          detalle: c.proveedor ? c.proveedor.nombre : ''
        }))
      }

      if (sinMovimientos) {
        respuesta.mensaje = 'Sin movimientos registrados para la fecha indicada'
      }

      return respuesta
    } catch (error) {
      console.error('ControlCajaServicio.obtenerBalance falló:', error)
      return { error: 'No fue posible calcular el balance de caja' }
    }
  }
}
