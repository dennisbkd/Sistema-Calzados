import { Outlet } from "react-router"
import { PageCabecera } from "../../../global/components/cabecera/PageCabecera"
import { ShoppingCart } from "lucide-react"

export const NuevaVentaLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <PageCabecera
          titulo={"Nueva Venta"}
          icono={ShoppingCart}
          subtitulo={"Crear una nueva venta en el sistema"}
        />
        <Outlet />
      </div>
    </div>
  )
}
