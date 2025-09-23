import express, { json } from 'express'
import { db } from '../config/baseDatos.js'
 

import { rutaUsuario } from './router/usuario.js'
import { rutaAutorizacion } from './router/autorizacion.js'
import { rutaRol } from './router/rol.js'

export const App = ({ usuarioServicio, autorizacionServicio, rolServicio, bitacoraServicio }) => {
  const app = express()
  const port = 3000
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  db()
  app.use('/usuario', rutaUsuario({ usuarioServicio }))
  app.use('/autorizacion', rutaAutorizacion({ autorizacionServicio }))
  app.use('/rol', rutaRol({ rolServicio, bitacoraServicio }))

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
}