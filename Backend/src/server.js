// ✅ IMPORTS PRINCIPALES
import { App } from './main.js'
import { db } from '../config/baseDatos.js'

import { UsuarioServicio } from './services/paquete-G-Usuario/usuario.js'
import { AutorizacionServicio } from './services/paquete-G-Usuario/Auth/autorizacion.js'
import { RolServicio } from './services/paquete-G-Usuario/rol.js'
import { BitacoraServicio } from './services/paquete-G-Usuario/bitacora.js'

import { CategoriaServicio } from './services/paquete-G-Inventario/gestion-Categoria/categoria.js'
import { ProveedorServicio } from './services/paquete-G-compra/gestion-proveedor/proveedor.js'
import { ProductoServicio } from './services/paquete-G-Inventario/gestion-producto/producto.js'
import { VarianteServicio } from './services/paquete-G-Inventario/gestion-producto/variante.js'
import { CompraServicio } from './services/paquete-G-compra/gestion-compra/compra.js'

import { PagoServicio } from './services/paquete-G-Pago/pago.js'

import bcrypt from 'bcrypt'
import { token, mailer } from '../config/autenticacionEmail.js'
import sequelize from '../config/baseDatos.js'

// ✅ MODELOS
import {
  Rol, Usuario, Bitacora, Categoria, Proveedor,
  Producto, ProductoVariante, Compra, Venta, DetalleCompra,
  TransaccionPago, MetodoPago
} from './models/index.js'

// ✅ INSTANCIAS
const usuarioServicio = new UsuarioServicio({
  modeloUsuario: Usuario,
  modeloRol: Rol,
  bcrypt
})

const autorizacionServicio = new AutorizacionServicio({
  modeloUsuario: Usuario,
  modeloRol: Rol,
  token,
  mailer,
  bcrypt
})

const rolServicio = new RolServicio({ modeloRol: Rol })

const bitacoraServicio = new BitacoraServicio({
  modeloBitacora: Bitacora,
  modeloUsuario: Usuario,
  sequelize
})

const categoriaServicio = new CategoriaServicio({ modeloCategoria: Categoria })

const proveedorServicio = new ProveedorServicio({ modeloProveedor: Proveedor })

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

const pagoServicio = new PagoServicio({
  modeloTransaccion: TransaccionPago,
  modeloMetodoPago: MetodoPago,
  modeloCompra: Compra,
  modeloVenta: Venta
})

// ✅ INICIAR APP
db()

App({
  usuarioServicio,
  autorizacionServicio,
  rolServicio,
  bitacoraServicio,
  categoriaServicio,
  proveedorServicio,
  productoServicio,
  varianteServicio,
  compraServicio,
  pagoServicio
})
