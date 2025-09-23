import { App } from './main.js'

import { UsuarioServicio } from './services/usuario.js'
import { Rol, Usuario, Bitacora } from './models/index.js'
import { AutorizacionServicio } from './services/Auth/autorizacion.js'
import { RolServicio } from './services/rol.js'
import { BitacoraServicio } from './services/bitacora.js'

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
const rolServicio = new RolServicio(
  {
    modeloRol: Rol
  }
)
const bitacoraServicio = new BitacoraServicio(
  {
    modeloBitacora: Bitacora
  }
)


App({ usuarioServicio, autorizacionServicio, rolServicio, bitacoraServicio })
