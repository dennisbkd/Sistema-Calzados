import { useMutation } from "@tanstack/react-query";
import { IniciarSesion } from "../../api/auth/autorizacion";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";


export const Authmutation = () => {
  const navigate = useNavigate()
  const mutation = useMutation({
    mutationFn: (data) => IniciarSesion(data),
    onSuccess: (data) => {
      toast.success(data.mensaje)
      localStorage.setItem("token", data.token)
      localStorage.setItem("usuario", JSON.stringify(data.usuario))
      navigate('/home', { replace: true })
    },
    onError: (error) => {
      const errorBack = error.response.data.error
      toast.error(`Error ${errorBack} intente de nuevo`)
    }
  })

  return mutation
}


