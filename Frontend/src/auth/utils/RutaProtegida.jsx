import { Navigate, Outlet } from "react-router"

const rutasPorRol = {
  inventario: "/inventario",
  vendedor: "/venta",
  administrador: "/home"
  // ACA SE AUMENTA LAS RUTAS PARA EL ROL QUE LO NECESITE.
}

export const RutaProtegida = ({ permitidos, children, redireccionar = '/' }) => {
  const token = localStorage.getItem('token')
  const usuarioGuardado = localStorage.getItem('usuario')
  const usuario = usuarioGuardado ? JSON.parse(usuarioGuardado) : null
  const rolesUsuario = usuario?.roles || []



  if (!token) {
    return <Navigate to={redireccionar} />
  }

  if (rolesUsuario.includes("administrador")) {
    return children ? children : <Outlet />
  }

  const esPermitido = rolesUsuario.some(rol => permitidos.includes(rol))
  // Si tiene token pero no está en los roles permitidos
  if (!esPermitido) {
    return <Navigate to="/clientes" />
  }

  // Si tiene token y está permitido, redirigir segun su rol 
  const primerRolValido = rolesUsuario.find(rol => rutasPorRol[rol])
  const rutaPorRol = rutasPorRol[primerRolValido]

  if (rutaPorRol && window.location.pathname !== rutaPorRol) {
    return <Navigate to={rutaPorRol} />
  }

  return children ? children : <Outlet />
}