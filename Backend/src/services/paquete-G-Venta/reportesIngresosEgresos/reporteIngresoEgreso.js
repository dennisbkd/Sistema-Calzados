import { Op } from 'sequelize'

export class ReporteIngresoEgresoServicio {
  constructor ({ modeloCompra, modeloVenta, modeloUsuario, modeloProveedor, modeloDetalleCompra, modeloProductoVariante, modeloProducto, modeloCliente, modeloDetalleVenta }) {
    this.modeloCompra = modeloCompra
    this.modeloVenta = modeloVenta
    this.modeloUsuario = modeloUsuario
    this.modeloProveedor = modeloProveedor
    this.modeloDetalleCompra = modeloDetalleCompra
    this.modeloProductoVariante = modeloProductoVariante
    this.modeloProducto = modeloProducto
    this.modeloCliente = modeloCliente
    this.modeloDetalleVenta = modeloDetalleVenta
  }

  // Reporte de ingresos vs egresos
  reporteIngresosEgresos = async ({ fechaInicio, fechaFin }) => {
    try {
      const ventas = await this.modeloVenta.findAll({
        where: {
          estado: 'PAGADA',
          createdAt: {
            [Op.between]: [new Date(fechaInicio), new Date(fechaFin)]
          }
        },
        attributes: ['id', 'total', 'createdAt']
      })

      const compras = await this.modeloCompra.findAll({
        where: {
          estado: 'PAGADA',
          createdAt: {
            [Op.between]: [new Date(fechaInicio), new Date(fechaFin)]
          }
        },
        attributes: ['id', 'total', 'createdAt']
      })

      const totalIngresos = ventas.reduce((sum, venta) => sum + parseFloat(venta.total), 0)
      const totalEgresos = compras.reduce((sum, compra) => sum + parseFloat(compra.total), 0)
      const balance = totalIngresos - totalEgresos

      return {
        periodo: { fechaInicio, fechaFin },
        resumen: {
          totalIngresos: Number(totalIngresos.toFixed(2)),
          totalEgresos: Number(totalEgresos.toFixed(2)),
          balance: Number(balance.toFixed(2)),
          margen: totalIngresos > 0 ? ((balance / totalIngresos) * 100).toFixed(2) : 0,
          cantidadVentas: ventas.length,
          cantidadCompras: compras.length
        }
      }
    } catch (error) {
      throw new Error('Error al generar reporte de ingresos/egresos: ' + error.message)
    }
  }

  listarComprasFecha = async ({ fechaInicio, fechaFin }) => {
    const inicio = new Date(fechaInicio)
    const fin = new Date(fechaFin)

    fin.setHours(23, 59, 59, 999)

    const compras = await this.modeloCompra.findAll({
      where: {
        estado: 'PAGADA',
        createdAt: {
          [Op.between]: [inicio, fin]
        }
      },
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
                {
                  model: this.modeloProducto,
                  as: 'producto',
                  attributes: ['nombre', 'marca']
                }
              ]
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
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

  listarVentasFecha = async ({ fechaInicio, fechaFin }) => {
    const inicio = new Date(fechaInicio)
    const fin = new Date(fechaFin)
    fin.setHours(23, 59, 59, 999)

    const ventas = await this.modeloVenta.findAll({
      where: {
        estado: 'PAGADA', // Solo ventas pagadas
        createdAt: {
          [Op.between]: [inicio, fin]
        }
      },
      include: [
        {
          model: this.modeloCliente,
          attributes: ['nombre', 'ci'],
          as: 'cliente'
        },
        {
          model: this.modeloUsuario,
          attributes: ['nombre'],
          as: 'usuario'
        },
        {
          model: this.modeloDetalleVenta,
          as: 'detalles',
          include: [
            {
              model: this.modeloProductoVariante,
              as: 'variante',
              attributes: ['talla', 'color', 'codigo'],
              include: [
                {
                  model: this.modeloProducto,
                  as: 'producto',
                  attributes: ['nombre', 'marca']
                }
              ]
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    })

    return ventas.map(v => {
      const fechaVenta = new Date(v.createdAt)
      const fechaRegistrada = fechaVenta.toISOString().split('T')[0]
      const horaVenta = fechaVenta.toTimeString().split(' ')[0]

      const detalles = v.detalles.map(d => ({
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
        id: v.id,
        nroFactura: v.nroFactura,
        subtotal: v.subtotal,
        descuento: v.descuento,
        total: v.total,
        estado: v.estado,
        cliente: v.cliente?.nombre || 'Cliente General',
        ciCliente: v.cliente?.ci || null,
        usuario: v.usuario?.nombre || null,
        fechaVenta: fechaRegistrada,
        horaVenta,
        detalles
      }
    })
  }
}
