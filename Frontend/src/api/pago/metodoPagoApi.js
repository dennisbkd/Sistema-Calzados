import instancia from "../../../config/axios"

export const getMetodosPago = async (params = {}) => {
    const { data } = await instancia.get("/metodo-pago", { params })
    return data
}

export const getMetodosPagoActivos = async () => {
    const { data } = await instancia.get("/metodo-pago/activos")
    return data
}

export const getMetodoPagoById = async (id) => {
    const { data } = await instancia.get(`/metodo-pago/${id}`)
    return data
}

export const createMetodoPago = async (payload) => {
    const { data } = await instancia.post("/metodo-pago", payload)
    return data
}

export const updateMetodoPago = async (id, payload) => {
    const { data } = await instancia.put(`/metodo-pago/${id}`, payload)
    return data
}

export const toggleMetodoPago = async (id) => {
    const { data } = await instancia.patch(`/metodo-pago/${id}/toggle`)
    return data
}

export const deleteMetodoPago = async (id) => {
    const { data } = await instancia.delete(`/metodo-pago/${id}`)
    return data
}