import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ventaApi } from '../../../api/ventaApi';
import { toast } from 'react-hot-toast';

export const useHistorialVentas = () => {
  const [filtros, setFiltros] = useState({
    fechaInicio: '',
    fechaFin: '',
    clienteId: '',
    empleadoId: '',
    estado: ''
  });

  const { data: ventas, isLoading, isError, refetch } = useQuery({
    queryKey: ['historialVentas', filtros],
    queryFn: () => ventaApi.consultarHistorial(filtros),
    onError: (error) => {
      toast.error(`Error al consultar historial: ${error.message}`);
    },
    enabled: false,
    staleTime: 1000 * 60
  });

  const actualizarFiltros = (nuevosFiltros) => {
    setFiltros(prev => ({ ...prev, ...nuevosFiltros }));
  };

  const buscar = async () => {
    if (filtros.fechaInicio && filtros.fechaFin) {
      const ini = new Date(filtros.fechaInicio);
      const fin = new Date(filtros.fechaFin);
      if (fin < ini) {
        toast.error('La fecha fin no puede ser anterior a la fecha inicio');
        return;
      }
    }
    await refetch();
  };

  return {
    ventas,
    filtros,
    isLoading,
    isError,
    actualizarFiltros,
    buscar
  };
};
