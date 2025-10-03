import { Router } from 'express'
import { ProveedorControlador } from '../controller/gestion-proveedor/proveedor.js'

export const rutaProveedor = ({ proveedorServicio }) => {
  const router = Router()
  const proveedorController = new ProveedorControlador({ proveedorServicio })

  router.get('/listar', proveedorController.listar)
  router.get('/obtener/:id', proveedorController.obtener)
  router.post('/crear', proveedorController.crear)
  router.put('/actualizar/:id', proveedorController.actualizar)
  router.delete('/eliminar/:id', proveedorController.eliminar)
  router.patch('/toggle-estado/:id', proveedorController.toggleEstado)

  return router
}
