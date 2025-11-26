import express from 'express'
import { db } from '../config/baseDatos.js'
import { rutaUsuario } from './router/usuario.js'
import { rutaAutorizacion } from './router/autorizacion.js'
import { rutaRol } from './router/rol.js'
import { rutaCategoria } from './router/categoria.js'
import { rutaProveedor } from './router/preoveedor.js'
import { rutaCompra } from './router/compra.js'
import { rutaProducto } from './router/producto.js'
import { rutaVariante } from './router/variante.js'
import { decodificarToken } from '../middleware/descodificarToken.js'
import { rutaBitacora } from './router/bitacora.js'
import { corsMiddleware } from './utils/corsUrl.js'
import { rutaReporteIngresoEgreso } from './router/reporteIngresoEgreso.js'
import { rutaVenta } from './router/venta.js'
import { crearStripeWebhook } from './utils/webhookStripe.js'
import { rutaInventario } from './router/Inventario.js'
import { rutaUbicacion } from './router/zona.js'

export const App = ({
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
  ubicacionServicio
}) => {
  const app = express()
  const port = process.env.PORT || 3000

  app.use('/webhook', crearStripeWebhook({ ventaServicio, stripeServicio }))

  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(corsMiddleware())

  db()

  app.use('/usuario', decodificarToken, rutaUsuario({ usuarioServicio }))
  app.use('/autorizacion', rutaAutorizacion({ autorizacionServicio }))
  app.use('/rol', decodificarToken, rutaRol({ rolServicio }))
  app.use('/categorias', decodificarToken, rutaCategoria({ categoriaServicio }))
  app.use('/proveedores', decodificarToken, rutaProveedor({ proveedorServicio }))
  app.use('/productos', decodificarToken, rutaProducto({ productoServicio }))
  app.use('/variantes', decodificarToken, rutaVariante({ varianteServicio }))
  app.use('/compras', decodificarToken, rutaCompra({ compraServicio }))
  app.use('/bitacora', rutaBitacora({ bitacoraServicio }))
  app.use('/reportes', decodificarToken, rutaReporteIngresoEgreso({ reporteIngresoEgresoServicio }))
  app.use('/ventas', decodificarToken, rutaVenta({ ventaServicio, stripeServicio }))
  app.use('/inventario', decodificarToken, rutaInventario({ inventarioServicio }))
  app.use('/zonas', rutaUbicacion({ ubicacionServicio }))

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
}
