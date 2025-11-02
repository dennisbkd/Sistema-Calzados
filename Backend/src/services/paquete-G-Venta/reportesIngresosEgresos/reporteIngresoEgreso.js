import { Op } from 'sequelize'

export class ReporteIngresoEgresoServicio {
  constructor ({ modeloCompra, modeloVenta }) {
    this.modeloCompra = modeloCompra
    this.modeloVenta = modeloVenta
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
}
