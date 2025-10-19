import { Route, Routes, useLocation } from "react-router"
import AutorizacionLayout from "./auth/layout/AutorizacionLayout"
import { RutaProtegida } from "./auth/utils/RutaProtegida"
import { RutaPublica } from "./auth/utils/RutaPublica"
import { DashboardPage } from "./adminDashboard/DashboardPage"
import { RolesPage } from "./adminDashboard/rol/page/RolPage"
import { SolicitudPassword } from "./auth/page/SolicitudPassword"
import { RestablecerPassword } from "./auth/page/RestablecerPassword"
import { AnimatePresence } from "motion/react"
import { TrancisionLayout } from "./auth/utils/TrancisionLayout"
import { NotFound } from "./utils/NotFound"
import { TrancisionPages } from "./auth/utils/TrancisionPages"
import { GestionUsuario } from "./adminDashboard/usuario/page/GestionUsuario"
import { GestionCategoria } from "./adminDashboard/categoria/page/GestionCategoria"
import { GestionProveedor } from "./adminDashboard/proveedor/page/GestionProveedor"
import GestionCompras from "./adminDashboard/compras/page/GestionCompras"
import { GestionProducto } from "./adminDashboard/producto.jsx/page/GestionProducto"
import { GestionProductoLayout } from "./adminDashboard/producto.jsx/layout/GestionProductoLayout"
import { Reportes } from "./adminDashboard/reporte/ReportePage"
import DetalleUsuarioBitacora from "./adminDashboard/bitacora/page/DetalleUsuarioBitacora"
import VistaUsuariosActivos from "./adminDashboard/bitacora/page/BitacoraCompleta"



export const AppRouter = () => {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* RUTAS PARA PAGINAS QUE NO NECESITAS ESTAR LOGUEADO */}
        <Route element={<RutaPublica redireccionar={"/home"} />}>
          <Route path="/" element={<AutorizacionLayout />} />
        </Route>
        {/* RUTAS PARA PAGINAS PROTEGIDAS, USUARIOS QUE TENGAN TOKEN y ROLES */}
        <Route element={<RutaProtegida permitidos={['administrador', 'vendedor']} />}>
          <Route path="/home" element={<DashboardPage />}>
            <Route path="usuarios" element={<GestionUsuario />} />
            <Route path="roles" element={<RolesPage />} />
            <Route path="categorias" element={<GestionCategoria />} />
            <Route path="proveedores" element={<GestionProveedor />} />
            <Route path="compras" element={<GestionCompras />} />
            <Route path="productos" element={<GestionProductoLayout />} >
            <Route path="reportes" element={<Reportes />} />
              <Route index element={<GestionProducto />} />
            </Route>
            <Route path="bitacora" element={<VistaUsuariosActivos />} />
            <Route path="bitacora/usuario/:usuarioId" element={<DetalleUsuarioBitacora />} />
          </Route>
        </Route>

        <Route element={<TrancisionLayout />}>
          <Route path="/solicitar-recuperamiento" element={<SolicitudPassword />} />
          <Route path="/restablecer-password" element={<RestablecerPassword />} />
        </Route>


        <Route path="/clientes" element={<div>Clientes</div>} />

        <Route path="*" element={<TrancisionPages>
          <NotFound />
        </TrancisionPages>} />
      </Routes>
    </AnimatePresence>
  )
}
