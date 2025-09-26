import instancia from '../../../config/axios'

export const crearRol = async (input) => {
    return instancia.post('/rol/crear', input)
}

export const editarRol = async (input) => {
    return instancia.patch('/rol/editar', input)
}

export const eliminarRol = async (id) => {
    return instancia.delete(`/rol/eliminar/${id}`)
}

export const listarRoles = async () => {
  const res = await instancia.get('/rol/listar')
  return res.data
}