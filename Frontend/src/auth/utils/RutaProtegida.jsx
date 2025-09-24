import { Navigate, Outlet } from "react-router"



export const RutaProtegida = ({ token, children, redireccionar = '/' }) => {

  if (!token) {
    return <Navigate to={redireccionar} replace />
  }
  return children ?? <Outlet />
}
