import { BrowserRouter, Outlet, Route, Routes } from "react-router"
import AutorizacionLayout from "./auth/layout/AutorizacionLayout"
import { RutaProtegida } from "./auth/utils/RutaProtegida"
import { RutaPublica } from "./auth/utils/RutaPublica"
import { DashboardPage } from "./adminDashboard/DashboardPage"
import { RolesPage } from "./adminDashboard/rol/page/RolPage"


export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* RUTAS PARA PAGINAS QUE NO NECESITAS ESTAR LOGUEADO */}
        <Route element={<RutaPublica redireccionar={"/home"} />}>
          <Route path="/" element={<AutorizacionLayout />} />

        </Route>
        {/* RUTAS PARA PAGINAS PROTEGIDAS, USUARIOS QUE TENGAN TOKEN y ROLES */}
        <Route element={<RutaProtegida permitidos={['administrador']} />}>
          <Route path="/home" element={<Outlet />}>
            <Route path="/dashboard" element={<DashboardPage />}>
              <Route path="usuarios" element={<div>Usuarios</div>} />
              <Route path="roles" element={<RolesPage />} />
            </Route>
          </Route>
        </Route>

        <Route element={<RutaProtegida permitidos={['vendedor']} />}>
          <Route path="/ventas" element={<div>ruta para usuarios con rol de vendedor</div>} />
        </Route>

        <Route path="/clientes" element={<div>Clientes</div>} />
      </Routes>
    </BrowserRouter>

  )
}
