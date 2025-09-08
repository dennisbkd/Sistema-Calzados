import { UsuarioRol } from "./usuarioRol.js"
import { Rol } from "./rol.js"
import { Usuario } from "./usuario.js"

Usuario.belongsToMany(Rol,{through:UsuarioRol, foreignKey:'usuarioId'})
Rol.belongsToMany(Usuario,{through:UsuarioRol, foreignKey:'rolId'})

export {
  Usuario,
  Rol,
  UsuarioRol
}