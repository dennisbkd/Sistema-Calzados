import { BrowserRouter, Route, Routes } from "react-router"
import AutorizacionLayout from "./auth/layout/AutorizacionLayout"
import { RutaProtegida } from "./auth/utils/RutaProtegida"



export const AppRouter = () => {
  const token = localStorage.getItem('token')
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AutorizacionLayout />} />
        <Route element={<RutaProtegida token={token} />}>
          <Route path="/home" element={<div>protegido</div>} />
        </Route>
      </Routes>
    </BrowserRouter>

  )
}
