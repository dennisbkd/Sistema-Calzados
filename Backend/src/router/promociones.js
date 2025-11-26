import { Router } from 'express'
import { PromocionControlador } from '../controller/paquete-G-Venta/gestion-promocion/promocion.js'

export const rutaPromocion = ({ promocionServicio }) => {
  const ruta = Router()
  const promocionControlador = new PromocionControlador({ promocionServicio })

  ruta.get('/', promocionControlador.listarPromociones)
  ruta.get('obtener/:id', promocionControlador.obtenerPromocion)
  ruta.post('/crear', promocionControlador.crearPromocion)
  ruta.put('/editar/:id', promocionControlador.actualizarPromocion)
  ruta.delete('/eliminar/:id', promocionControlador.eliminarPromocion)
  ruta.post('/activas', promocionControlador.obtenerPromocionesActivas)

  return ruta
}
