import { Router } from 'express'
import { ProductoControlador } from '../controller/gestion-producto/producto.js'

export const rutaProducto = ({ productoServicio }) => {
  const rutas = Router()
  const productoControlador = new ProductoControlador({ productoServicio })

  rutas.get('/listar', productoControlador.listarProductos)
  rutas.post('/crear', productoControlador.crearProducto)
  rutas.put('/actualizar/:id', productoControlador.editarProducto)
  rutas.patch('/estado/:id', productoControlador.toggleEstadoProducto)
  rutas.delete('/eliminar/:id', productoControlador.eliminarProducto)

  return rutas
}
