import instanceAxios from '../../config/axios';

export const ventaApi = {
  consultarHistorial: async (filtros = {}) => {
    // Sanitizar: eliminar valores vacíos para evitar '?clave='
    const params = Object.fromEntries(
      Object.entries(filtros || {}).filter(([_, v]) => v !== undefined && v !== null && v !== '')
    );
    const { data } = await instanceAxios.get('/ventas/historial', { params });
    return data;
  }
};
