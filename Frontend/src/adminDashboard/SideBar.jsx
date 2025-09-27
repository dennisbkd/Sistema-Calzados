/* eslint-disable no-unused-vars */
"use client"

import { Link, useLocation } from "react-router"
import {
  LayoutDashboard,
  UserCheck,
  ShoppingCart,
  Package,
  Warehouse,
  LogOut,
  ChevronDown,
  ArrowRightToLine,
  ArrowLeftToLine,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"

export const SideBar = () => {
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(true)

  // Inicialización del submenu solo una vez
  const [usersMenuOpen, setUsersMenuOpen] = useState(() =>
    location.pathname.startsWith("/home/usuarios") ||
    location.pathname.startsWith("/home/roles")
  )

  const menuItems = [
    { title: "Dashboard", path: "/home", icon: LayoutDashboard },
    {
      title: "Gestión Usuarios",
      icon: UserCheck,
      subItems: [
        { title: "Usuarios", path: "/home/usuarios" },
        { title: "Roles", path: "/home/roles" },
      ],
    },
    { title: "Gestión Ventas", path: "/home/ventas", icon: ShoppingCart },
    { title: "Gestión Compras", path: "/home/compras", icon: Package },
    { title: "Gestión Inventario", path: "/home/inventario", icon: Warehouse },
  ]

  const handleLogout = () => {
    localStorage.removeItem("token")
    window.location.href = "/"
  }

  return (
    <motion.div
      animate={{ width: isOpen ? 250 : 100 }}
      transition={{ duration: 0.3 }}
      className="bg-slate-800 text-white h-full flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-700 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <Package className="w-5 h-5 text-white" />
          </div>
          <AnimatePresence>
            {isOpen && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h1 className="text-lg font-bold">Calzados</h1>
                <p className="text-sm text-slate-300">al Paso</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="text-white hover:bg-slate-500 hover:rounded-lg px-1 py-1 font-bold text-xl ">
          {isOpen ? <ArrowRightToLine /> : <ArrowLeftToLine />}
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const hasSub = !!item.subItems
          const isActive = location.pathname === item.path

          return (
            <div key={item.title}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
                className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer ${isActive ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-slate-700 hover:text-white"
                  }`}
                onClick={() => hasSub && setUsersMenuOpen((prev) => !prev)}
              >
                <div className="flex items-center gap-3">
                  {Icon && <Icon className="w-5 h-5" />}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-sm font-medium"
                      >
                        {item.title}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>

                {hasSub && isOpen && (
                  <motion.div
                    animate={{ rotate: usersMenuOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                )}
              </motion.div>

              {/* Submenu */}
              {hasSub && (
                <AnimatePresence>
                  {usersMenuOpen && isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="pl-10 flex flex-col space-y-1 overflow-hidden"
                    >
                      {item.subItems.map((sub) => (
                        <Link key={sub.title} to={sub.path}>
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.2 }}
                            className={`px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white ${location.pathname === sub.path ? "bg-blue-600 text-white" : ""
                              }`}
                          >
                            {sub.title}
                          </motion.div>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-slate-700">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-red-600 hover:text-white w-full"
        >
          <LogOut className="w-5 h-5" />
          <AnimatePresence>
            {isOpen && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm font-medium"
              >
                Cerrar sesión
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.div>
  )
}
