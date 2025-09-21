import express, { json } from 'express'
import { db } from '../config/baseDatos.js'
 

import { rutaUsuario } from './router/usuario.js'
import { rutaRol } from './router/rol.js'

export const App = async ({ 
  usuarioServicio,
  rolServicio,
  bitacoraServicio
}) => {
  const app = express()
  const port = 3000

  app.use(express.json())

  db()
  await sequelize.sync({ alter: true })

  app.use('/usuario', rutaUsuario({ usuarioServicio }))
  app.use('/rol', rutaRol({ rolServicio, bitacoraServicio}))

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
}
