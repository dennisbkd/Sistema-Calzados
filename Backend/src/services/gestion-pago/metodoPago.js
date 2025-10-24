export class MetodoPagoServicio {
    constructor({ modeloMetodoPago }) {
        this.modeloMetodoPago = modeloMetodoPago
    }

    // Listar todos los métodos de pago
    listar = async () => {
        try {
            const metodos = await this.modeloMetodoPago.findAll({
                attributes: ['id', 'nombre', 'descripcion', 'activo', 'createdAt'],
                order: [['nombre', 'ASC']]
            })

            if (metodos.length === 0) return []

            const metodosDto = metodos.map(metodo => {
                const hora = new Date(metodo.createdAt).toISOString().substring(11, 16)
                const fecha = metodo.createdAt.toISOString().split('T')[0]

                return {
                    id: metodo.id,
                    nombre: metodo.nombre,
                    descripcion: metodo.descripcion,
                    activo: metodo.activo,
                    fechaRegistro: fecha,
                    hora
                }
            })

            return metodosDto
        } catch (e) {
            console.error('Error al consultar métodos de pago:', e)
            return []
        }
    }

    // Obtener un método de pago por ID
    obtener = async (id) => {
        try {
            const metodo = await this.modeloMetodoPago.findByPk(id, {
                attributes: ['id', 'nombre', 'descripcion', 'activo', 'createdAt']
            })
            if (!metodo) return { error: 'Método de pago no encontrado' }

            const hora = new Date(metodo.createdAt).toISOString().substring(11, 16)
            const fecha = metodo.createdAt.toISOString().split('T')[0]

            return {
                id: metodo.id,
                nombre: metodo.nombre,
                descripcion: metodo.descripcion,
                activo: metodo.activo,
                fechaRegistro: fecha,
                hora
            }
        } catch (e) {
            console.error('Error al consultar el método de pago:', e)
            return { error: 'Error al consultar el método de pago' }
        }
    }

    // Crear método de pago
    crear = async ({ nombre, descripcion }) => {
        try {
            const nuevo = await this.modeloMetodoPago.create({
                nombre,
                descripcion,
                activo: true
            })

            const hora = new Date(nuevo.createdAt).toISOString().substring(11, 16)
            const fecha = nuevo.createdAt.toISOString().split('T')[0]

            return {
                id: nuevo.id,
                nombre: nuevo.nombre,
                descripcion: nuevo.descripcion,
                activo: nuevo.activo,
                fechaRegistro: fecha,
                hora
            }
        } catch (e) {
            console.error('Error al crear el método de pago:', e)
            return { error: 'Error al crear el método de pago' }
        }
    }

    // Actualizar método de pago
    actualizar = async (id, { nombre, descripcion }) => {
        try {
            const metodo = await this.modeloMetodoPago.findByPk(id)
            if (!metodo) return { error: 'Método de pago no encontrado' }

            await metodo.update({ nombre, descripcion })

            const hora = new Date(metodo.createdAt).toISOString().substring(11, 16)
            const fecha = metodo.createdAt.toISOString().split('T')[0]

            return {
                id: metodo.id,
                nombre: metodo.nombre,
                descripcion: metodo.descripcion,
                activo: metodo.activo,
                fechaRegistro: fecha,
                hora
            }
        } catch (e) {
            console.error('Error al actualizar el método de pago:', e)
            return { error: 'Error al actualizar el método de pago' }
        }
    }

    // Toggle de estado (activo/inactivo)
    toggleEstado = async (id) => {
        try {
            const metodo = await this.modeloMetodoPago.findByPk(id)
            if (!metodo) return { error: 'Método de pago no encontrado' }

            await metodo.update({ activo: !metodo.activo })
            return {
                mensaje: `Estado del método de pago actualizado a ${metodo.activo ? 'Activo' : 'Inactivo'}`
            }
        } catch (e) {
            console.error('Error al cambiar estado del método de pago:', e)
            return { error: 'Error al cambiar estado del método de pago' }
        }
    }

    // Eliminar método de pago
    eliminar = async (id) => {
        try {
            const metodo = await this.modeloMetodoPago.findByPk(id)
            if (!metodo) return { error: 'Método de pago no encontrado' }

            await metodo.destroy()
            return { mensaje: 'Método de pago eliminado correctamente' }
        } catch (e) {
            console.error('Error al eliminar método de pago:', e)
            return { error: 'Error al eliminar método de pago' }
        }
    }

    // Listar solo métodos activos
    listarActivos = async () => {
        try {
            const metodos = await this.modeloMetodoPago.findAll({
                where: { activo: true },
                attributes: ['id', 'nombre', 'descripcion'],
                order: [['nombre', 'ASC']]
            })

            return metodos.map(m => ({
                id: m.id,
                nombre: m.nombre,
                descripcion: m.descripcion
            }))
        } catch (e) {
            console.error('Error al consultar métodos activos:', e)
            return []
        }
    }
}