export class TransaccionPagoServicio {
    constructor({ modeloTransaccionPago, modeloMetodoPago, modeloCompra, modeloVenta }) {
        this.modeloTransaccionPago = modeloTransaccionPago
        this.modeloMetodoPago = modeloMetodoPago
        this.modeloCompra = modeloCompra
        this.modeloVenta = modeloVenta
    }

    // Registrar pago de una compra
    registrarPagoCompra = async ({ compraId, metodoPagoId, monto, referencia }) => {
        try {
            // Verificar que existe la compra
            const compra = await this.modeloCompra.findByPk(compraId)
            if (!compra) return { error: 'Compra no encontrada' }

            // Verificar que existe el método de pago y está activo
            const metodoPago = await this.modeloMetodoPago.findByPk(metodoPagoId)
            if (!metodoPago) return { error: 'Método de pago no encontrado' }
            if (!metodoPago.activo) return { error: 'El método de pago está inactivo' }

            // Calcular total ya pagado
            const pagosAnteriores = await this.modeloTransaccionPago.findAll({
                where: { compraId, tipoTransaccion: 'COMPRA' }
            })
            const totalPagado = pagosAnteriores.reduce((sum, p) => sum + parseFloat(p.monto), 0)
            const montoPendiente = parseFloat(compra.total) - totalPagado

            // Validar que no se pague más del total
            if (parseFloat(monto) > montoPendiente) {
                return {
                    error: `El monto excede el pendiente. Pendiente: Bs. ${montoPendiente.toFixed(2)}`
                }
            }

            // Registrar el pago
            const nuevoPago = await this.modeloTransaccionPago.create({
                tipoTransaccion: 'COMPRA',
                compraId,
                metodoPagoId,
                monto,
                referencia
            })

            // Calcular nuevo total pagado
            const nuevoTotalPagado = totalPagado + parseFloat(monto)
            const nuevoMontoPendiente = parseFloat(compra.total) - nuevoTotalPagado

            // Actualizar estado de la compra
            let nuevoEstado = compra.estado
            if (nuevoMontoPendiente === 0) {
                nuevoEstado = 'PAGADA'
            } else if (nuevoTotalPagado > 0) {
                nuevoEstado = 'PAGO_PARCIAL'
            }

            if (nuevoEstado !== compra.estado) {
                await compra.update({ estado: nuevoEstado })
            }

            return {
                mensaje: 'Pago registrado correctamente',
                pago: {
                    id: nuevoPago.id,
                    monto: nuevoPago.monto,
                    referencia: nuevoPago.referencia,
                    fecha: nuevoPago.createdAt
                },
                resumen: {
                    totalCompra: parseFloat(compra.total),
                    totalPagado: nuevoTotalPagado,
                    montoPendiente: nuevoMontoPendiente,
                    estadoCompra: nuevoEstado
                }
            }
        } catch (e) {
            console.error('Error al registrar pago de compra:', e)
            return { error: 'Error al registrar pago de compra' }
        }
    }

    // Registrar pago de una venta
    registrarPagoVenta = async ({ ventaId, metodoPagoId, monto, referencia }) => {
        try {
            // Verificar que existe la venta
            const venta = await this.modeloVenta.findByPk(ventaId)
            if (!venta) return { error: 'Venta no encontrada' }

            // Verificar que existe el método de pago y está activo
            const metodoPago = await this.modeloMetodoPago.findByPk(metodoPagoId)
            if (!metodoPago) return { error: 'Método de pago no encontrado' }
            if (!metodoPago.activo) return { error: 'El método de pago está inactivo' }

            // Calcular total ya pagado
            const pagosAnteriores = await this.modeloTransaccionPago.findAll({
                where: { ventaId, tipoTransaccion: 'VENTA' }
            })
            const totalPagado = pagosAnteriores.reduce((sum, p) => sum + parseFloat(p.monto), 0)
            const montoPendiente = parseFloat(venta.total) - totalPagado

            // Validar que no se pague más del total
            if (parseFloat(monto) > montoPendiente) {
                return {
                    error: `El monto excede el pendiente. Pendiente: Bs. ${montoPendiente.toFixed(2)}`
                }
            }

            // Registrar el pago
            const nuevoPago = await this.modeloTransaccionPago.create({
                tipoTransaccion: 'VENTA',
                ventaId,
                metodoPagoId,
                monto,
                referencia
            })

            // Calcular nuevo total pagado
            const nuevoTotalPagado = totalPagado + parseFloat(monto)
            const nuevoMontoPendiente = parseFloat(venta.total) - nuevoTotalPagado

            // Actualizar estado de la venta
            let nuevoEstado = venta.estado
            if (nuevoMontoPendiente === 0) {
                nuevoEstado = 'PAGADA'
            }

            if (nuevoEstado !== venta.estado) {
                await venta.update({ estado: nuevoEstado })
            }

            return {
                mensaje: 'Pago registrado correctamente',
                pago: {
                    id: nuevoPago.id,
                    monto: nuevoPago.monto,
                    referencia: nuevoPago.referencia,
                    fecha: nuevoPago.createdAt
                },
                resumen: {
                    totalVenta: parseFloat(venta.total),
                    totalPagado: nuevoTotalPagado,
                    montoPendiente: nuevoMontoPendiente,
                    estadoVenta: nuevoEstado
                }
            }
        } catch (e) {
            console.error('Error al registrar pago de venta:', e)
            return { error: 'Error al registrar pago de venta' }
        }
    }

