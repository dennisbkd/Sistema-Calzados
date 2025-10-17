import express from 'express'
import { db } from '../config/baseDatos.js'
import { rutaUsuario } from './router/usuario.js'
import { rutaAutorizacion } from './router/autorizacion.js'
import { rutaRol } from './router/rol.js'
import { rutaCategoria } from './router/categoria.js'
import { rutaProveedor } from './router/preoveedor.js'
import { rutaCompra } from './router/compra.js'

import cors from 'cors'

export const App = ({ usuarioServicio, autorizacionServicio, rolServicio, bitacoraServicio, categoriaServicio, proveedorServicio, compraServicio }) => {
  const app = express()
  const port = 3000
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
  }))

  db()

  app.use('/usuario', rutaUsuario({ usuarioServicio }))
  app.use('/autorizacion', rutaAutorizacion({ autorizacionServicio }))
  app.use('/rol', rutaRol({ rolServicio, bitacoraServicio }))
  app.use('/categorias', rutaCategoria({ categoriaServicio }))
  app.use('/proveedores', rutaProveedor({ proveedorServicio }))
  app.use('/compras', rutaCompra({ compraServicio, bitacoraServicio }))

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
}
