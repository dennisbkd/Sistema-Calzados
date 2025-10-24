import { Router } from 'express'
import { MetodoPagoControlador } from '../controller/gestion-pago/metodoPago.js'

export const createMetodoPagoRouter = ({ metodoPagoServicio }) => {
    const metodoPagoControlador = new MetodoPagoControlador({ metodoPagoServicio })
    const metodoPagoRouter = Router()

    // Listar todos los métodos de pago
    metodoPagoRouter.get('/', metodoPagoControlador.listar)

    // Listar solo métodos activos
    metodoPagoRouter.get('/activos', metodoPagoControlador.listarActivos)

    // Obtener un método de pago por ID
    metodoPagoRouter.get('/:id', metodoPagoControlador.obtener)

    // Crear nuevo método de pago
    metodoPagoRouter.post('/', metodoPagoControlador.crear)

    // Actualizar método de pago
    metodoPagoRouter.put('/:id', metodoPagoControlador.actualizar)

    // Cambiar estado (activo/inactivo)
    metodoPagoRouter.patch('/:id/toggle', metodoPagoControlador.toggleEstado)

    // Eliminar método de pago
    metodoPagoRouter.delete('/:id', metodoPagoControlador.eliminar)

    return metodoPagoRouter
}