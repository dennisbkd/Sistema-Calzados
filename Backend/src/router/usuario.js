import { Router } from 'express'
import { UsuarioControlador } from '../controller/usuario.js'

export const rutaUsuario = ({ usuarioServicio }) => {
  const ruta = Router()
  const usuarioControlador = new UsuarioControlador({ usuarioServicio })

  ruta.get('/listar', usuarioControlador.listarUsuario)

  return ruta
}
