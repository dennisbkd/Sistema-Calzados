import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  obtenerEstadoInventario,
  generarReporteInventario,
  listarMovimientosInventario,
  listarProductos,
  listarCategorias
} from '../../../api/inventario/inventarioApi.js'
import toast from 'react-hot-toast'

export const useInventario = () => {
  const queryClient = useQueryClient()

  // 1. Consultar estado de inventario
  const estadoInventario = useMutation({
    mutationFn: (filtros) => { 
      console.log("Consultando estado del inventario con filtros:", filtros)  
      return obtenerEstadoInventario(filtros)
    },
    onError: (error) => {
      console.error("Error en estadoInventario:", error)
      toast.error(`Error al consultar el inventario: ${error.message}`)
    }
  })

  // 2. Generar reporte de inventario
  const reporteInventario = useMutation({
    mutationFn: (filtros) => generarReporteInventario(filtros),
    onError: (error) => {
      console.error("Error en reporteInventario:", error)
      // toast.error(`Error al generar el reporte: ${error.message}`)
    }
  })

  // 3. Listar movimientos de inventario
  const movimientosInventario = useMutation({
    mutationFn: (filtros = {}) => listarMovimientosInventario(filtros),
    onError: (error) => {
      console.error("Error en movimientosInventario:", error)
      toast.error(`Error al cargar movimientos: ${error.message}`)
    }
  })

  // 4. Obtener productos por categoría - MUTATION MÁS SIMPLE
  const productosPorCategoria = useMutation({
    mutationFn: (categoriaId) => listarProductos(categoriaId),
    onError: (error) => {
      console.error("Error en productosPorCategoria:", error)
      toast.error('Error al cargar los productos')
    }
  })

  // 5. Consulta automática del estado
  const estadoAutomatico = useQuery({
    queryKey: ['estado-inventario-automatico'],
    queryFn: async () => {
      const res = await obtenerEstadoInventario({})
      return res || { estadisticas: {}, inventario: [] }
    },
    refetchOnWindowFocus: false,
    onError: (error) => {
      console.error("Error en estadoAutomatico:", error)
      toast.error('Error al cargar el estado del inventario')
    }
  })

  // 6. Consulta de productos (todos los productos)
  const productos = useQuery({
    queryKey: ['productos-inventario'],
    queryFn: async () => {
      const res = await listarProductos() // Sin parámetro para obtener todos
      return Array.isArray(res) ? res : []
    },
    onError: (error) => {
      console.error("Error en productos:", error)
      toast.error('Error al cargar los productos')
    }
  })

  // 7. Consulta de categorías
  const categorias = useQuery({
    queryKey: ['categorias-inventario'],
    queryFn: async () => {
      const res = await listarCategorias()
      return Array.isArray(res) ? res : []
    },
    onError: (error) => {
      console.error("Error en categorias:", error)
      toast.error('Error al cargar las categorías')
    }
  })

  // Invalidar consultas
  const invalidarInventario = () => {
    queryClient.invalidateQueries(['estado-inventario-automatico'])
    queryClient.invalidateQueries(['movimientos-inventario'])
    queryClient.invalidateQueries(['productos-inventario'])
  }

  return {
    // Mutations
    estadoInventario,
    reporteInventario,
    movimientosInventario,
    productosPorCategoria, // ← NUEVA MUTATION

    // Queries
    estadoAutomatico,
    productos,
    categorias,

    // Utilidades
    invalidarInventario
  }
}