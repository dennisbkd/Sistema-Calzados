import { useMutation } from "@tanstack/react-query";
import { IniciarSesion } from "../../api/auth/autorizacion";
import toast from "react-hot-toast";

export const Authmutation = () => {
  const mutation = useMutation({
    mutationFn: (data) => IniciarSesion(data),
    onSuccess: (data) => {
      toast.success(data.mensaje)
      localStorage.setItem("token", data.token)
    },
    onError: (error, variable, context) => {
      toast.error(`Error en la llamada de la api ${error.message}`)
    }
  })

  return mutation
}

