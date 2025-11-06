import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { promocionApi } from '../../../api/promocionApi';
import toast from 'react-hot-toast';

export const usePromocionManager = () => {
  const queryClient = useQueryClient();

  const { data: promociones, isLoading } = useQuery({
    queryKey: ['promociones'],
    queryFn: () => promocionApi.listar(),
    staleTime: 1000 * 60 * 5
  });

  const crearPromocionMutation = useMutation({
    mutationFn: promocionApi.crear,
    onSuccess: () => {
      toast.success('Promoción creada exitosamente');
      queryClient.invalidateQueries(['promociones']);
    },
    onError: (error) => {
      toast.error(`Error al crear promoción: ${error.message}`);
    }
  });

  const editarPromocionMutation = useMutation({
    mutationFn: ({ id, datos }) => promocionApi.editar(id, datos),
    onSuccess: () => {
      toast.success('Promoción actualizada exitosamente');
      queryClient.invalidateQueries(['promociones']);
    },
    onError: (error) => {
      toast.error(`Error al editar promoción: ${error.message}`);
    }
  });

  const eliminarPromocionMutation = useMutation({
    mutationFn: promocionApi.eliminar,
    onSuccess: () => {
      toast.success('Promoción eliminada exitosamente');
      queryClient.invalidateQueries(['promociones']);
    },
    onError: (error) => {
      toast.error(`Error al eliminar promoción: ${error.message}`);
    }
  });

  return {
    promociones,
    isLoading,
    crearPromocion: crearPromocionMutation.mutate,
    editarPromocion: editarPromocionMutation.mutate,
    eliminarPromocion: eliminarPromocionMutation.mutate
  };
};