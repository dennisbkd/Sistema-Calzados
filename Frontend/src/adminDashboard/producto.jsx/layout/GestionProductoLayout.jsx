import { Package } from "lucide-react"
import { PageCabecera } from "../../../global/components/cabecera/PageCabecera"
import { Outlet } from "react-router"


export const GestionProductoLayout = () => {

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <PageCabecera
          titulo={"Gestión de Productos"}
          icono={Package}
          subtitulo={"Administra productos y sus variantes"}
        />
        <Outlet />
      </div>
    </div>
  )
}
