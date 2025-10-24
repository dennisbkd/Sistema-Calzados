import useMetodoPago from "./useMetodoPago"

export const useMetodoPagoManager = () => {
    const { items: metodosPago = [], loading: isLoading, error, toggle } = useMetodoPago()

    const toggleEstadoMetodoPago = (id) => {
        toggle(id)
    }

    return {
        metodosPago,
        isLoading,
        error,
        toggleEstadoMetodoPago,
        isCambiandoEstado: isLoading
    }
}