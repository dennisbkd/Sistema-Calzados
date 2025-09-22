import { App } from './main.js'
import { UsuarioServicio } from './services/usuario.js'
import { Rol, Usuario } from './models/index.js'
import { AutorizacionServicio } from './services/Auth/autorizacion.js'

import { token, mailer } from '../config/autenticacionEmail.js'
import bcrypt from 'bcrypt'

const usuarioServicio = new UsuarioServicio(
  {
    modeloUsuario: Usuario,
    modeloRol: Rol
  }
)
const autorizacionServicio = new AutorizacionServicio(
  {
    modeloUsuario: Usuario,
    modeloRol: Rol,
    token,
    mailer,
    bcrypt
  }
)

App({ usuarioServicio, autorizacionServicio })
