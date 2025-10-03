/* eslint-disable no-unused-vars */
import { Users } from "lucide-react"

export const ListaVacia = ({
  icon: Icon = Users,
  titulo = "No se encontraron elementos",
  mensaje = "No hay datos para mostrar",
  tamañoIcono = 48
}) => {
  return (
    <div className="text-center py-12">
      <Icon className="mx-auto text-gray-400 mb-4" size={tamañoIcono} />
      <p className="text-gray-500 text-lg">{titulo}</p>
      {mensaje && <p className="text-gray-400 text-sm mt-2">{mensaje}</p>}
    </div>
  )
}