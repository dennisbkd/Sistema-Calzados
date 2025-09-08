import express from 'express'
import { db } from '../config/baseDatos.js'
import { Rol, Usuario } from './models/index.js'
Usuario

const app = express()
const port = 3000

db()

app.get('/usuario', async (req, res) => {
  const usuarios = await Usuario.findAll({include:Rol})
  const DTOUsuarios = usuarios.map((usuario)=>{
    return{
    nombre: usuario.nombre,
    activo: usuario.activo,
    rol: usuario.Rols.map((rol)=>{
      return{
        nombre: rol.nombre,
        descripcion: rol.descripcion
      }
    })
    }
  })
  res.send(JSON.stringify(DTOUsuarios))
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
