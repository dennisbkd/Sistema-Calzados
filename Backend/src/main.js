import express from 'express'
import { db } from '../config/baseDatos.js'
import { rutaUsuario } from './router/usuario.js'

export const App = ({ usuarioServicio }) => {
  const app = express()
  const port = 3000

  db()

  app.use('/usuario', rutaUsuario({ usuarioServicio }))

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
}
