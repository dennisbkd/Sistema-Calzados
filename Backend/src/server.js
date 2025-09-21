import { App } from './main.js'
import { UsuarioServicio } from './services/usuario.js'
import { Rol, Usuario } from './models/index.js'

const usuarioServicio = new UsuarioServicio(
  {
    modeloUsuario: Usuario,
    modeloRol: Rol
  }
)

App({ usuarioServicio })
