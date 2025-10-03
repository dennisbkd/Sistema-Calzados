import { Router } from 'express'
import { CategoriaControlador } from '../controller/gestion-categoria/categoria.js'

export const rutaCategoria = ({ categoriaServicio }) => {
  const ruta = Router()
  const categoriaControlador = new CategoriaControlador({ categoriaServicio })

  ruta.get('/listar', categoriaControlador.listar)
  ruta.get('/obtener/:id', categoriaControlador.obtener)
  ruta.post('/crear', categoriaControlador.crear)
  ruta.put('/actualizar/:id', categoriaControlador.actualizar)
  ruta.patch('/toggle-estado/:id', categoriaControlador.toggleEstado)
  ruta.delete('/eliminar/:id', categoriaControlador.eliminar)

  return ruta
}
