import { Router } from 'express'
import { UbicacionControlador } from '../controller/Paquete-G-Inventario/gestion-zona/zona.js'

export const rutaUbicacion = ({ ubicacionServicio }) => {
  const ruta = Router()
  const ubicacionControlador = new UbicacionControlador({ ubicacionServicio })

  ruta.get('/listar', ubicacionControlador.listarZonas)
  ruta.post('/crear', ubicacionControlador.crearZona)
  ruta.post('/crear-ubicacion', ubicacionControlador.crearUbicacion)
  ruta.get('/:zonaId/ubicaciones', ubicacionControlador.obtenerUbicacionesPorZona)
  ruta.post('/ubicaciones/:ubicacionId/variantes', ubicacionControlador.agregarVariantesUbicacion)
  ruta.delete('/ubicaciones/:ubicacionId/variantes', ubicacionControlador.removerVariantesUbicacion)
  ruta.get('/ubicaciones/:ubicacionId/variantes-disponibles', ubicacionControlador.obtenerVariantesDisponibles)
  ruta.get('/ubicaciones/:ubicacionId/variantes', ubicacionControlador.obtenerVariantesEnUbicacion)
  ruta.put('/:zonaId/layout', ubicacionControlador.actualizarLayoutZona) // Nueva ruta
  ruta.put('/actualizar/:zonaId', ubicacionControlador.actualizarZonaCompleta)
  ruta.delete('/eliminar/:zonaId', ubicacionControlador.eliminarZona)
  ruta.delete('/eliminar-ubicacion/:ubicacionId', ubicacionControlador.eliminarUbicacion)
  return ruta
}
