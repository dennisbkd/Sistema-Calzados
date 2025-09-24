import { Outlet, Navigate } from "react-router"

export const RutaPublica = ({ redireccionar = '/' }) => {
  const token = !!localStorage.getItem('token')
  return token ? <Navigate to={redireccionar} /> : <Outlet />
}