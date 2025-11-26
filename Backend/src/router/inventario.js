import { Router } from 'express'
import { NotaSalidaControlador } from '../controller/Paquete-G-Inventario/gestion-inventario/notaSalida.js'

export const rutaInventario = ({ notaSalidaServicio }) => {
  const rutas = Router()
  const notaSalidaControlador = new NotaSalidaControlador({ notaSalidaServicio })

  rutas.post('/nota-salida', notaSalidaControlador.registrarNotaSalida)
  rutas.get('/nota-salida/registros', notaSalidaControlador.obtenerHistorial)

  return rutas
}
