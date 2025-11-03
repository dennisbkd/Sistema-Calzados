import { Router } from 'express'
import { ReporteIngresoEgresoControlador } from '../controller/paquete-G-Venta/reportesIngresosEgresos/reporteIngresoEgreso.js'

export const rutaReporteIngresoEgreso = ({ reporteIngresoEgresoServicio }) => {
  const router = Router()
  const reporteController = new ReporteIngresoEgresoControlador({ reporteIngresoEgresoServicio })

  router.get('/ingresos-egresos', reporteController.reporteIngresosEgresos)
  router.get('/listarComprasxFecha', reporteController.listarComprasFecha)
  router.get('/listarVentasxFecha', reporteController.listarVentasFecha)
  return router
}
