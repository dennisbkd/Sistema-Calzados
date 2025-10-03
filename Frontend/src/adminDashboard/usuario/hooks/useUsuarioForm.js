// hooks/useUsuarioForm.js
import { useActualizarUsuario, useCrearUsuario } from './useUsuarioQuery'
import { useFormModal } from '../../../global/hooks/useFormModal';

export const useUsuarioForm = () => {
  const modal = useFormModal()
  const crearMutation = useCrearUsuario()
  const actualizarMutation = useActualizarUsuario()

  const guardarUsuario = async (datos) => { 
      if (modal.data) {
        // Editar usuario existente - no incluir password si no se cambió
        const datosParaActualizar = { ...datos }
        if (!datosParaActualizar.password) {
          delete datosParaActualizar.password
        }
        actualizarMutation.mutate({
          id: modal.data.id,
          data: datosParaActualizar
        })
      } else {
        // Crear nuevo usuario - password requerido
       crearMutation.mutate(datos)
      }
      modal.cerrar()
     }

     
  const formConfig = {
    defaultValues: {
      nombre: modal.data?.nombre || '',
      email: modal.data?.email || '',
      telefono: modal.data?.telefono || '',
      password: '', // Siempre vacío por seguridad
      roles: modal.data?.roles || []
    }
  }

  return {
    modal,
    guardarUsuario,
    formConfig,
    isLoading: crearMutation.isPending || actualizarMutation.isPending
  }
}