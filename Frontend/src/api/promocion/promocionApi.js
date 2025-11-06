import instanceAxios from '../../../config/axios';

export const promocionApi = {
  crear: async (promocion) => {
    try {
      const { data } = await instanceAxios.post('/promociones', promocion)
      return data
    } catch (e) {
      // Fallback a rutas estilo del proyecto
      const { data } = await instanceAxios.post('/promociones/crear', promocion)
      return data
    }
  },
  listar: async (filtros = {}) => {
    try {
      const { data } = await instanceAxios.get('/promociones', { params: filtros })
      return data
    } catch (e) {
      const { data } = await instanceAxios.get('/promociones/listar', { params: filtros })
      return data
    }
  },
  editar: async (id, promocion) => {
    try {
      const { data } = await instanceAxios.put(`/promociones/${id}`, promocion)
      return data
    } catch (e) {
      const { data } = await instanceAxios.patch(`/promociones/editar/${id}`, promocion)
      return data
    }
  },
  eliminar: async (id) => {
    try {
      const { data } = await instanceAxios.delete(`/promociones/${id}`)
      return data
    } catch (e) {
      const { data } = await instanceAxios.delete(`/promociones/eliminar/${id}`)
      return data
    }
  }
};
