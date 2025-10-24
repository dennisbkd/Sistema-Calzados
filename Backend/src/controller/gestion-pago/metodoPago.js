export class MetodoPagoControlador {
    constructor({ metodoPagoServicio }) {
        this.metodoPagoServicio = metodoPagoServicio
    }

    listar = async (req, res) => {
        try {
            const metodos = await this.metodoPagoServicio.listar()
            res.json(metodos)
        } catch (error) {
            console.error('Error al listar métodos de pago:', error)
            res.status(500).json({ mensaje: 'Error al listar métodos de pago' })
        }
    }

    listarActivos = async (req, res) => {
        try {
            const metodos = await this.metodoPagoServicio.listarActivos()
            res.json(metodos)
        } catch (error) {
            console.error('Error al listar métodos activos:', error)
            res.status(500).json({ mensaje: 'Error al listar métodos activos' })
        }
    }

    obtener = async (req, res) => {
        try {
            const { id } = req.params
            const metodo = await this.metodoPagoServicio.obtener(id)

            if (metodo.error) {
                return res.status(404).json(metodo)
            }

            res.json(metodo)
        } catch (error) {
            console.error('Error al obtener método de pago:', error)
            res.status(404).json({ mensaje: error.message })
        }
    }

    crear = async (req, res) => {
        try {
            const data = req.body
            const nuevoMetodo = await this.metodoPagoServicio.crear(data)

            if (nuevoMetodo.error) {
                return res.status(400).json(nuevoMetodo)
            }

            res.status(201).json(nuevoMetodo)
        } catch (error) {
            console.error('Error al crear método de pago:', error)
            res.status(400).json({ mensaje: 'Error al crear método de pago' })
        }
    }

    actualizar = async (req, res) => {
        try {
            const { id } = req.params
            const data = req.body
            const metodoActualizado = await this.metodoPagoServicio.actualizar(id, data)

            if (metodoActualizado.error) {
                return res.status(400).json(metodoActualizado)
            }

            res.json(metodoActualizado)
        } catch (error) {
            console.error('Error al actualizar método de pago:', error)
            res.status(400).json({ mensaje: error.message })
        }
    }

    eliminar = async (req, res) => {
        try {
            const { id } = req.params
            const resultado = await this.metodoPagoServicio.eliminar(id)

            if (resultado.error) {
                return res.status(400).json(resultado)
            }

            res.json(resultado)
        } catch (error) {
            console.error('Error al eliminar método de pago:', error)
            res.status(400).json({ mensaje: error.message })
        }
    }

    toggleEstado = async (req, res) => {
        try {
            const { id } = req.params
            const metodo = await this.metodoPagoServicio.toggleEstado(id)

            if (metodo.error) {
                return res.status(400).json(metodo)
            }

            res.json(metodo)
        } catch (error) {
            console.error('Error al cambiar estado método de pago:', error)
            res.status(400).json({ mensaje: error.message })
        }
    }
}