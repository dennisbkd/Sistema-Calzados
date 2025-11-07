import instancia from "../../../config/axios"

export const productosFiltrado = async (id)=>{
  const res = await instancia.get(`/ventas/filtrar-categoria`,{
    params: { id }   
  });
  return res.data
}

export const buscarProductos = async (termino) => {
  const res = await instancia.get(`/ventas/buscar-productos`, {
    params: { termino }
  });
  return res.data;
}

// Crear venta
export const crearVenta = async (datosVenta) => {
  const res = await instancia.post('/ventas/crear', datosVenta);
  return res.data;
}

// Actualizar venta
export const actualizarVenta = async (ventaId, datosActualizados) => {
  const res = await instancia.put(`/ventas/actualizar/${ventaId}`, datosActualizados);
  return res.data;
}

// Anular venta
export const anularVenta = async (ventaId, datosAnulacion) => {
  const res = await instancia.put(`/ventas/anular/${ventaId}`, datosAnulacion);
  return res.data;
}

// Obtener venta por ID
export const obtenerVenta = async (ventaId) => {
  const res = await instancia.get(`/ventas/listar/${ventaId}`);
  return res.data;
}

export const marcarVentaComoPagada = async (ventaId, { metodoPagoId, referenciaPago }) => {
      const res = await instancia.put(`/ventas/pagar/${ventaId}`, {
        metodoPagoId,
        referenciaPago
      });
  return res.data;
}

// Listar ventas con paginación y filtros
export const listarVentas = async (filtros = {}) => {
  const params = new URLSearchParams();

  // Agregar parámetros de paginación
  if (filtros.pagina) params.append('pagina', filtros.pagina);
  if (filtros.limite) params.append('limite', filtros.limite);

  // Agregar filtros
  if (filtros.estado) params.append('estado', filtros.estado);
  if (filtros.clienteId) params.append('clienteId', filtros.clienteId);
  if (filtros.fechaInicio) params.append('fechaInicio', filtros.fechaInicio);
  if (filtros.fechaFin) params.append('fechaFin', filtros.fechaFin);
  if (filtros.nroFactura) params.append('nroFactura', filtros.nroFactura);

  const res = await instancia.get(`/ventas/listar?${params.toString()}`);
  return res.data;
}

// Obtener métodos de pago
export const obtenerMetodosPago = async () => {
  const res = await instancia.get('/ventas/metodos-pago');
  return res.data;
}

// Obtener clientes
export const obtenerClientes = async () => {
  const res = await instancia.get('/ventas/clientes');
  return res.data;
}

// Obtener cliente por ID
export const obtenerClientePorId = async (clienteId) => {
  const res = await instancia.get(`/ventas/clientes/${clienteId}`);
  return res.data;
}

export const crearSessionPagoStripe = async (ventaId) => {
  const res = await instancia.post(`/ventas/${ventaId}/stripe-session`);
  return res.data;
}

export const verificarEstadoPagoStripe = async (ventaId) => {
  const res = await instancia.get(`/ventas/${ventaId}/verificar-pago`);
  return res.data;
}