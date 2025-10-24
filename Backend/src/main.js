import express from 'express'
import { db } from '../config/baseDatos.js'
import { rutaUsuario } from './router/usuario.js'
import { rutaAutorizacion } from './router/autorizacion.js'
import { rutaRol } from './router/rol.js'
import { rutaCategoria } from './router/categoria.js'
import { rutaProveedor } from './router/preoveedor.js'
import { rutaCompra } from './router/compra.js'
import { createMetodoPagoRouter } from './router/metodoPago.js'
import { createTransaccionPagoRouter } from './router/transaccionPago.js'

import cors from 'cors'
import { rutaProducto } from './router/producto.js'
import { rutaVariante } from './router/variante.js'
import { decodificarToken } from '../middleware/descodificarToken.js'
import { rutaBitacora } from './router/bitacora.js'

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
  metodoPagoServicio,
  transaccionPagoServicio
}) => {
  const app = express()
  const port = 3000
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
  }))

  db()

  app.use('/usuario', decodificarToken, rutaUsuario({ usuarioServicio }))
  app.use('/autorizacion', rutaAutorizacion({ autorizacionServicio }))
  app.use('/rol', decodificarToken, rutaRol({ rolServicio, bitacoraServicio }))
  app.use('/categorias', decodificarToken, rutaCategoria({ categoriaServicio }))
  app.use('/proveedores', decodificarToken, rutaProveedor({ proveedorServicio }))
  app.use('/productos', decodificarToken, rutaProducto({ productoServicio }))
  app.use('/variantes', decodificarToken, rutaVariante({ varianteServicio }))
  app.use('/compras', decodificarToken, rutaCompra({ compraServicio, bitacoraServicio }))
  app.use('/bitacora', rutaBitacora({ bitacoraServicio }))

  // Rutas de pagos
  app.use('/metodo-pago', decodificarToken, createMetodoPagoRouter({ metodoPagoServicio }))
  app.use('/pago', decodificarToken, createTransaccionPagoRouter({ transaccionPagoServicio }))

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
}