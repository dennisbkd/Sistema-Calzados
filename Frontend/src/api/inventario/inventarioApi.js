import instancia from '../../../config/axios'

// Estado del inventario
export const obtenerEstadoInventario = async (filtros) => {
  const res = await instancia.post('/inventario/estado-Inventario', filtros)
  return res.data
} 

// Reportes de inventario
export const generarReporteInventario = async (filtros) => {
  const res = await instancia.post('/inventario/reporte-Inventario', filtros)
  return res.data
}

// Movimientos de inventario
export const listarMovimientosInventario = async (filtros = {}) => {
  const res = await instancia.post('/inventario/movimientos-Inventario', filtros)
  return res.data
}

// Listar productos (para filtros)
export const listarProductos = async (categoriaId = null) => {
  const params = {}
  if (categoriaId) params.categoriaId = categoriaId
  
  const res = await instancia.get('/inventario/productos', { params })
  return res.data
}

// Listar categorías (para filtros)
export const listarCategorias = async () => {
  const res = await instancia.get('/inventario/categorias')
  return res.data
}