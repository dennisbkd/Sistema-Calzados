import { Router } from 'express'
import { UsuarioControlador } from '../controller/usuario.js'

export const rutaUsuario = ({ usuarioServicio }) => {
  const ruta = Router()
  const usuarioControlador = new UsuarioControlador({ usuarioServicio })

  ruta.get('/listar', usuarioControlador.listarUsuario)
  ruta.put('/editar/:id', usuarioControlador.editarUsuario)
  ruta.put('/roles/:id', usuarioControlador.eliminarRolUsuario)
  ruta.post('/crear', usuarioControlador.crearUsuario)
  return ruta
}
