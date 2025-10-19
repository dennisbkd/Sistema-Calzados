import { UsuarioRol } from './usuarioRol.js'
import { Rol } from './rol.js'
import { Usuario } from './usuario.js'
import { Bitacora } from './bitacora.js'
import { Categoria } from './categoria.js'
import { Producto } from './producto.js'
import { ProductoVariante } from './productoVariante.js'
import { Cliente } from './cliente.js'
import { Compra } from './compra.js'
import { DetalleCompra } from './detalleCompra.js'
import { DetalleVenta } from './detalleVenta.js'
import { Proveedor } from './proveedor.js'
import { Venta } from './venta.js'
import { MovimientoInventario } from './movimientoInventario.js'
import { Promocion } from './promocion.js'
import { VentaPromocion } from './ventaPromocion.js'
import { MetodoPago } from './metodoPago.js'
import { TransaccionPago } from './transaccionPago.js'
import { UbicacionFisica } from './ubicacionFisica.js'
import { ZonaBodega } from './zonaBodega.js'
import { InventarioUbicacion } from './inventarioUbicacion.js'
import { registrarAuditoriaHooks } from '../utils/registrarAuditoriaHooks.js'
// Usuario - Rol - UsuarioRol

Usuario.belongsToMany(Rol, {
  through: UsuarioRol,
  foreignKey: 'usuarioId',
  otherKey: 'rolId',
  as: 'roles'
})

Rol.belongsToMany(Usuario, {
  through: UsuarioRol,
  foreignKey: 'rolId',
  otherKey: 'usuarioId',
  as: 'usuarios'
})

// Usuario - Bitacora

Usuario.hasMany(Bitacora, { foreignKey: 'usuarioId', as: 'bitacoras' })
Bitacora.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'usuario' })

// Categoria - Producto - ProductoVariante

Categoria.hasMany(Producto, { foreignKey: 'categoriaId', as: 'productos' })
Producto.belongsTo(Categoria, { foreignKey: 'categoriaId', as: 'categoria' })

Producto.hasMany(ProductoVariante, {
  foreignKey: 'productoId',
  as: 'variantes',
  onDelete: 'CASCADE',
  hooks: true
})
ProductoVariante.belongsTo(Producto, { foreignKey: 'productoId', as: 'producto' })

// Proveedor - Compra

Proveedor.hasMany(Compra, { foreignKey: 'proveedorId', as: 'compras' })
Compra.belongsTo(Proveedor, { foreignKey: 'proveedorId', as: 'proveedor' })

// Usuario - Compra / Venta

Usuario.hasMany(Compra, { foreignKey: 'usuarioId', as: 'compras' })
Compra.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'usuario' })

Usuario.hasMany(Venta, { foreignKey: 'usuarioId', as: 'ventas' })
Venta.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'usuario' })

// Cliente - Venta

Cliente.hasMany(Venta, { foreignKey: 'clienteId', as: 'ventas' })
Venta.belongsTo(Cliente, { foreignKey: 'clienteId', as: 'cliente' })

// Compra - DetalleCompra - ProductoVariante

Compra.hasMany(DetalleCompra, { foreignKey: 'compraId', as: 'detalles' })
DetalleCompra.belongsTo(Compra, { foreignKey: 'compraId', as: 'compra' })

ProductoVariante.hasMany(DetalleCompra, { foreignKey: 'varianteId', as: 'detallesCompra' })
DetalleCompra.belongsTo(ProductoVariante, { foreignKey: 'varianteId', as: 'variante' })

// =====================
// Venta - DetalleVenta - ProductoVariante
// =====================
Venta.hasMany(DetalleVenta, { foreignKey: 'ventaId', as: 'detalles' })
DetalleVenta.belongsTo(Venta, { foreignKey: 'ventaId', as: 'venta' })

ProductoVariante.hasMany(DetalleVenta, { foreignKey: 'varianteId', as: 'detallesVenta' })
DetalleVenta.belongsTo(ProductoVariante, { foreignKey: 'varianteId', as: 'variante' })

