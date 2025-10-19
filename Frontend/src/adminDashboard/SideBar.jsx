import { Link, useLocation } from "react-router"
import {
  LayoutDashboard,
  UserCheck,
  ShoppingCart,
  Package,
  Warehouse,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Users,
  Shield,
  Archive,
  Tag,
  FileArchive,
  Truck,
  BarChart,
} from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import { useState, useEffect } from "react"

export const SideBar = () => {
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [usuario, setUsuario] = useState(null)
  // Detectar si es móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setIsOpen(false)
      } else {
        setIsOpen(true)
      }
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Estado de submenús
  const [openSubmenus, setOpenSubmenus] = useState({
    usuarios: location.pathname.startsWith("/home/usuarios") || location.pathname.startsWith("/home/roles")
  })

  const menuItems = [
    {
      title: "Dashboard",
      path: "/home",
      icon: LayoutDashboard,
      exact: true
    },
    {
      title: "Gestión Usuarios",
      icon: UserCheck,
      key: "usuarios",
      subItems: [
        { title: "Usuarios", path: "/home/usuarios", icon: Users },
        { title: "Roles", path: "/home/roles", icon: Shield },
      ],
    },
    {
      title: "Gestión Ventas",
      path: "/home/ventas",
      icon: ShoppingCart
    },
    {
      title: "Gestión Compras",
      icon: Package,
      key: "compras",
      subItems: [
        { title: "Compras", path: "/home/compras", icon: Package },
        { title: "Proveedores", path: "/home/proveedores", icon: Truck },
      ],
    },
    {
      title: "Gestión Inventario",
      path: "/home/inventario",
      icon: Warehouse
    },
    {
      title: "Gestión Producto",
      icon: Archive,
      key: "productos",
      subItems: [
        { title: "Productos", path: "/home/productos", icon: Archive },
        { title: "Categorías", path: "/home/categorias", icon: Tag },
      ],
    },
    {
      title: "Reportes",
      icon: BarChart,
      key: "reportes",
      subItems: [
        { title: "Reportes", path: "/home/reportes", icon: BarChart }
      ],
    },
    {
      title: "Bitacora",
      icon: FileArchive,
      key: "bitacora",
      subItems: [
        { title: "Visualizar Registros", path: "/home/bitacora", icon: FileArchive }
      ],
    }
  ]

  const toggleSubmenu = (key) => {
    // Si el sidebar está cerrado en desktop, abrirlo primero
    if (!isMobile && !isOpen) {
      setIsOpen(true)
      // Esperar a que se abra el sidebar antes de abrir el submenu
      setTimeout(() => {
        setOpenSubmenus(prev => ({
          ...prev,
          [key]: true
        }))
      }, 300)
    } else {
      setOpenSubmenus(prev => ({
        ...prev,
        [key]: !prev[key]
      }))
    }
  }

  // Cargar usuario del localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("usuario")
    if (storedUser) {
      try {
        setUsuario(JSON.parse(storedUser))
      } catch (error) {
        console.error("Error al parsear usuario:", error)
      }
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("usuario")
    window.location.href = "/"
  }


  const closeMobileMenu = () => {
    if (isMobile) {
      setMobileOpen(false)
    }
  }

  const isActive = (item) => {
    if (item.exact) {
      return location.pathname === item.path
    }
    return location.pathname.startsWith(item.path)
  }

  // Función auxiliar para determinar si mostrar contenido expandido
  const shouldShowExpanded = () => {
    return isMobile ? mobileOpen : isOpen
  }

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="fixed top-4 left-4 z-50 bg-blue-600 text-white p-2 rounded-lg shadow-lg md:hidden"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      )}

      {/* Overlay para móvil */}
      {isMobile && mobileOpen && (
        <div
          className="fixed inset-0 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.div
        animate={{
          width: isMobile ? (mobileOpen ? 280 : 0) : (isOpen ? 280 : 80),
          x: isMobile ? (mobileOpen ? 0 : -280) : 0
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed md:relative bg-gradient-to-b from-blue-700 to-blue-600 text-white h-full flex flex-col z-40 shadow-xl overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 border-b border-blue-500 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`${shouldShowExpanded() ? 'w-10 h-10' : 'w-8 h-8 mx-auto'} bg-white rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 transition-all`}>
              <Package className={`${shouldShowExpanded() ? 'w-6 h-6' : 'w-5 h-5'} text-blue-600`} />
            </div>
            <AnimatePresence mode="wait">
              {shouldShowExpanded() && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="min-w-0"
                >
                  <h1 className="text-xl font-bold truncate">Calzados Al Paso</h1>
                  <p className="text-blue-100 text-sm truncate">Calzados Premium</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Toggle Button - Solo en desktop */}
          {!isMobile && shouldShowExpanded() && (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-blue-100 hover:text-white hover:bg-blue-500 rounded-lg p-1 transition-colors flex-shrink-0"
            >
              <ChevronDown size={16} className="rotate-90" />
            </button>
          )}
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon
            const hasSub = !!item.subItems
            const active = isActive(item)
            const submenuOpen = openSubmenus[item.key]

            return (
              <div key={item.title}>
                {/* Item principal */}
                {hasSub ? (
                  <motion.div
                    whileHover={{ scale: shouldShowExpanded() ? 1.02 : 1 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${active ? "bg-white text-blue-700 shadow-lg" : "text-blue-100 hover:bg-blue-500 hover:text-white"
                      } ${!shouldShowExpanded() ? 'justify-center' : ''}`}
                    onClick={() => toggleSubmenu(item.key)}
                  >
                    <div className={`flex items-center ${shouldShowExpanded() ? 'gap-3' : 'justify-center'} min-w-0`}>
                      <div className={`p-2 rounded-lg ${active ? "bg-blue-100" : "bg-blue-500"
                        } ${!shouldShowExpanded() ? 'mx-auto' : ''}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <AnimatePresence>
                        {shouldShowExpanded() && (
                          <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="text-sm font-medium truncate"
                          >
                            {item.title}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>

                    {shouldShowExpanded() && (
                      <motion.div
                        animate={{ rotate: submenuOpen ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex-shrink-0"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </motion.div>
                    )}
                  </motion.div>
                ) : (
                  <Link to={item.path} onClick={closeMobileMenu}>
                    <motion.div
                      whileHover={{ scale: shouldShowExpanded() ? 1.02 : 1 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center p-3 rounded-xl cursor-pointer transition-all ${active ? "bg-white text-blue-700 shadow-lg" : "text-blue-100 hover:bg-blue-500 hover:text-white"
                        } ${!shouldShowExpanded() ? 'justify-center' : ''}`}
                    >
                      <div className={`p-2 rounded-lg ${active ? "bg-blue-100" : "bg-blue-500"
                        } ${!shouldShowExpanded() ? 'mx-auto' : ''}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <AnimatePresence>
                        {shouldShowExpanded() && (
                          <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="text-sm font-medium ml-3 truncate"
                          >
                            {item.title}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </Link>
                )}

                {/* Submenu Items */}
                {hasSub && (
                  <AnimatePresence>
                    {submenuOpen && shouldShowExpanded() && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="ml-4 pl-6 border-l-2 border-blue-400 flex flex-col space-y-1 overflow-hidden mt-1"
                      >
                        {item.subItems.map((sub) => {
                          const SubIcon = sub.icon
                          const subActive = location.pathname === sub.path

                          return (
                            <Link key={sub.title} to={sub.path} onClick={closeMobileMenu}>
                              <motion.div
                                whileHover={{ scale: 1.02, x: 4 }}
                                whileTap={{ scale: 0.98 }}
                                className={`flex items-center p-2 rounded-lg transition-all ${subActive
                                  ? "bg-blue-500 text-white shadow-md"
                                  : "text-blue-200 hover:bg-blue-400 hover:text-white"
                                  }`}
                              >
                                {SubIcon && (
                                  <SubIcon className="w-3 h-3 mr-2 flex-shrink-0" />
                                )}
                                <span className="text-xs font-medium truncate">
                                  {sub.title}
                                </span>
                              </motion.div>
                            </Link>
                          )
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            )
          })}
        </nav>

        {/* Logout Section */}
        {/* Logout Section */}
        <div className="p-4 border-t border-blue-500 space-y-3">
          {usuario && (
            <div className="flex flex-col text-sm text-blue-100 mb-2">
              <span className="font-semibold truncate">{usuario.nombre}</span>
              <span className="text-xs text-blue-200 truncate">{usuario.email}</span>
            </div>
          )}

          <button
            onClick={handleLogout}
            className={`flex items-center p-3 rounded-xl text-blue-100 hover:bg-red-500 hover:text-white w-full transition-all group ${!shouldShowExpanded() ? 'justify-center' : ''
              }`}
          >
            <div className="p-2 rounded-lg bg-blue-500 group-hover:bg-red-400 transition-colors">
              <LogOut className="w-4 h-4" />
            </div>
            <AnimatePresence>
              {shouldShowExpanded() && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="text-sm font-medium ml-3"
                >
                  Cerrar sesión
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>

      </motion.div>
    </>
  )
}