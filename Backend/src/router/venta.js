import { Router } from 'express'
import { VentaControlador } from '../controller/paquete-G-Venta/gestion-Venta/venta.js'

export const rutaVenta = ({ ventaServicio, stripeServicio }) => {
  const rutas = Router()
  const ventaControlador = new VentaControlador({ ventaServicio, stripeServicio })

  rutas.get('/filtrar-categoria', ventaControlador.FiltrarProductoPorCategoria)
  rutas.get('/buscar-productos', ventaControlador.BuscarProductos)
  rutas.post('/crear', ventaControlador.crearVenta)
  rutas.put('/actualizar/:id', ventaControlador.actualizarVenta)
  rutas.put('/pagar/:id', ventaControlador.marcarComoPagada)
  rutas.put('/anular/:id', ventaControlador.anularVenta)
  rutas.get('/listar/:id', ventaControlador.obtenerVenta)
  rutas.get('/listar', ventaControlador.listarVentas)
  rutas.get('/metodos-pago', ventaControlador.obtenerMetodosPago)
  rutas.get('/clientes', ventaControlador.obtenerClientes)
  rutas.get('/clientes/:id', ventaControlador.obtenerClientePorId)

  rutas.post('/:id/stripe-session', ventaControlador.crearSessionPago) // Crear session de Stripe
  rutas.get('/:id/verificar-pago', ventaControlador.verificarEstadoPago)

  return rutas
}
