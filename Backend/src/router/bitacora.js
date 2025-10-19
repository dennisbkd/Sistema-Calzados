import { Router } from 'express'
import { BitacoraControlador } from '../controller/bitacora.js'

export const rutaBitacora = ({ bitacoraServicio }) => {
  const rutas = Router()
  const bitacoraControlador = new BitacoraControlador({ bitacoraServicio })

  rutas.get('/usuarios-activos', bitacoraControlador.obtenerUsuariosActivos)
  rutas.get('/usuario/:usuarioId', bitacoraControlador.obtenerDetallesUsuario)
  rutas.get('/estadisticas', bitacoraControlador.obtenerEstadisticas)
  rutas.get('/buscar', bitacoraControlador.buscarEnBitacora)
  rutas.get('/estadisticas-completas', bitacoraControlador.obtenerEstadisticasCompletas)

  return rutas
}
