export class TransaccionPagoControlador {
    constructor({ transaccionPagoServicio }) {
        this.transaccionPagoServicio = transaccionPagoServicio
    }

    registrarPagoCompra = async (req, res) => {
        try {
            const data = req.body
            const resultado = await this.transaccionPagoServicio.registrarPagoCompra(data)

            if (resultado.error) {
                return res.status(400).json(resultado)
            }

            res.status(201).json(resultado)
        } catch (error) {
            console.error('Error al registrar pago de compra:', error)
            res.status(500).json({ mensaje: 'Error al registrar pago de compra' })
        }
    }

    registrarPagoVenta = async (req, res) => {
        try {
            const data = req.body
            const resultado = await this.transaccionPagoServicio.registrarPagoVenta(data)

            if (resultado.error) {
                return res.status(400).json(resultado)
            }

            res.status(201).json(resultado)
        } catch (error) {
            console.error('Error al registrar pago de venta:', error)
            res.status(500).json({ mensaje: 'Error al registrar pago de venta' })
        }
    }

    listarPagosCompra = async (req, res) => {
        try {
            const { compraId } = req.params
            const pagos = await this.transaccionPagoServicio.listarPagosCompra(compraId)
            res.json(pagos)
        } catch (error) {
            console.error('Error al listar pagos de compra:', error)
            res.status(500).json({ mensaje: 'Error al listar pagos de compra' })
        }
    }

    listarPagosVenta = async (req, res) => {
        try {
            const { ventaId } = req.params
            const pagos = await this.transaccionPagoServicio.listarPagosVenta(ventaId)
            res.json(pagos)
        } catch (error) {
            console.error('Error al listar pagos de venta:', error)
            res.status(500).json({ mensaje: 'Error al listar pagos de venta' })
        }
    }

    listarTodos = async (req, res) => {
        try {
            const pagos = await this.transaccionPagoServicio.listarTodos()
            res.json(pagos)
        } catch (error) {
            console.error('Error al listar todos los pagos:', error)
            res.status(500).json({ mensaje: 'Error al listar todos los pagos' })
        }
    }

    obtenerResumenCompra = async (req, res) => {
        try {
            const { compraId } = req.params
            const resumen = await this.transaccionPagoServicio.obtenerResumenCompra(compraId)

            if (resumen.error) {
                return res.status(404).json(resumen)
            }

            res.json(resumen)
        } catch (error) {
            console.error('Error al obtener resumen de compra:', error)
            res.status(500).json({ mensaje: 'Error al obtener resumen de compra' })
        }
    }

    eliminar = async (req, res) => {
        try {
            const { id } = req.params
            const resultado = await this.transaccionPagoServicio.eliminar(id)

            if (resultado.error) {
                return res.status(400).json(resultado)
            }

            res.json(resultado)
        } catch (error) {
            console.error('Error al eliminar pago:', error)
            res.status(400).json({ mensaje: error.message })
        }
    }
}