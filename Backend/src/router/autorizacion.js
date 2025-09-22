import { Router } from 'express'
import { AutorizacionControlador } from '../controller/Auth/autorizacion.js'

export const rutaAutorizacion = ({ autorizacionServicio }) => {
  const ruta = Router()
  const autorizacionControlador = new AutorizacionControlador({ autorizacionServicio })

  ruta.post('/login', autorizacionControlador.iniciarSesion)

  return ruta
}
