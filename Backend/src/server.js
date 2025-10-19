import { App } from './main.js'
import { UsuarioServicio } from './services/usuario.js'
import { Rol, Usuario, Bitacora, Categoria, Proveedor, Producto, ProductoVariante, Compra, DetalleCompra } from './models/index.js'
import { AutorizacionServicio } from './services/Auth/autorizacion.js'
import { BitacoraServicio } from './services/bitacora.js'
import { RolServicio } from './services/rol.js'
import { CategoriaServicio } from './services/gestion-Categoria/categoria.js'

import { token, mailer } from '../config/autenticacionEmail.js'
import bcrypt from 'bcrypt'
import { ProveedorServicio } from './services/gestion-proveedor/proveedor.js'
import { ProductoServicio } from './services/gestion-producto/producto.js'
import { VarianteServicio } from './services/gestion-producto/variante.js'
import { CompraServicio } from './services/gestion-compra/compra.js'
import sequelize from '../config/baseDatos.js'

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
    modeloBitacora: Bitacora,
    modeloUsuario: Usuario,
    sequelize
  }
)
const categoriaServicio = new CategoriaServicio({
  modeloCategoria: Categoria
})
const proveedorServicio = new ProveedorServicio({
  modeloProveedor: Proveedor
})
const productoServicio = new ProductoServicio({
  modeloProducto: Producto,
  modeloProductoVariante: ProductoVariante,
  modeloCategoria: Categoria
})
const varianteServicio = new VarianteServicio({
  modeloVariante: ProductoVariante,
  modeloProducto: Producto
})

const compraServicio = new CompraServicio({
  modeloCompra: Compra,
  modeloDetalleCompra: DetalleCompra,
  modeloProveedor: Proveedor,
  modeloProducto: Producto,
  modeloProductoVariante: ProductoVariante,
  modeloUsuario: Usuario
})

App({
  usuarioServicio,
  autorizacionServicio,
  rolServicio,
  bitacoraServicio,
  categoriaServicio,
  proveedorServicio,
  productoServicio,
  varianteServicio,
  compraServicio
})
