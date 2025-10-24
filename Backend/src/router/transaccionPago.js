import { Router } from 'express'
import { TransaccionPagoControlador } from '../controller/gestion-pago/transaccionPago.js'

export const createTransaccionPagoRouter = ({ transaccionPagoServicio }) => {
    const transaccionPagoControlador = new TransaccionPagoControlador({ transaccionPagoServicio })
    const transaccionPagoRouter = Router()

    // Registrar pago de compra
    transaccionPagoRouter.post('/compra', transaccionPagoControlador.registrarPagoCompra)

    // Registrar pago de venta
    transaccionPagoRouter.post('/venta', transaccionPagoControlador.registrarPagoVenta)

    // Listar todos los pagos
    transaccionPagoRouter.get('/', transaccionPagoControlador.listarTodos)

    // Listar pagos de una compra
    transaccionPagoRouter.get('/compra/:compraId', transaccionPagoControlador.listarPagosCompra)

    // Listar pagos de una venta
    transaccionPagoRouter.get('/venta/:ventaId', transaccionPagoControlador.listarPagosVenta)

    // Obtener resumen de pagos de una compra
    transaccionPagoRouter.get('/compra/:compraId/resumen', transaccionPagoControlador.obtenerResumenCompra)

    // Eliminar un pago
    transaccionPagoRouter.delete('/:id', transaccionPagoControlador.eliminar)

    return transaccionPagoRouter
}