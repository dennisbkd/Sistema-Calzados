import { BrowserRouter, Route, Routes } from "react-router"
import AutorizacionLayout from "./auth/layout/AutorizacionLayout"
import { RutaProtegida } from "./auth/utils/RutaProtegida"
import { DashboardPage } from "./adminDashboard/DashboardPage"
import { RolesPage } from "./adminDashboard/rol/page/RolPage"


export const AppRouter = () => {
  // const token = localStorage.getItem('token')
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AutorizacionLayout />} />
        {/* <Route element={<RutaProtegida token={token} />}> */}
          <Route path="/home" element={<div>protegido</div>} />
          <Route path="/dashboard" element={<DashboardPage />}>
            <Route path="usuarios" element={<div>Usuarios</div>} />
            <Route path="roles" element={<RolesPage />} />
          </Route>
        {/* </Route> */}
      </Routes>
    </BrowserRouter>

  )
}
