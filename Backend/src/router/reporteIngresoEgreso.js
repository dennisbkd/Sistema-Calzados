import { Router } from 'express'
import { ReporteIngresoEgresoControlador } from '../controller/reportes/reportesIngresosEgresos/reporteIngresoEgreso.js'

export const rutaReporteIngresoEgreso = ({ reporteIngresoEgresoServicio }) => {
  const router = Router()
  const reporteController = new ReporteIngresoEgresoControlador({ reporteIngresoEgresoServicio })

  router.get('/ingresos-egresos', reporteController.reporteIngresosEgresos)

  return router
}
