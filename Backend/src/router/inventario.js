import { Router } from 'express'
import { InventarioControlador } from '../controller/Paquete-G-Inventario/reporte-Inventario/inventario.js'

export const rutaInventario = ({ inventarioServicio }) => {
  const router = Router()
  const inventarioControlador = new InventarioControlador({
    inventarioServicio
  })

  // Endpoints existentes
  router.post('/estado-Inventario', inventarioControlador.estadoInventario)
  router.post('/reporte-Inventario', inventarioControlador.reporteInventario)

  // Nuevos endpoints
  router.post('/movimientos-Inventario', inventarioControlador.movimientosInventario)
  router.get('/productos', inventarioControlador.listarProductos)
  router.get('/categorias', inventarioControlador.listarCategorias)

  return router
}