    // Listar pagos de una compra
    listarPagosCompra = async (compraId) => {
        try {
            const pagos = await this.modeloTransaccionPago.findAll({
                where: { compraId, tipoTransaccion: 'COMPRA' },
                include: [
                    {
                        model: this.modeloMetodoPago,
                        as: 'metodoPago',
                        attributes: ['nombre']
                    }
                ],
                order: [['createdAt', 'DESC']]
            })

            return pagos.map(pago => {
                const fecha = new Date(pago.createdAt)
                return {
                    id: pago.id,
                    monto: parseFloat(pago.monto),
                    metodoPago: pago.metodoPago?.nombre || 'N/A',
                    referencia: pago.referencia,
                    fecha: fecha.toISOString().split('T')[0],
                    hora: fecha.toTimeString().split(' ')[0]
                }
            })
        } catch (e) {
            console.error('Error al listar pagos de compra:', e)
            return []
        }
    }

    // Listar pagos de una venta
    listarPagosVenta = async (ventaId) => {
        try {
            const pagos = await this.modeloTransaccionPago.findAll({
                where: { ventaId, tipoTransaccion: 'VENTA' },
                include: [
                    {
                        model: this.modeloMetodoPago,
                        as: 'metodoPago',
                        attributes: ['nombre']
                    }
                ],
                order: [['createdAt', 'DESC']]
            })

            return pagos.map(pago => {
                const fecha = new Date(pago.createdAt)
                return {
                    id: pago.id,
                    monto: parseFloat(pago.monto),
                    metodoPago: pago.metodoPago?.nombre || 'N/A',
                    referencia: pago.referencia,
                    fecha: fecha.toISOString().split('T')[0],
                    hora: fecha.toTimeString().split(' ')[0]
                }
            })
        } catch (e) {
            console.error('Error al listar pagos de venta:', e)
            return []
        }
    }

    // Listar todos los pagos
    listarTodos = async () => {
        try {
            const pagos = await this.modeloTransaccionPago.findAll({
                include: [
                    {
                        model: this.modeloMetodoPago,
                        as: 'metodoPago',
                        attributes: ['nombre']
                    }
                ],
                order: [['createdAt', 'DESC']]
            })

            return pagos.map(pago => {
                const fecha = new Date(pago.createdAt)
                return {
                    id: pago.id,
                    tipo: pago.tipoTransaccion,
                    compraId: pago.compraId,
                    ventaId: pago.ventaId,
                    monto: parseFloat(pago.monto),
                    metodoPago: pago.metodoPago?.nombre || 'N/A',
                    referencia: pago.referencia,
                    fecha: fecha.toISOString().split('T')[0],
                    hora: fecha.toTimeString().split(' ')[0]
                }
            })
        } catch (e) {
            console.error('Error al listar todos los pagos:', e)
            return []
        }
    }

    // Eliminar un pago
    eliminar = async (id) => {
        try {
            const pago = await this.modeloTransaccionPago.findByPk(id)
            if (!pago) return { error: 'Pago no encontrado' }

            await pago.destroy()
            return { mensaje: 'Pago eliminado correctamente' }
        } catch (e) {
            console.error('Error al eliminar pago:', e)
            return { error: 'Error al eliminar pago' }
        }
    }

    // Obtener resumen de pagos de una compra
    obtenerResumenCompra = async (compraId) => {
        try {
            const compra = await this.modeloCompra.findByPk(compraId)
            if (!compra) return { error: 'Compra no encontrada' }

            const pagos = await this.modeloTransaccionPago.findAll({
                where: { compraId, tipoTransaccion: 'COMPRA' }
            })

            const totalPagado = pagos.reduce((sum, p) => sum + parseFloat(p.monto), 0)
            const montoPendiente = parseFloat(compra.total) - totalPagado

            return {
                totalCompra: parseFloat(compra.total),
                totalPagado,
                montoPendiente,
                cantidadPagos: pagos.length,
                estadoCompra: compra.estado
            }
        } catch (e) {
            console.error('Error al obtener resumen de compra:', e)
            return { error: 'Error al obtener resumen de compra' }
        }
    }
}