import { useMutation } from '@tanstack/react-query'
import { NuevaClave } from '../../api/auth/autorizacion'
import toast from 'react-hot-toast'

export const PasswordMutation = () => {
  const mutation = useMutation({
    mutationFn: (value) => NuevaClave(value),
    onSuccess: (data) => {
      console.log(data)
      toast.success(data.mensaje)
    },
    onError: (error) => {
      const errorBack = error.response.data.error || 'error al cambiar la contraseña'
      toast.error(errorBack)
    }
  })

  return mutation
}
