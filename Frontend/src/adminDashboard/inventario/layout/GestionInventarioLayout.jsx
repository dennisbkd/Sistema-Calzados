import { Warehouse } from "lucide-react"
import { PageCabecera } from "../../../global/components/cabecera/PageCabecera"
import { Outlet } from "react-router"

export const GestionInventarioLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <PageCabecera
          titulo="Gestion de Inventario"
          subtitulo="Genera notas de salida para controlar las mermas, donaciones y ajustes"
          icono={Warehouse}
        />
        <Outlet />
      </div>
    </div>
  )
}
