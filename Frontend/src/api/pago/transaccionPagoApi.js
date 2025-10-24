import instancia from "../../../config/axios"

// Registrar pago de compra
export const registrarPagoCompra = async ({ compraId, metodoPagoId, monto, referencia, fecha, observacion }) => {
    const { data } = await instancia.post("/pago/compra", {
        compraId,
        metodoPagoId,
        monto,
        referencia,
        fecha,
        observacion
    })
    return data
}

// Listado general
export const getTransacciones = async (params = {}) => {
    const { data } = await instancia.get("/pago", { params })
    return data
}

// Pagos por compra
export const getPagosPorCompra = async (compraId) => {
    const { data } = await instancia.get(`/pago/compra/${compraId}`)
    return data
}

// Resumen de una compra
export const getResumenCompra = async (compraId) => {
    const { data } = await instancia.get(`/pago/compra/${compraId}/resumen`)
    return data
}

// Eliminar pago
export const eliminarPago = async (id) => {
    const { data } = await instancia.delete(`/pago/${id}`)
    return data
}