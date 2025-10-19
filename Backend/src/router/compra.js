import { Router } from 'express'
import { CompraControlador } from '../controller/gestion-compra/compra.js'

export const rutaCompra = ({ compraServicio, bitacoraServicio }) => {
  const router = Router()
  const compraController = new CompraControlador({ compraServicio, bitacoraServicio })
  router.post('/registrar', compraController.registrarCompra)
  router.patch('/editar', compraController.editarCompra)
  router.delete('/eliminar/:id', compraController.eliminarCompra)
  router.get('/listar', compraController.listarCompras)
  router.get('/generarCodigoFactura', compraController.generarCodigoFactura)
  router.patch('/cambiarEstado', compraController.cambiarEstadoCompra)
  router.get('/generarFactura/:id', compraController.generarFactura)
  return router
}
