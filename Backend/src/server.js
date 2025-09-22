import { App } from './main.js'
import { UsuarioServicio } from './services/usuario.js'
import { Rol, Usuario } from './models/index.js'
import { AutorizacionServicio } from './services/Auth/autorizacion.js'
import { Token } from './utils/token.js'
import jwt from 'jsonwebtoken'

// probando JWT para el manejo de la sesion.
const token = new Token({ PALABRA_SECRETA: 'prueba_oara_que_fuincione', expiracion: '1h', jwt })

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
    token
  }
)

App({ usuarioServicio, autorizacionServicio })