// MovimientoInventario

ProductoVariante.hasMany(MovimientoInventario, { foreignKey: 'varianteId', as: 'movimientos' })
MovimientoInventario.belongsTo(ProductoVariante, { foreignKey: 'varianteId', as: 'variante' })

Compra.hasMany(MovimientoInventario, { foreignKey: 'compraId', as: 'movimientos' })
MovimientoInventario.belongsTo(Compra, { foreignKey: 'compraId', as: 'compra' })

Venta.hasMany(MovimientoInventario, { foreignKey: 'ventaId', as: 'movimientos' })
MovimientoInventario.belongsTo(Venta, { foreignKey: 'ventaId', as: 'venta' })

Usuario.hasMany(MovimientoInventario, { foreignKey: 'usuarioId', as: 'movimientos' })
MovimientoInventario.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'usuario' })

// Promocion - VentaPromocion - Venta

Venta.belongsToMany(Promocion, {
  through: VentaPromocion,
  foreignKey: 'ventaId',
  otherKey: 'promocionId',
  as: 'promociones'
})

Promocion.belongsToMany(Venta, {
  through: VentaPromocion,
  foreignKey: 'promocionId',
  otherKey: 'ventaId',
  as: 'ventas'
})

// MetodoPago - TransaccionPago

MetodoPago.hasMany(TransaccionPago, { foreignKey: 'metodoPagoId', as: 'transacciones' })
TransaccionPago.belongsTo(MetodoPago, { foreignKey: 'metodoPagoId', as: 'metodoPago' })

Compra.hasMany(TransaccionPago, { foreignKey: 'compraId', as: 'pagos' })
TransaccionPago.belongsTo(Compra, { foreignKey: 'compraId', as: 'compra' })

Venta.hasMany(TransaccionPago, { foreignKey: 'ventaId', as: 'pagos' })
TransaccionPago.belongsTo(Venta, { foreignKey: 'ventaId', as: 'venta' })

// ZonaBodega - UbicacionFisica - InventarioUbicacion

ZonaBodega.hasMany(UbicacionFisica, { foreignKey: 'zonaBodegaId', as: 'ubicaciones' })
UbicacionFisica.belongsTo(ZonaBodega, { foreignKey: 'zonaBodegaId', as: 'zonaBodega' })

UbicacionFisica.hasMany(InventarioUbicacion, { foreignKey: 'ubicacionId', as: 'inventarios' })
InventarioUbicacion.belongsTo(UbicacionFisica, { foreignKey: 'ubicacionId', as: 'ubicacion' })

ProductoVariante.hasMany(InventarioUbicacion, { foreignKey: 'varianteId', as: 'inventarios' })
InventarioUbicacion.belongsTo(ProductoVariante, { foreignKey: 'varianteId', as: 'variante' })

const modelos = {
  Usuario,
  Rol,
  UsuarioRol,
  Categoria,
  Producto,
  ProductoVariante,
  Cliente,
  Compra,
  DetalleCompra,
  DetalleVenta,
  Proveedor,
  Venta,
  MovimientoInventario,
  Promocion,
  VentaPromocion,
  MetodoPago,
  TransaccionPago,
  UbicacionFisica,
  ZonaBodega,
  InventarioUbicacion,
  Bitacora
}

// Aplica auditoría a todos menos Bitácora
for (const [nombre, modelo] of Object.entries(modelos)) {
  registrarAuditoriaHooks(modelo, nombre)
}

export {
  Usuario,
  Rol,
  UsuarioRol,
  Bitacora,
  Categoria,
  Producto,
  ProductoVariante,
  Cliente,
  Compra,
  DetalleCompra,
  DetalleVenta,
  Proveedor,
  Venta,
  MovimientoInventario,
  Promocion,
  VentaPromocion,
  MetodoPago,
  TransaccionPago,
  UbicacionFisica,
  ZonaBodega,
  InventarioUbicacion
}
