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
        <Route element={<RutaProtegida permitidos={['administrador']} />}>
          <Route path="/home" element={<DashboardPage />}>
            <Route path="usuarios" element={<div>Usuarios</div>} />
            <Route path="roles" element={<RolesPage />} />
          </Route>
        </Route>

        <Route element={<TrancisionLayout />}>
          <Route path="/solicitar-recuperamiento" element={<SolicitudPassword />} />
          <Route path="/restablecer-password" element={<RestablecerPassword />} />
        </Route>


        <Route element={<RutaProtegida permitidos={['vendedor']} />}>
          <Route path="/ventas" element={<p>ventas</p>} />
        </Route>

        <Route path="/clientes" element={<div>Clientes</div>} />

        <Route path="*" element={<TrancisionPages>
          <NotFound />
        </TrancisionPages>} />
      </Routes>
    </AnimatePresence>
  )
}
