import instancia from '../../../config/axios'

export const crearCompra = async (input) => {
    return instancia.post('/compras/registrar', input)
}

export const editarCompra = async (input) => {
    return instancia.patch('/compras/editar', input)
}

export const eliminarCompra = async (id) => {
    return instancia.delete(`/compras/eliminar/${id}`)
}

export const listarCompras = async () => {
  const res = await instancia.get('/compras/listar')
  return res.data
}

export const generarCodigoFactura = async () => {
  const res = await instancia.get('/compras/generarCodigoFactura')
  return res.data
}