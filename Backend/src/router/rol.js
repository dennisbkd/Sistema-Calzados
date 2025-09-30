import { Router } from 'express'
import { RolControlador } from '../controller/rol.js'

export const rutaRol = ({ rolServicio, bitacoraServicio }) => {
  const ruta = Router()
  const rolControlador = new RolControlador({ rolServicio, bitacoraServicio })

  ruta.post('/crear', rolControlador.crearRol)
  ruta.patch('/editar', rolControlador.editarRol)
  ruta.delete('/eliminar/:id', rolControlador.eliminarRol)
  ruta.get('/listar', rolControlador.listarRoles)

  return ruta
}
