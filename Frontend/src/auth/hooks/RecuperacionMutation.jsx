
import { useMutation } from '@tanstack/react-query'
import { Recuperacion } from '../../api/auth/autorizacion'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router'

export const RecuperacionMutation = () => {
  const navigate = useNavigate()
  const mutation = useMutation({
    mutationFn: (value) => Recuperacion(value),
    onSuccess: (data) => {
      toast.success(data.mensaje)
      navigate('/home', { replace: true })
    },
    onError: (error) => {
      const errorBack = error.response.data.error
      toast.error(errorBack)
    }
  })

  return mutation
}
