import instanceAxios from '../../config/axios';

export const promocionApi = {
  crear: async (promocion) => {
    const { data } = await instanceAxios.post('/promociones', promocion);
    return data;
  },
  listar: async (filtros = {}) => {
    const { data } = await instanceAxios.get('/promociones', { params: filtros });
    return data;
  },
  editar: async (id, promocion) => {
    const { data } = await instanceAxios.put(`/promociones/${id}`, promocion);
    return data;
  },
  eliminar: async (id) => {
    const { data } = await instanceAxios.delete(`/promociones/${id}`);
    return data;
  }
};
