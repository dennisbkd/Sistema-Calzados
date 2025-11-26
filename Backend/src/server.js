import { App } from './main.js'
import { UsuarioServicio } from './services/paquete-G-Usuario/usuario.js'
import { Rol, Usuario, Bitacora, Categoria, Proveedor, Producto, ProductoVariante, Compra, DetalleCompra, Venta, Cliente, DetalleVenta, Promocion, TransaccionPago, MovimientoInventario, VentaPromocion, MetodoPago, ZonaBodega, InventarioUbicacion, UbicacionFisica } from './models/index.js'
import { AutorizacionServicio } from './services/paquete-G-Usuario/Auth/autorizacion.js'
import { BitacoraServicio } from './services/paquete-G-Usuario/bitacora.js'
import { RolServicio } from './services/paquete-G-Usuario/rol.js'
import { CategoriaServicio } from './services/paquete-G-Inventario/gestion-Categoria/categoria.js'

import { token, stripeConfig, mailerResend } from '../config/autenticacionEmail.js'
import bcrypt from 'bcrypt'
import { ProveedorServicio } from './services/paquete-G-compra/gestion-proveedor/proveedor.js'
import { ProductoServicio } from './services/paquete-G-Inventario/gestion-producto/producto.js'
import { VarianteServicio } from './services/paquete-G-Inventario/gestion-producto/variante.js'
import { CompraServicio } from './services/paquete-G-compra/gestion-compra/compra.js'
import sequelize from '../config/baseDatos.js'
import { ReporteIngresoEgresoServicio } from './services/paquete-G-Venta/reportesIngresosEgresos/reporteIngresoEgreso.js'
import { VentaServicio } from './services/paquete-G-Venta/gestion-Venta/Venta.js'
import { StripeServicio } from './services/paquete-G-Venta/stripe-pago/stripe.js'
import { InventarioServicio } from './services/paquete-G-Inventario/reporte-Inventario/Inventario.js'
import { UbicacionServicio } from './services/paquete-G-Inventario/gestion-zona/zona.js'
import { PromocionServicio } from './services/paquete-G-Venta/gestion-promocion/promocion.js'

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
    mailer: mailerResend,
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

const reporteIngresoEgresoServicio = new ReporteIngresoEgresoServicio({
  modeloCompra: Compra,
  modeloVenta: Venta,
  modeloDetalleCompra: DetalleCompra,
  modeloProveedor: Proveedor,
  modeloProducto: Producto,
  modeloProductoVariante: ProductoVariante,
  modeloUsuario: Usuario,
  modeloCliente: Cliente,
  modeloDetalleVenta: DetalleVenta
})

const stripeServicio = new StripeServicio({
  stripeClaveSecreta: stripeConfig.claveSecreta
})
const ventaServicio = new VentaServicio(
  {
    modeloVenta: Venta,
    modeloProducto: Producto,
    modeloCategoria: Categoria,
    modeloProductoVariante: ProductoVariante,
    modeloPromocion: Promocion,
    modeloCliente: Cliente,
    modeloDetalleVenta: DetalleVenta,
    modeloTransaccionPago: TransaccionPago,
    modeloMovimientoInventario: MovimientoInventario,
    modeloVentaPromocion: VentaPromocion,
    modeloUsuario: Usuario,
    modeloMetodoPago: MetodoPago,
    stripeServicio,
    mailer: mailerResend
  }
)
const inventarioServicio = new InventarioServicio(
  {
    modeloProductoVariante: ProductoVariante,
    modeloProducto: Producto,
    modeloCategoria: Categoria,
    modeloMovimientoInventario: MovimientoInventario
  }
)
const ubicacionServicio = new UbicacionServicio({
  modeloZonaBodega: ZonaBodega,
  modeloInventarioUbicacion: InventarioUbicacion,
  modeloProductoVariante: ProductoVariante,
  modeloUbicacionFisica: UbicacionFisica,
  modeloProducto: Producto
})
const promocionServicio = new PromocionServicio({
  modeloPromocion: Promocion,
  modeloCategoria: Categoria,
  modeloProducto: Producto,
  modeloVentaPromocion: VentaPromocion
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
  compraServicio,
  reporteIngresoEgresoServicio,
  ventaServicio,
  stripeServicio,
  inventarioServicio,
  ubicacionServicio,
  promocionServicio
})
