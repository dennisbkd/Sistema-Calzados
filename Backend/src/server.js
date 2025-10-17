import { App } from './main.js'
import { UsuarioServicio } from './services/usuario.js'
import { Rol, Usuario, Bitacora, Categoria, Proveedor, Compra, DetalleCompra, ProductoVariante, Producto } from './models/index.js'
import { AutorizacionServicio } from './services/Auth/autorizacion.js'
import { BitacoraServicio } from './services/bitacora.js'
import { RolServicio } from './services/rol.js'
import { CategoriaServicio } from './services/gestion-Categoria/categoria.js'

import { token, mailer } from '../config/autenticacionEmail.js'
import bcrypt from 'bcrypt'
import { ProveedorServicio } from './services/gestion-proveedor/proveedor.js'
import { CompraServicio } from './services/gestion-compra/compra.js'

const usuarioServicio = new UsuarioServicio(
  {
    modeloUsuario: Usuario,
    modeloRol: Rol,
    bcrypt
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
const categoriaServicio = new CategoriaServicio({
  modeloCategoria: Categoria
})
const proveedorServicio = new ProveedorServicio({
  modeloProveedor: Proveedor
})
const compraServicio = new CompraServicio({
  modeloCompra: Compra,
  modeloUsuario: Usuario,
  modeloProveedor: Proveedor,
  modeloDetalleCompra: DetalleCompra,
  modeloProductoVariante: ProductoVariante,
  modeloProducto: Producto
})

App({ usuarioServicio, autorizacionServicio, rolServicio, bitacoraServicio, categoriaServicio, proveedorServicio, compraServicio })
