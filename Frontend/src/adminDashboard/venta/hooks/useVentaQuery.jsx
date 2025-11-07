import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { actualizarVenta, anularVenta, buscarProductos, crearSessionPagoStripe, crearVenta, listarVentas, marcarVentaComoPagada, obtenerClientes, obtenerMetodosPago, obtenerVenta, productosFiltrado, verificarEstadoPagoStripe } from "../../../api/venta/ventaApi"
import toast from "react-hot-toast"


export const useProductoFiltrado = (id, options = {}) => {
  return useQuery({
    queryKey: ['productosFiltrado', id],
    queryFn: () => productosFiltrado(id),
    ...options,
    staleTime: 1000 * 60 * 5,

  })
}

export const useBuscarProductos = (termino, options = {}) => {
  return useQuery({
    queryKey: ['buscarProductos', termino],
    queryFn: () => buscarProductos(termino),
    ...options,
    staleTime: 1000 * 60 * 5,

  })
}

// Obtener métodos de pago
export const useMetodosPago = (options = {}) => {
  return useQuery({
    queryKey: ['metodosPago'],
    queryFn: () => obtenerMetodosPago(),
    ...options,
    staleTime: 1000 * 60 * 30, // 30 minutos
  })
}

// Obtener clientes
export const useClientes = (options = {}) => {
  return useQuery({
    queryKey: ['clientes'],
    queryFn: () => obtenerClientes(),
    ...options,
    staleTime: 1000 * 60 * 30, // 30 minutos
  })
}

// Obtener venta por ID
export const useObtenerVenta = (ventaId, options = {}) => {
  return useQuery({
    queryKey: ['venta', ventaId],
    queryFn: () => obtenerVenta(ventaId),
    ...options,
    enabled: !!ventaId,
    staleTime: 1000 * 60 * 5,
  })
}


// Hook para listar ventas
export const useListarVentas = (filtros = {}, options = {}) => {
  return useQuery({
    queryKey: ['ventas', filtros],
    queryFn: () => listarVentas(filtros),
    ...options,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}


// ========== MUTATIONS ==========

// Crear venta
export const useCrearVenta = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: crearVenta,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productosFiltrado'] });
      queryClient.invalidateQueries({ queryKey: ['ventas'] });
    },
    onError: (error) => {
      console.error('Error al crear venta:', error);
      // Aquí puedes mostrar notificación de error
    }
  });
}

// Actualizar venta
export const useActualizarVenta = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ventaId, datos }) => actualizarVenta(ventaId, datos),
    onSuccess: (data, variables) => {
      // Invalidar la venta específica y la lista de ventas
      queryClient.invalidateQueries({ queryKey: ['venta', variables.ventaId] });
      queryClient.invalidateQueries({ queryKey: ['ventas'] });

      console.log('Venta actualizada exitosamente:', data);
    },
    onError: (error) => {
      console.error('Error al actualizar venta:', error);
    }
  });
}

// Anular venta
export const useAnularVenta = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ventaId, usuarioId, motivo }) =>
      anularVenta(ventaId, { usuarioId, motivo }),
    onSuccess: (data, variables) => {
      // Invalidar la venta específica y la lista de ventas
      queryClient.invalidateQueries({ queryKey: ['venta', variables.ventaId] });
      queryClient.invalidateQueries({ queryKey: ['ventas'] });

      toast.success('Venta anulada exitosamente');
    },
    onError: (error) => {
      toast.error('Error al anular venta');
      console.error('Error al anular venta:', error);
    }
  });
}

// Mutation para marcar como pagada
export const useMarcarComoPagada = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ventaId, metodoPagoId, referenciaPago }) => {
      marcarVentaComoPagada(ventaId, { metodoPagoId, referenciaPago });
    },
    onSuccess: (data, variables) => {
      // Invalidar y actualizar queries relacionadas
      console.log('Venta marcada como pagada exitosamente:', data);
      toast.success('Venta marcada como pagada exitosamente');
      queryClient.invalidateQueries(['ventas']);
      queryClient.invalidateQueries(['venta', variables.ventaId]);
    },
    onError: (error) => {
      toast.error('Error al marcar la venta como pagada');
      console.error('Error al marcar la venta como pagada:', error);
    }
  });
};

// queries/ventaQueries.js - CORREGIR y AGREGAR
export const useStripePago = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ ventaId }) => {
      return await crearSessionPagoStripe(ventaId); // Agregar return y await
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['venta', data.ventaId]);
      toast.success('Session de pago creada exitosamente');
    },
    onError: (error) => {
      toast.error(`Error creando session de pago: ${error.response?.data?.error || error.message}`);
    }
  });
};

// Nueva query para verificar estado de pago
export const useVerificarPagoStripe = (ventaId) => {
  return useQuery({
    queryKey: ['verificar-pago', ventaId],
    queryFn: async () => {
      return await verificarEstadoPagoStripe(ventaId);
    },
    enabled: !!ventaId,
    refetchInterval: 5000, // Verificar cada 5 segundos
    refetchIntervalInBackground: true,
  });
};