import { App } from './main.js'

import { UsuarioServicio } from './services/usuario.js'
import { RolServicio } from './services/rol.js'
import { BitacoraServicio } from './services/bitacora.js' 
import { Rol, Usuario } from './models/index.js'
import { Bitacora } from './models/bitacora.js'

const usuarioServicio = new UsuarioServicio(
  {
    modeloUsuario: Usuario,
    modeloRol: Rol
  }
)

const rolServicio = new RolServicio({
  modeloRol: Rol
})

const bitacoraServicio = new BitacoraServicio({
  modeloBitacora: Bitacora
})

App({ usuarioServicio, rolServicio, bitacoraServicio })
