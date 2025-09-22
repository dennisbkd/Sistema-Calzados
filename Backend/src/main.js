import express from 'express'
import { db } from '../config/baseDatos.js'
import { rutaUsuario } from './router/usuario.js'
import { rutaAutorizacion } from './router/autorizacion.js'

export const App = ({ usuarioServicio, autorizacionServicio }) => {
  const app = express()
  const port = 3000
  app.use(express.json())
  db()

  app.use('/usuario', rutaUsuario({ usuarioServicio }))
  app.use('/autorizacion', rutaAutorizacion({ autorizacionServicio }))

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
}
