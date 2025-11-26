import { Router } from 'express'
import { CajaDiariaControlador } from '../controller/paquete-G-Venta/gestion-Venta/cajaDiaria.js'

export const rutaCajaDiaria = ({ cajaDiariaServicio }) => {
  const ruta = Router()
  const cajaDiariaControlador = new CajaDiariaControlador({ cajaDiariaServicio })

  // Obtener resumen de caja para una fecha específica
  ruta.get('/resumen', cajaDiariaControlador.obtenerResumenCajaDiaria)

  // Obtener resumen de caja para hoy
  ruta.get('/resumen-hoy', cajaDiariaControlador.obtenerResumenHoy)

  // Obtener movimientos por rango de fechas
  ruta.get('/movimientos', cajaDiariaControlador.obtenerMovimientosPorRango)

  return ruta
}
