import { Router } from 'express'
import { VarianteControlador } from '../controller/gestion-producto/variante.js'
export const rutaVariante = ({ varianteServicio }) => {
  const rutas = Router()
  const varianteControlador = new VarianteControlador({ varianteServicio })

  rutas.post('/crear', varianteControlador.crearVariante)
  rutas.patch('/estado/:id', varianteControlador.toggleEstadoVariante)
  rutas.delete('/eliminar/:id', varianteControlador.eliminarVariante)
  rutas.put('/actualizar/:id', varianteControlador.actualizarVariante)

  return rutas
}
