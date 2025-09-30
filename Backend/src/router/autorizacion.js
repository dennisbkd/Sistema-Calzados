import { Router } from 'express'
import { AutorizacionControlador } from '../controller/Auth/autorizacion.js'

export const rutaAutorizacion = ({ autorizacionServicio }) => {
  const ruta = Router()
  const autorizacionControlador = new AutorizacionControlador({ autorizacionServicio })

  ruta.post('/login', autorizacionControlador.iniciarSesion)
  ruta.post('/solicitar-recuperamiento', autorizacionControlador.solicitaRecuperamientoPassword)
  ruta.post('/restablecer-password', autorizacionControlador.resetearPassword)

  return ruta
}
