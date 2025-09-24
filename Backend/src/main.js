import express from 'express'
import { db } from '../config/baseDatos.js'
import { rutaUsuario } from './router/usuario.js'
import { rutaAutorizacion } from './router/autorizacion.js'
import cors from 'cors'

export const App = ({ usuarioServicio, autorizacionServicio }) => {
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

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
}
