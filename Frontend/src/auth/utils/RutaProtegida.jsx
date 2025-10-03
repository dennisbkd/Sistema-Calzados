import { Navigate, Outlet, useLocation } from "react-router"

const rutasPorRol = {
  administrador: "/home",
  vendedor: "/home",
  inventario: "/inventario"
}

export const RutaProtegida = ({ permitidos, children, redireccionar = '/' }) => {
  const token = localStorage.getItem('token')
  const usuarioGuardado = localStorage.getItem('usuario')
  const usuario = usuarioGuardado ? JSON.parse(usuarioGuardado) : null
  const rolesUsuario = usuario?.roles || []
  const location = useLocation()

  if (!token) {
    return <Navigate to={redireccionar} replace />
  }

  // Verificar acceso
  const tieneAcceso = rolesUsuario.some(rol => permitidos.includes(rol))
  if (!tieneAcceso) {
    return <Navigate to="/clientes" replace />
  }

  // ✅ SOLUCIÓN SIMPLE: Si está en la ruta correcta, mostrar contenido
  // Si no, redirigir según su rol principal
  const estaEnRutaCorrecta = rolesUsuario.some(rol => {
    const rutaDelRol = rutasPorRol[rol]
    return rutaDelRol && location.pathname.startsWith(rutaDelRol)
  })

  if (estaEnRutaCorrecta) {
    return children ? children : <Outlet />
  }

  // Redirigir a la ruta del primer rol válido
  const primerRolValido = rolesUsuario.find(rol => rutasPorRol[rol])
  if (primerRolValido) {
    return <Navigate to={rutasPorRol[primerRolValido]} replace />
  }

  // Fallback
  return <Navigate to="/clientes" replace />
}